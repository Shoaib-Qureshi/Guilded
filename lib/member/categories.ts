// Shared by server queries and the client create-post form, so it can't live in
// the "server-only" module.
export const CATEGORIES = [
  "Client Management",
  "Team Building",
  "Pricing & Contracts",
  "Agency Operations",
  "Growth & Sales",
] as const;
