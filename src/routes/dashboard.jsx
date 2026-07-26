import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApiQuery } from "@/lib/use-api";
import { format } from "date-fns";
import { AppLayout } from "@/components/loom/AppLayout";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/loom/EmptyState";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth, useRequireAuth } from "@/lib/auth/context";
import { getComments, getPostsByUser } from "@/lib/api/posts";
import { getSubscriberCount } from "@/lib/api/connections";
import { FileText } from "lucide-react";

export default function DashboardPage() {
  const { ready, userId, token } = useAuth();
  useRequireAuth();

  const posts = useApiQuery({
    queryFn: () => getPostsByUser(userId),
    enabled: !!userId && !!token,
    deps: [userId, token],
  });

  const subs = useApiQuery({
    queryFn: () => getSubscriberCount(userId),
    enabled: !!userId && !!token,
    deps: [userId, token],
  });

  const list = posts.data ?? [];
  const [commentCounts, setCommentCounts] = useState({});

  useEffect(() => {
    if (!list.length) return;
    let isMounted = true;
    Promise.all(
      list.map((p) =>
        getComments(p.id)
          .then((cs) => ({ postId: p.id, count: cs.length }))
          .catch(() => ({ postId: p.id, count: 0 })),
      ),
    ).then((results) => {
      if (!isMounted) return;
      const map = {};
      results.forEach((r) => {
        map[r.postId] = r.count;
      });
      setCommentCounts(map);
    });
    return () => {
      isMounted = false;
    };
  }, [list]);

  const totalComments = Object.values(commentCounts).reduce((a, b) => a + b, 0);

  if (!ready) return null;

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
        <Button asChild className="rounded-full bg-primary text-primary-foreground hover:brightness-110">
          <Link to="/create">New post</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Stat label="Total posts" value={list.length} />
        <Stat label="Subscribers" value={subs.data ?? "—"} />
        <Stat label="Total comments" value={totalComments} />
      </div>

      {posts.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!posts.isLoading && list.length === 0 && (
        <EmptyState
          icon={<FileText className="size-6" />}
          title="No posts yet"
          description="Publish your first post to start growing an audience."
          action={
            <Button asChild className="rounded-full">
              <Link to="/create">Write a post</Link>
            </Button>
          }
        />
      )}

      {list.length > 0 && (
        <TooltipProvider>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Comments</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        to={`/post/${p.id}`}
                        className="font-medium hover:underline"
                      >
                        {p.title ?? p.content.slice(0, 60) + "…"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {(() => {
                        try {
                          return format(new Date(p.createdAt + "Z"), "MMM d, yyyy");
                        } catch {
                          return p.createdAt;
                        }
                      })()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {commentCounts[p.id] ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/create?edit=${p.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button variant="ghost" size="sm" disabled>
                              Delete
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>Not supported yet</TooltipContent>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TooltipProvider>
      )}
    </AppLayout>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-serif text-3xl font-semibold mt-2">{value}</p>
    </div>
  );
}
