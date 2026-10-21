import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { creatorNav } from "@/lib/dashboard-nav";
import { listNotifications } from "@/lib/api/notifications";
import { getSession } from "@/lib/api/auth";

export default async function CreatorDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [notifications, session] = await Promise.all([listNotifications(), getSession()]);

  return (
    <div className="flex min-h-screen">
      <Sidebar role="creator" />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader role="creator" userName={session?.name ?? "Creator"} notifications={notifications} />
        <main id="main" className="flex-1 px-4 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
