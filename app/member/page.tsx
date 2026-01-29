import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { MemberDashboard } from "./member-dashboard";

export default async function MemberPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "MEMBER") redirect("/dashboard");
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <MemberDashboard
        userId={session.user.id}
        initialCredits={session.user.credits ?? 0}
      />
    </div>
  );
}
