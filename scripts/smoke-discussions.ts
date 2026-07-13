// Discussions smoke test: pnpm tsx scripts/smoke-discussions.ts
// Drives the real HTTP surface as a member: create post -> like -> comment.
export {};

const BASE = process.env.SMOKE_BASE ?? "http://localhost:3000";
const MEMBER = { email: "riya@ironcladmarketing.example", password: "member-test-2026" };

const jar = new Map<string, string>();
const cookieHeader = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");

function storeCookies(res: Response) {
  for (const raw of res.headers.getSetCookie()) {
    const [pair] = raw.split(";");
    const i = pair.indexOf("=");
    jar.set(pair.slice(0, i), pair.slice(i + 1));
  }
}

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { cookie: cookieHeader() },
    redirect: "manual",
  });
  storeCookies(res);
  return res;
}

/** React splits adjacent text nodes with <!-- --> — strip them before matching text. */
async function text(path: string) {
  const html = await (await get(path)).text();
  return { html, plain: html.replaceAll("<!-- -->", "") };
}

/** Replay a form's hidden inputs — works for both server-action encodings. */
function formFields(html: string, marker: string) {
  for (const [markup] of html.matchAll(/<form[\s\S]*?<\/form>/g)) {
    if (!markup.includes(marker)) continue;
    const fields: Record<string, string> = {};
    for (const input of markup.matchAll(/<input type="hidden"[^>]*>/g)) {
      const name = input[0].match(/name="([^"]*)"/)?.[1];
      if (!name) continue;
      fields[name] = (input[0].match(/value="([^"]*)"/)?.[1] ?? "")
        .replaceAll("&quot;", '"')
        .replaceAll("&amp;", "&");
    }
    return fields;
  }
  return null;
}

async function postForm(path: string, fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { cookie: cookieHeader(), origin: BASE },
    body: form,
    redirect: "manual",
  });
  storeCookies(res);
  return res;
}

const check = (ok: boolean, msg: string) => {
  console.log(`${ok ? "✅" : "❌"} ${msg}`);
  if (!ok) process.exitCode = 1;
};

async function login() {
  const { csrfToken } = (await (await get("/api/auth/csrf")).json()) as {
    csrfToken: string;
  };
  const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      cookie: cookieHeader(),
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ csrfToken, ...MEMBER, callbackUrl: BASE }),
    redirect: "manual",
  });
  storeCookies(res);
  if (!jar.has("authjs.session-token")) throw new Error("member login failed");
  console.log("✅ signed in as member");
}

async function main() {
  await login();

  // Create a post
  const title = `Smoke Post ${Date.now()}`;
  const newHtml = await (await get("/discussions/new")).text();
  const newFields = formFields(newHtml, 'name="title"');
  if (!newFields) throw new Error("create-post form not found");

  const created = await postForm("/discussions/new", {
    ...newFields,
    category: "Pricing & Contracts",
    title,
    body: "Body written by the discussions smoke test.",
  });
  check(created.status < 400, `post created (${created.status})`);

  // It shows in the feed, and the category filter finds it
  const feed = await (await get("/discussions")).text();
  check(feed.includes(title), "post appears in the feed");

  const filtered = await (
    await get(`/discussions?category=${encodeURIComponent("Pricing & Contracts")}`)
  ).text();
  check(filtered.includes(title), "post appears under its category filter");

  const otherCat = await (
    await get(`/discussions?category=${encodeURIComponent("Team Building")}`)
  ).text();
  check(!otherCat.includes(title), "post is hidden under a different category");

  const searched = await (await get(`/discussions?q=${encodeURIComponent(title)}`)).text();
  check(searched.includes(title), "post is findable by search");

  // Open it
  const postId = feed.match(new RegExp(`href="/discussions/([a-f0-9-]{36})"`))?.[1];
  if (!postId) throw new Error("could not find the post id in the feed");
  const postPath = `/discussions/${postId}`;

  // Like it
  let page = await text(postPath);
  const likeFields = formFields(page.html, "Like");
  if (!likeFields) throw new Error("like form not found");
  await postForm(postPath, likeFields);
  page = await text(postPath);
  check(page.plain.includes("1 Like"), "like registers on the post");

  // Unlike (same button toggles)
  await postForm(postPath, formFields(page.html, "Like")!);
  page = await text(postPath);
  check(page.plain.includes("0 Likes"), "like toggles back off");

  // Comment
  const commentFields = formFields(page.html, 'name="body"');
  if (!commentFields) throw new Error("comment form not found");
  await postForm(postPath, { ...commentFields, body: "Smoke test comment." });
  page = await text(postPath);
  check(page.plain.includes("Smoke test comment."), "comment posts and renders");

  console.log(`\n   test post left at ${BASE}${postPath}`);
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
