import { requireAuth } from "@/lib/auth";
import { listBranches } from "@/actions/branches";
import { adminListUsers } from "@/actions/admin-users";
import UsersClient from "./client";

export default async function UserManagement() {
  const currentUser = await requireAuth();
  const [users, branches] = await Promise.all([
    adminListUsers(),
    listBranches(),
  ]);

  return (
    <UsersClient
      users={users}
      branches={branches}
      currentUserId={currentUser.id}
    />
  );
}
