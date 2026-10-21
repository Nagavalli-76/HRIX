import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { adminNav } from "@/lib/dashboard-nav";
import { listNotifications } from "@/lib/api/notifications";
import { getSession } from "@/lib/api/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [notifications, session] = await Promise.all([listNotifications(), getSession()]);
  if (session?.role !== "admin") redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar role="admin" />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader role="admin" userName="HRIX Admin" notifications={notifications} />
        <main id="main" className="flex-1 px-4 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
