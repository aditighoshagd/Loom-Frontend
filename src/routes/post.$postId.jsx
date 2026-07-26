import { Link, useParams } from "react-router-dom";
import { useApiQuery } from "@/lib/use-api";
import { format } from "date-fns";
import { AppLayout } from "@/components/loom/AppLayout";
import { UserAvatar } from "@/components/loom/UserAvatar";
import { LikeButton } from "@/components/loom/LikeButton";
import { ReloomPopover } from "@/components/loom/ReloomPopover";
import { SubscribeButton } from "@/components/loom/SubscribeButton";
import { CommentSection } from "@/components/loom/CommentSection";
import { AIAssistantPanel } from "@/components/loom/AIAssistantPanel";
import { EmptyState } from "@/components/loom/EmptyState";
import { useAuth, useRequireAuth } from "@/lib/auth/context";
import { getComments, getPost } from "@/lib/api/posts";
import { getSubscriptions } from "@/lib/api/connections";
import { readTimeMinutes } from "@/lib/loom-utils";
import { writerName } from "@/components/loom/writer-name-cache";
import { MessageCircle } from "lucide-react";

export default function PostPage() {
  const { postId } = useParams();
  const pid = Number(postId);
  const { ready, token, userId: me } = useAuth();
  useRequireAuth();

  const post = useApiQuery({
    queryFn: () => getPost(pid),
    enabled: !!token && !!pid,
    deps: [token, pid],
  });

  const comments = useApiQuery({
    queryFn: () => getComments(pid),
    enabled: !!token && !!pid,
    deps: [token, pid],
  });

  const mySubs = useApiQuery({
    queryFn: () => getSubscriptions(me),
    enabled: !!me,
    deps: [me],
  });

  if (!ready) return null;

  if (post.isLoading) {
    return (
      <AppLayout narrow>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </AppLayout>
    );
  }
  if (post.error || !post.data) {
    return (
      <AppLayout narrow>
        <EmptyState title="Post not found" description={post.error?.message} />
      </AppLayout>
    );
  }

  const p = post.data;
  const name = writerName(p.userId) ?? `Writer #${p.userId}`;
  const isFollowing = (mySubs.data ?? []).some((s) => s.userId === p.userId);
  const dateStr = (() => {
    try {
      return format(new Date(p.createdAt + "Z"), "MMM d, yyyy");
    } catch {
      return p.createdAt;
    }
  })();

  return (
    <AppLayout narrow>
      <article className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 py-4 border-b border-border">
          <Link to={`/profile/${p.userId}`}>
            <UserAvatar userId={p.userId} name={name} size="md" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              to={`/profile/${p.userId}`}
              className="text-sm font-semibold hover:underline"
            >
              {name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {dateStr} · {readTimeMinutes(p.content)} min read
            </p>
          </div>
          {me !== p.userId && (
            <SubscribeButton targetUserId={p.userId} isSubscribed={isFollowing} />
          )}
        </div>

        {p.imageUrl && (
          <img
            src={p.imageUrl}
            alt=""
            className="w-full my-6 rounded-lg border border-border max-h-[520px] object-cover"
          />
        )}

        {p.title && (
          <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-tight tracking-tight mt-4">
            {p.title}
          </h1>
        )}
        {p.subTitle && (
          <p className="text-xl text-muted-foreground mt-3 leading-relaxed">{p.subTitle}</p>
        )}

        <div className="prose prose-invert mt-6 whitespace-pre-wrap text-base leading-[1.7] text-foreground/90">
          {p.content}
        </div>

        <AIAssistantPanel postId={p.id} />

        <div className="flex items-center gap-6 py-4 border-y border-border mt-6">
          <LikeButton postId={p.id} />
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageCircle className="size-4" /> {comments.data?.length ?? 0}
          </span>
          <ReloomPopover postId={p.id} />
        </div>

        <CommentSection postId={p.id} />
      </article>
    </AppLayout>
  );
}
