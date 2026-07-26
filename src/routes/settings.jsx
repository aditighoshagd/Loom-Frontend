import { useState } from "react";
import { AppLayout } from "@/components/loom/AppLayout";
import { UserAvatar } from "@/components/loom/UserAvatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth, useRequireAuth } from "@/lib/auth/context";
import { uploadFile } from "@/lib/api/uploads";
import { updateProfilePicture } from "@/lib/api/auth";
import { decodeToken } from "@/lib/api/jwt";
import { toast } from "sonner";

export default function SettingsPage() {
  const { ready, token, userId, logout } = useAuth();
  useRequireAuth();
  const [avatar, setAvatar] = useState(null);
  const [busy, setBusy] = useState(false);
  const payload = token ? decodeToken(token) : null;
  const email = payload?.email ?? "";

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadFile(f);
      const user = await updateProfilePicture(url);
      setAvatar(user.profilePictureUrl);
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!ready) return null;

  return (
    <AppLayout narrow>
      <h1 className="font-serif text-3xl font-semibold mb-6">Settings</h1>
      <section className="rounded-lg border border-border bg-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <UserAvatar userId={userId ?? 0} name={email || "You"} src={avatar} size="xl" />
          <div>
            <p className="font-medium">Profile picture</p>
            <p className="text-sm text-muted-foreground">PNG or JPG, up to a few MB.</p>
            <label className="mt-2 inline-flex">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFile}
                disabled={busy}
              />
              <span className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm cursor-pointer hover:bg-accent">
                {busy ? "Uploading…" : "Change photo"}
              </span>
            </label>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={email} readOnly />
        </div>
        <div className="space-y-1.5">
          <Label>User ID</Label>
          <Input value={String(userId ?? "")} readOnly />
        </div>
        <div>
          <Button variant="destructive" onClick={logout} className="rounded-full">
            Log out
          </Button>
        </div>
      </section>
    </AppLayout>
  );
}
