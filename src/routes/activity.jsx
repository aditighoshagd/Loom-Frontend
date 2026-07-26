import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApiQuery } from "@/lib/use-api";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import { AppLayout } from "@/components/loom/AppLayout";
import { EmptyState } from "@/components/loom/EmptyState";
import { UserAvatar } from "@/components/loom/UserAvatar";
import { useRequireAuth } from "@/lib/auth/context";
import { getComments, getPostsByUser } from "@/lib/api/posts";
import { writerName } from "@/components/loom/writer-name-cache";
import { cn } from "@/lib/utils";

export default function ActivityPage() {
  const { ready, userId, token } = useRequireAuth();
  const [filter, setFilter] = useState("all");
  const [commentsMap, setCommentsMap] = useState({});

  const posts = useApiQuery({
    queryFn: () => getPostsByUser(userId),
    enabled: !!userId && !!token,
    deps: [userId, token],
  });

  const postList = posts.data ?? [];

  useEffect(() => {
    if (!postList.length) return;
    let isMounted = true;
    Promise.all(
      postList.map((p) =>
        getComments(p.id)
          .then((cs) => ({ postId: p.id, cs }))
          .catch(() => ({ postId: p.id, cs: [] })),
      ),
    ).then((results) => {
      if (!isMounted) return;
      const map = {};
      results.forEach((r) => {
        map[r.postId] = r.cs;
      });
      setCommentsMap(map);
    });
    return () => {
      isMounted = false;
    };
  }, [postList]);

  const items = useMemo(() => {
    const all = [];
    postList.forEach((p) => {
      const cs = commentsMap[p.id] ?? [];
      for (const c of cs) {
        if (c.userId === userId) continue;
        all.push({
          id: `c-${c.id}`,
          type: "comment",
          actor: c.userId,
          postId: p.id,
          content: c.content,
          createdAt: c.createdAt,
        });
      }
    });
    return all.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  }, [postList, commentsMap, userId]);

  const filtered = filter === "all" ? items : items;

  if (!ready) return null;

  return (
    <AppLayout narrow>
      <h1 className="font-serif text-3xl font-semibold mb-4">Activity</h1>
      <div className="flex items-center gap-2 border-b border-border mb-4">
        {["all", "replies"].map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px capitalize",
              filter === k
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      {posts.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!posts.isLoading && filtered.length === 0 && (
        <EmptyState
          icon={<MessageCircle className="size-6" />}
          title="No activity yet"
          description="Your likes and comments will appear here."
        />
      )}
      <ul className="space-y-3">
        {filtered.map((it) => {
          const name = writerName(it.actor) ?? `Writer #${it.actor}`;
          return (
            <li
              key={it.id}
              className="rounded-lg border border-border bg-card p-4 flex gap-3"
            >
              <UserAvatar name={name} userId={it.actor} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{name}</span>{" "}
                  <span className="text-muted-foreground">
                    commented on your post ·{" "}
                    {formatDistanceToNow(new Date(it.createdAt + "Z"), { addSuffix: true })}
                  </span>
                </p>
                <Link
                  to={`/post/${it.postId}`}
                  className="block mt-1 text-sm text-muted-foreground hover:text-foreground line-clamp-2"
                >
                  “{it.content}”
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </AppLayout>
  );
}
