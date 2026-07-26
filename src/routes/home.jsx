import { useEffect, useState } from "react";
import { useApiQuery, useApiMutation } from "@/lib/use-api";
import { AppLayout } from "@/components/loom/AppLayout";
import { NoteCard } from "@/components/loom/NoteCard";
import { SearchBar } from "@/components/loom/SearchBar";
import { UserAvatar } from "@/components/loom/UserAvatar";
import { EmptyState } from "@/components/loom/EmptyState";
import { SubscribeButton } from "@/components/loom/SubscribeButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, useRequireAuth } from "@/lib/auth/context";
import { createPost, getExplore, getFeed } from "@/lib/api/posts";
import { getSubscriptions } from "@/lib/api/connections";
import { rememberWriters } from "@/components/loom/writer-name-cache";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  const { userId, ready, token } = useRequireAuth();
  const [tab, setTab] = useState("foryou");

  const following = useApiQuery({
    queryFn: getFeed,
    enabled: !!token && tab === "following",
    deps: [token, tab],
  });
  const foryou = useApiQuery({
    queryFn: getExplore,
    enabled: !!token,
    deps: [token],
  });
  const subs = useApiQuery({
    queryFn: () => getSubscriptions(userId),
    enabled: !!userId,
    deps: [userId],
  });

  useEffect(() => {
    if (subs.data) rememberWriters(subs.data);
  }, [subs.data]);

  if (!ready) return null;

  const active = tab === "foryou" ? foryou : following;
  const posts = active.data ?? [];

  return (
    <AppLayout right={<RightRail subs={subs.data ?? []} suggested={foryou.data ?? []} />}>
      <QuickNoteComposer onPostCreated={() => { foryou.refetch(); following.refetch(); }} />

      <div className="flex items-center gap-2 border-b border-border mt-6">
        <TabBtn active={tab === "foryou"} onClick={() => setTab("foryou")}>
          For you
        </TabBtn>
        <TabBtn active={tab === "following"} onClick={() => setTab("following")}>
          Following
        </TabBtn>
      </div>

      <div className="space-y-4 mt-4">
        {active.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {active.isError && (
          <p className="text-sm text-destructive">{active.error?.message}</p>
        )}
        {!active.isLoading && posts.length === 0 && (
          <EmptyState
            icon={<Sparkles className="size-6" />}
            title={tab === "following" ? "Your feed is quiet" : "No posts yet"}
            description={
              tab === "following"
                ? "You're not following any writers yet. Head to Explore!"
                : "Be the first to write something."
            }
            action={
              <Button asChild className="rounded-full">
                <Link to="/explore">Explore writers</Link>
              </Button>
            }
          />
        )}
        {posts.map((p) => (
          <NoteCard key={p.id} post={p} />
        ))}
      </div>
    </AppLayout>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-4 py-2 text-sm font-medium border-b-2 -mb-px " +
        (active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function QuickNoteComposer({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const mut = useApiMutation({
    mutationFn: async (c) => {
      const form = new FormData();
      form.append(
        "post",
        new Blob(
          [JSON.stringify({ title: null, subTitle: null, content: c, parentPostId: null })],
          { type: "application/json" },
        ),
      );
      return createPost(form);
    },
    onSuccess: () => {
      setContent("");
      setOpen(false);
      if (onPostCreated) onPostCreated();
      toast.success("Note published");
    },
    onError: (e) => toast.error(e?.message),
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full text-left text-muted-foreground"
        >
          Write something…
        </button>
      ) : (
        <>
          <Textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Share a quick note…"
            className="border-0 bg-transparent p-0 focus-visible:ring-0 resize-none"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false);
                setContent("");
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!content.trim() || mut.isPending}
              onClick={() => mut.mutate(content.trim())}
            >
              Publish Note
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function RightRail({ subs, suggested }) {
  const { userId } = useAuth();
  const subIds = new Set(subs.map((s) => s.userId));
  const suggestList = Array.from(
    new Map(
      suggested
        .filter((p) => p.userId !== userId && !subIds.has(p.userId))
        .map((p) => [p.userId, p]),
    ).values(),
  ).slice(0, 5);

  return (
    <>
      <SearchBar />
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Your Subscriptions
        </h3>
        {subs.length === 0 ? (
          <p className="text-sm text-muted-foreground">You're not following anyone yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subs.slice(0, 12).map((s) => (
              <Link key={s.userId} to={`/profile/${s.userId}`}>
                <UserAvatar name={s.name} userId={s.userId} size="md" />
              </Link>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Suggested writers
        </h3>
        {suggestList.length === 0 ? (
          <p className="text-sm text-muted-foreground">No suggestions yet.</p>
        ) : (
          <ul className="space-y-3">
            {suggestList.map((s) => (
              <li key={s.userId} className="flex items-center gap-3">
                <Link to={`/profile/${s.userId}`}>
                  <UserAvatar userId={s.userId} name={`Writer ${s.userId}`} size="sm" />
                </Link>
                <div className="min-w-0 flex-1 text-sm truncate">
                  <Link
                    to={`/profile/${s.userId}`}
                    className="font-medium hover:underline"
                  >
                    Writer #{s.userId}
                  </Link>
                </div>
                <SubscribeButton targetUserId={s.userId} isSubscribed={false} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
