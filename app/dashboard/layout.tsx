import { getDbUser } from "@/lib/auth";
import DashboardLayout from "./DashboardLayout";
import { Suspense } from "react";

// Loading component for the layout
function LayoutLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Component that fetches user data
async function DashboardContent({ children }: { children: React.ReactNode }) {
  const user = await getDbUser();
  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LayoutLoading />}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
