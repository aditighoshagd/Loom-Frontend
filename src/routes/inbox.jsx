import { useEffect, useMemo, useState } from "react";
import { useApiQuery } from "@/lib/use-api";
import { AppLayout } from "@/components/loom/AppLayout";
import { NewsletterCard } from "@/components/loom/NewsletterCard";
import { EmptyState } from "@/components/loom/EmptyState";
import { useRequireAuth, useAuth } from "@/lib/auth/context";
import { getFeed } from "@/lib/api/posts";
import { getSubscriptions } from "@/lib/api/connections";
import { rememberWriters } from "@/components/loom/writer-name-cache";
import { Inbox as InboxIcon } from "lucide-react";
import { isNewsletter } from "@/lib/loom-utils";
import { cn } from "@/lib/utils";

const READ_KEY = "loom_read_posts_v1";
function readRead() {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(window.localStorage.getItem(READ_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export default function InboxPage() {
  const { ready, userId } = useRequireAuth();
  const { token } = useAuth();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("latest");
  const [readIds] = useState(readRead());

  const feed = useApiQuery({
    queryFn: getFeed,
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

  const newsletters = useMemo(() => {
    const raw = (feed.data ?? []).filter(isNewsletter);
    const filtered = filter === "unread" ? raw.filter((p) => !readIds.has(p.id)) : raw;
    if (sort === "priority") {
      return [...filtered].sort((a, b) => (a.title?.length ?? 0) - (b.title?.length ?? 0));
    }
    return filtered;
  }, [feed.data, filter, sort, readIds]);

  if (!ready) return null;

  return (
    <AppLayout narrow>
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="font-serif text-3xl font-semibold">Inbox</h1>
        <div className="flex items-center gap-2 text-sm">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent border border-border rounded-md px-2 py-1"
          >
            <option value="latest">Latest</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2 border-b border-border mb-4">
        {["all", "unread"].map((k) => (
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
      {feed.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!feed.isLoading && newsletters.length === 0 && (
        <EmptyState
          icon={<InboxIcon className="size-6" />}
          title="No newsletters yet"
          description="Subscribe to your first writer to see their posts here."
        />
      )}
      <div className="space-y-4">
        {newsletters.map((p) => (
          <NewsletterCard key={p.id} post={p} unread={!readIds.has(p.id)} />
        ))}
      </div>
    </AppLayout>
  );
}
