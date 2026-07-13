// Auth smoke test against a running dev server: pnpm tsx scripts/smoke-auth.ts
// Covers the security-critical paths: login gating and password reset.
export {}; // keep this a module so `BASE` doesn't collide with the other smoke script

const BASE = process.env.SMOKE_BASE ?? "http://localhost:3000";

/**
 * Grab the <form> containing `marker` and return its hidden inputs.
 * Server actions encode themselves as hidden fields — either $ACTION_ID_<hash>
 * (server-component forms) or $ACTION_REF_n/$ACTION_n:x (useActionState forms).
 * Replaying them verbatim works for both without caring which is which.
 */
function hiddenFieldsOfForm(html: string, marker: string) {
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
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { origin: BASE }, // Next rejects server actions without Origin
    body: form,
    redirect: "manual",
  });
}

const check = (ok: boolean, msg: string) => {
  console.log(`${ok ? "✅" : "❌"} ${msg}`);
  if (!ok) process.exitCode = 1;
};

async function main() {
  for (const p of ["/login", "/forgot-password"]) {
    const res = await fetch(`${BASE}${p}`, { redirect: "manual" });
    check(res.status === 200, `${p} is public (${res.status})`);
  }

  for (const p of ["/dashboard", "/members", "/events"]) {
    const res = await fetch(`${BASE}${p}`, { redirect: "manual" });
    const loc = res.headers.get("location") ?? "";
    check(
      res.status >= 300 && res.status < 400 && loc.includes("/login"),
      `${p} redirects to /login when logged out (${res.status})`
    );
  }

  const html = await (await fetch(`${BASE}/forgot-password`)).text();
  const hidden = hiddenFieldsOfForm(html, 'name="email"');
  if (!hidden) throw new Error("reset form not found");

  const real = await postForm("/forgot-password", {
    ...hidden,
    email: "moderator@guilded.app",
  });
  const unknown = await postForm("/forgot-password", {
    ...hidden,
    email: "nobody@nowhere.example",
  });
  check(
    real.status === unknown.status && real.status < 400,
    `reset: identical response for real vs unknown email — no account enumeration (${real.status}/${unknown.status})`
  );
  console.log("   reset link for the real account is printed in the dev-server log");
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
