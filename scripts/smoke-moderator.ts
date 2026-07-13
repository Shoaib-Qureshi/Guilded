// End-to-end smoke test against a running dev server.
// Drives the real HTTP surface: login, then the create-event server action.
//   pnpm dev   (in one terminal)
//   pnpm tsx scripts/smoke-moderator.ts
export {}; // keep this a module so `BASE` doesn't collide with the other smoke script

const BASE = process.env.SMOKE_BASE ?? "http://localhost:3000";
const EMAIL = "moderator@guilded.app";
const PASSWORD = "guilded-mod-2026";

const jar = new Map<string, string>();

function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

function storeCookies(res: Response) {
  for (const raw of res.headers.getSetCookie()) {
    const [pair] = raw.split(";");
    const idx = pair.indexOf("=");
    jar.set(pair.slice(0, idx), pair.slice(idx + 1));
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

async function login() {
  const csrfRes = await get("/api/auth/csrf");
  const { csrfToken } = (await csrfRes.json()) as { csrfToken: string };

  const res = await fetch(`${BASE}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      cookie: cookieHeader(),
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      csrfToken,
      email: EMAIL,
      password: PASSWORD,
      callbackUrl: `${BASE}/dashboard`,
    }),
    redirect: "manual",
  });
  storeCookies(res);
  if (!jar.has("authjs.session-token")) throw new Error("login failed");
  console.log("✅ logged in as moderator");
}

/**
 * Pull the action id out of the <form> that contains `marker`.
 * Scoping matters: the page has several action forms (the sidebar's logout is
 * first in the DOM), so grabbing the first $ACTION_ID on the page calls the wrong one.
 */
function actionIdForForm(html: string, marker: string) {
  for (const form of html.matchAll(/<form[\s\S]*?<\/form>/g)) {
    const [markup] = form;
    if (!markup.includes(marker)) continue;
    const id = markup.match(/\$ACTION_ID_([a-f0-9]+)/)?.[1];
    if (id) return id;
  }
  return null;
}

async function main() {
  await login();

  const eventsHtml = await (await get("/events")).text();
  const createActionId = actionIdForForm(eventsHtml, 'name="title"');
  if (!createActionId) throw new Error("no create-event action found on /events");

  const title = `Smoke Test Event ${Date.now()}`;
  const form = new FormData();
  form.set("title", title);
  form.set("description", "Created by scripts/smoke-moderator.ts");
  form.set("hostName", "Ananya Bhat");
  form.set("category", "Guild Meeting");
  form.set("scheduledAt", "2026-09-01T18:00");
  form.set("durationMinutes", "75");
  form.set("seatLimit", "25");

  // Browser (no-JS) path: the hidden $ACTION_ID_<hash> field, no Next-Action header.
  form.set(`$ACTION_ID_${createActionId}`, "");

  const res = await fetch(`${BASE}/events`, {
    method: "POST",
    // Next rejects server actions without Origin (CSRF guard); browsers always send it.
    headers: { cookie: cookieHeader(), origin: BASE },
    body: form,
    redirect: "manual",
  });
  console.log(
    `   createEvent action -> ${res.status} location=${res.headers.get("location")} x-action-redirect=${res.headers.get("x-action-redirect")}`
  );

  const after = await (await get("/events")).text();
  if (!after.includes(title)) throw new Error("event was not created");
  console.log(`✅ event created and rendered: ${title}`);
}

main().catch((error) => {
  console.error("❌", error.message);
  process.exit(1);
});
