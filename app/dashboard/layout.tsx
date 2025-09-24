import { getDbUser } from "@/lib/auth";
import DashboardLayout from "./DashboardLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDbUser();
  console.log(user);
  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
