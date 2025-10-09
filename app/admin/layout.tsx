import { getDbUser } from "@/lib/auth";
import AdminLayout from "./AdminLayout";
import { notFound, redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDbUser();

  // check if user is admin
  if (!user?.isAdmin) {
    notFound();
  }

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
