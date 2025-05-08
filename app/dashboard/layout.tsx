import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="h-screen flex dark:bg-[#1F1F1F]">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto bg-[#F7F8FA] dark:bg-[#1F1F1F]">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
