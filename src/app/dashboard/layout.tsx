import { UserSidebar } from "@/components/layout/UserSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <UserSidebar />
        <div className="flex-1 space-y-6">{children}</div>
      </div>
    </div>
  );
}
