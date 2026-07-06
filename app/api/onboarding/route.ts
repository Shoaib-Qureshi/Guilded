import { NextResponse } from "next/server";

const WEBHOOK = "https://a1.apix-drive.com/web-hooks/15241/p1h1m7x1";

export async function POST(request: Request) {
  const body = await request.json();

  const upstream = await fetch(WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!upstream.ok) {
    return NextResponse.json({ error: "Upstream webhook failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
