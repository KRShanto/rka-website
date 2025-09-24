import { getDbUser } from "@/lib/auth";
import AdminLayout from "./AdminLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDbUser();

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
