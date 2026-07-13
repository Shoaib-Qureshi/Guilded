import { Suspense } from "react";

import { MemberSidebar } from "@/components/member/sidebar";
import { MemberTopbar } from "@/components/member/topbar";
import { requireUser } from "@/lib/dal";
import { getActivity } from "@/lib/member/discussions";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Any active account; moderators can browse the member side too.
  const user = await requireUser();
  const activity = await getActivity(user.id);

  return (
    <div className="flex h-screen bg-portal-bg font-sans text-portal-cream">
      <MemberSidebar name={user.name} activity={activity} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* useSearchParams in the topbar needs a Suspense boundary. */}
        <Suspense fallback={<div className="h-[110px]" />}>
          <MemberTopbar />
        </Suspense>
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
