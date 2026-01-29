import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminDashboard } from "./admin-dashboard";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminDashboard />
    </div>
  );
}
