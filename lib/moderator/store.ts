import fs from "node:fs";
import path from "node:path";

// ponytail: session requests are Phase 2 (docs/figma-screen-map.md) — the mod
// dashboard section they appear in is designed, so it renders from this mock
// until the user-side request flow + session_requests table exist.

export type SessionRequest = {
  id: string;
  kind: "topic" | "host";
  upvotes?: number;
  title: string;
  description: string;
  requester: string;
  meta: string;
  status: "pending" | "approved";
};

const SEED: SessionRequest[] = [
  {
    id: "white-label-vs-own-brand",
    kind: "topic",
    upvotes: 11,
    title: "Navigating White-Label vs. Own Brand",
    description:
      "Real trade-offs from founders who've made the call — not theoretical frameworks.",
    requester: "Rajan Iyer · Crescent Design House",
    meta: "45 min · Open Discussion",
    status: "pending",
  },
  {
    id: "client-onboarding-scope-creep",
    kind: "host",
    title: "Client Onboarding That Prevents Scope Creep",
    description:
      "A walkthrough of a rebuilt onboarding process — intake, brief templates, milestone sign-offs, and the contract cla...",
    requester: "Rajan Iyer · Crescent Design House",
    meta: "45 min · Open Discussion",
    status: "pending",
  },
];

const STORE_PATH = path.join(process.cwd(), ".moderator-store.json");

export function readSessionRequests(): SessionRequest[] {
  try {
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
  } catch {
    return structuredClone(SEED);
  }
}

export function approveMockSessionRequest(id: string) {
  const requests = readSessionRequests();
  const request = requests.find((r) => r.id === id);
  if (request) {
    request.status = "approved";
    fs.writeFileSync(STORE_PATH, JSON.stringify(requests, null, 2));
  }
}
