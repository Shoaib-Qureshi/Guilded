import { db } from "@/lib/db";
import { verifyInviteToken } from "@/lib/invites";

import { SetPasswordForm } from "./set-password-form";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const userId = await verifyInviteToken(token);

  if (!userId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-portal-bg px-4 font-sans text-portal-cream">
        <div className="w-full max-w-sm rounded-2xl bg-portal-card p-6 text-center ring-1 ring-portal-cream/8">
          <h1 className="mb-2 font-serif text-2xl">Invite not valid</h1>
          <p className="text-sm text-portal-muted">
            This link has expired or has already been used. Ask a moderator to
            send you a new one.
          </p>
        </div>
      </main>
    );
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-portal-bg px-4 font-sans text-portal-cream">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl">Welcome to Guilded</h1>
          <p className="mt-1 text-sm text-portal-muted">
            {user?.name}, set a password to activate your account.
          </p>
        </div>
        <SetPasswordForm token={token} email={user?.email ?? ""} />
      </div>
    </main>
  );
}
