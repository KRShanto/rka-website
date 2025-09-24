import { DbUser, requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PageClient from "./client";

export default async function IDPage() {
  const auth = await requireAuth();
  const user = await prisma.user.findUnique({
    where: {
      id: auth.id,
    },
    include: {
      branch: true,
    },
  });

  return <PageClient user={user as DbUser & { branch: { name: string } }} />;
}
