import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useApiQuery } from "@/lib/use-api";
import { AppLayout } from "@/components/loom/AppLayout";
import { UserAvatar } from "@/components/loom/UserAvatar";
import { SubscribeButton } from "@/components/loom/SubscribeButton";
import { NoteCard } from "@/components/loom/NoteCard";
import { EmptyState } from "@/components/loom/EmptyState";
import { useAuth, useRequireAuth } from "@/lib/auth/context";
import { getPostsByUser } from "@/lib/api/posts";
import { getSubscriberCount, getSubscriptions } from "@/lib/api/connections";
import { getUserProfile } from "@/lib/api/auth";
import { rememberWriter, rememberWriters, writerName } from "@/components/loom/writer-name-cache";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default function ProfilePage() {
  const { userId: paramId } = useParams();
  const uid = Number(paramId);
  const { userId: me, ready, token } = useAuth();
  useRequireAuth();
  const [tab, setTab] = useState("posts");

  const posts = useApiQuery({
    queryFn: () => getPostsByUser(uid),
    enabled: !!token && Number.isFinite(uid),
    deps: [token, uid],
  });
  const count = useApiQuery({
    queryFn: () => getSubscriberCount(uid),
    enabled: !!token && Number.isFinite(uid),
    deps: [token, uid],
  });
  const mySubs = useApiQuery({
    queryFn: () => getSubscriptions(me),
    enabled: !!me,
    deps: [me],
  });
  const userProfile = useApiQuery({
    queryFn: () => getUserProfile(uid),
    enabled: !!token && Number.isFinite(uid) && !writerName(uid),
    deps: [token, uid],
  });
  useEffect(() => {
    if (mySubs.data) rememberWriters(mySubs.data);
  }, [mySubs.data]);
  useEffect(() => {
    const known = writerName(uid);
    if (!known && mySubs.data) {
      const hit = mySubs.data.find((p) => p.userId === uid);
      if (hit) rememberWriter(uid, hit.name);
    }
  }, [uid, mySubs.data]);
  useEffect(() => {
    if (userProfile.data) {
      rememberWriter(uid, userProfile.data.name);
    }
  }, [uid, userProfile.data]);

  const displayName = writerName(uid) ?? userProfile.data?.name ?? `Writer #${uid}`;
  const isFollowing = (mySubs.data ?? []).some((p) => p.userId === uid);

  const filtered = useMemo(() => {
    const all = posts.data ?? [];
    return tab === "posts"
      ? all.filter((p) => p.title && p.title.trim().length > 0)
      : all.filter((p) => !p.title || p.title.trim().length === 0);
  }, [posts.data, tab]);

  if (!ready) return null;

  return (
    <AppLayout>
      <div className="h-40 rounded-lg bg-gradient-to-br from-primary/40 via-primary/20 to-transparent" />
      <div className="flex items-end gap-4 -mt-12 px-2">
        <UserAvatar userId={uid} name={displayName} size="xl" className="ring-4 ring-background" />
        <div className="flex-1 pb-2">
          <h1 className="font-serif text-3xl font-semibold">{displayName}</h1>
          <p className="text-sm text-muted-foreground">
            {count.data ?? "—"} subscribers · {posts.data?.length ?? 0} posts
          </p>
        </div>
        {me !== uid && (
          <div className="pb-2">
            <SubscribeButton targetUserId={uid} isSubscribed={isFollowing} size="default" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-border mt-6">
        {["posts", "notes"].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px capitalize",
              tab === k
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="space-y-4 mt-4">
        {posts.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!posts.isLoading && filtered.length === 0 && (
          <EmptyState
            icon={<Sparkles className="size-6" />}
            title={me === uid ? "You haven't published anything yet" : "This writer hasn't published anything yet."}
            description={me === uid ? "Try writing your first post." : undefined}
          />
        )}
        {filtered.map((p) => (
          <NoteCard key={p.id} post={p} />
        ))}
      </div>
    </AppLayout>
  );
}
