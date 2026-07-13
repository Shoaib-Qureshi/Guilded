// Member-shell smoke test: pnpm tsx scripts/smoke-member.ts
export {};

const BASE = process.env.SMOKE_BASE ?? "http://localhost:3000";
const MEMBER = { email: "riya@ironcladmarketing.example", password: "member-test-2026" };

const jar = new Map<string, string>();
const cookieHeader = () =>
  [...jar].map(([k, v]) => `${k}=${v}`).join("; ");

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

const check = (ok: boolean, msg: string) => {
  console.log(`${ok ? "✅" : "❌"} ${msg}`);
  if (!ok) process.exitCode = 1;
};

async function main() {
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
  check(jar.has("authjs.session-token"), "member can sign in");

  // Member shell renders
  for (const path of ["/discussions", "/sessions", "/client-experience"]) {
    const page = await get(path);
    const html = await page.text();
    check(
      page.status === 200 && html.includes("Riya Mehta"),
      `${path} renders the member shell (${page.status})`
    );
  }

  // Members must not reach the moderator side
  const dash = await get("/dashboard");
  check(
    dash.status === 307 && (dash.headers.get("location") ?? "").includes("/discussions"),
    `member on /dashboard is bounced to /discussions (${dash.status})`
  );
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
