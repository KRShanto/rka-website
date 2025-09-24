import { requireAuth } from "@/lib/auth";
import { getSettingsProfile } from "@/actions/profile";
import { listBranches } from "@/actions/branches";
import SettingsClient from "./client";

export default async function SettingsPage() {
  const user = await requireAuth();
  const [profile, branches] = await Promise.all([
    getSettingsProfile(),
    listBranches(),
  ]);

  return (
    <SettingsClient
      initialProfile={profile}
      branches={branches}
      auth={{ email: user.email || "", username: user.username }}
    />
  );
}
