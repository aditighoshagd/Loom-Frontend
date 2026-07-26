import { Link } from "react-router-dom";
import { format } from "date-fns";
import { MessageCircle } from "lucide-react";
import { readTimeMinutes } from "@/lib/loom-utils";
import { UserAvatar } from "./UserAvatar";
import { LikeButton } from "./LikeButton";
import { ReloomPopover } from "./ReloomPopover";
import { writerName } from "./writer-name-cache";

function fmtDate(iso) {
  try {
    const d = new Date(iso.endsWith("Z") ? iso : iso + "Z");
    return format(d, "MMM d");
  } catch {
    return iso;
  }
}

export function NewsletterCard({ post, unread }) {
  const name = writerName(post.userId) ?? `Writer #${post.userId}`;
  const rt = readTimeMinutes(post.content);
  return (
    <Link
      to={`/post/${post.id}`}
      className="block rounded-lg border border-border bg-card p-5 hover:brightness-110 transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <UserAvatar name={name} userId={post.userId} size="sm" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="uppercase tracking-wider font-semibold text-foreground">{name}</span>
          <span>· {fmtDate(post.createdAt)}</span>
          {unread && <span className="size-2 rounded-full bg-primary" aria-label="Unread" />}
        </div>
      </div>
      {post.title && (
        <h2 className="font-serif text-2xl font-semibold leading-tight mb-1">{post.title}</h2>
      )}
      {post.subTitle && <p className="text-muted-foreground line-clamp-2">{post.subTitle}</p>}
      <div className="flex items-center gap-4 mt-4">
        <span className="text-xs text-muted-foreground">{rt} min read</span>
        <div className="flex items-center gap-4 ml-auto">
          <LikeButton postId={post.id} />
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MessageCircle className="size-4" />
          </span>
          <ReloomPopover postId={post.id} />
        </div>
      </div>
    </Link>
  );
}
