import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { brandNav } from "@/lib/dashboard-nav";
import { listNotifications } from "@/lib/api/notifications";
import { getSession } from "@/lib/api/auth";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: "Brand Dashboard",
};

export default async function BrandDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [notifications, session] = await Promise.all([listNotifications(), getSession()]);

  return (
    <div className="flex min-h-screen">
      <Sidebar role="brand" />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader role="brand" userName={session?.name ?? "Brand"} notifications={notifications} />
        <main id="main" className="flex-1 px-4 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
