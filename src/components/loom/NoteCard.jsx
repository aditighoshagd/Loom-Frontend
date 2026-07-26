import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Repeat2 } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { LikeButton } from "./LikeButton";
import { ReloomPopover } from "./ReloomPopover";
import { writerName } from "./writer-name-cache";

function fmtTime(iso) {
  try {
    const d = new Date(iso.endsWith("Z") ? iso : iso + "Z");
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return iso;
  }
}

export function NoteCard({ post }) {
  const name = writerName(post.userId) ?? `Writer #${post.userId}`;
  const isReloom = post.parentPostId != null;

  return (
    <article className="rounded-lg border border-border bg-card p-4 hover:brightness-110 transition-all">
      {isReloom && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <Repeat2 className="size-3" /> Reloomed
        </div>
      )}
      <div className="flex items-start gap-3">
        <Link to={`/profile/${post.userId}`}>
          <UserAvatar name={name} userId={post.userId} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to={`/profile/${post.userId}`}
              className="font-semibold hover:underline"
            >
              {name}
            </Link>
            <span className="text-muted-foreground">· {fmtTime(post.createdAt)}</span>
          </div>
          <Link to={`/post/${post.id}`} className="block mt-1">
            {post.title && (
              <h3 className="font-serif text-lg font-semibold leading-snug">{post.title}</h3>
            )}
            {post.subTitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{post.subTitle}</p>
            )}
            <p className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap line-clamp-4">
              {post.content}
            </p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt=""
                className="mt-3 rounded-md w-full max-h-80 object-cover border border-border"
                loading="lazy"
              />
            )}
          </Link>
          <div className="flex items-center gap-5 mt-3">
            <LikeButton postId={post.id} />
            <Link
              to={`/post/${post.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <MessageCircle className="size-4" />
            </Link>
            <ReloomPopover postId={post.id} />
          </div>
        </div>
      </div>
    </article>
  );
}
