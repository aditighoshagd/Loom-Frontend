import { useMemo, useState } from "react";
import { useApiQuery } from "@/lib/use-api";
import { AppLayout } from "@/components/loom/AppLayout";
import { CategoryPills } from "@/components/loom/CategoryPills";
import { ExploreCard } from "@/components/loom/ExploreCard";
import { SearchBar } from "@/components/loom/SearchBar";
import { UserAvatar } from "@/components/loom/UserAvatar";
import { SubscribeButton } from "@/components/loom/SubscribeButton";
import { EmptyState } from "@/components/loom/EmptyState";
import { useAuth, useRequireAuth } from "@/lib/auth/context";
import { getExplore } from "@/lib/api/posts";
import { CATEGORY_NAMES, matchesCategory } from "@/lib/loom-utils";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function ExplorePage() {
  const { ready, token, userId } = useAuth();
  useRequireAuth();
  const [cat, setCat] = useState("All");
  const q = useApiQuery({
    queryFn: getExplore,
    enabled: !!token,
    deps: [token],
  });

  const posts = useMemo(
    () => (q.data ?? []).filter((p) => matchesCategory(p, cat)),
    [q.data, cat],
  );
  const [featured, ...rest] = posts;
  const writers = useMemo(() => {
    const seen = new Map();
    for (const p of q.data ?? []) if (p.userId !== userId && !seen.has(p.userId)) seen.set(p.userId, p.id);
    return Array.from(seen.keys()).slice(0, 6);
  }, [q.data, userId]);

  if (!ready) return null;

  return (
    <AppLayout
      right={
        <>
          <SearchBar />
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              New writers to follow
            </h3>
            <ul className="space-y-3">
              {writers.map((w) => (
                <li key={w} className="flex items-center gap-3">
                  <Link to={`/profile/${w}`}>
                    <UserAvatar userId={w} name={`Writer ${w}`} size="sm" />
                  </Link>
                  <div className="min-w-0 flex-1 text-sm truncate">
                    <Link
                      to={`/profile/${w}`}
                      className="font-medium hover:underline"
                    >
                      Writer #{w}
                    </Link>
                  </div>
                  <SubscribeButton targetUserId={w} isSubscribed={false} />
                </li>
              ))}
              {writers.length === 0 && (
                <p className="text-sm text-muted-foreground">No suggestions yet.</p>
              )}
            </ul>
          </div>
        </>
      }
    >
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold">Explore</h1>
        <p className="text-muted-foreground text-sm mt-1">Discover writers and trending posts.</p>
      </div>
      <div className="lg:hidden mb-4">
        <SearchBar />
      </div>
      <CategoryPills categories={CATEGORY_NAMES} active={cat} onChange={setCat} />
      {q.isLoading && <p className="text-sm text-muted-foreground mt-4">Loading…</p>}
      {!q.isLoading && posts.length === 0 && (
        <EmptyState
          icon={<Compass className="size-6" />}
          title="Nothing to show"
          description="Try a different category or check back later."
        />
      )}
      {featured && (
        <div className="mt-6">
          <ExploreCard post={featured} featured />
        </div>
      )}
      {rest.length > 0 && (
        <div className="grid gap-5 mt-5 sm:grid-cols-2">
          {rest.map((p) => (
            <ExploreCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
