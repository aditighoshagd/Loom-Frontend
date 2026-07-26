import { Link } from "react-router-dom";
import { format } from "date-fns";
import { readTimeMinutes } from "@/lib/loom-utils";
import { UserAvatar } from "./UserAvatar";
import { writerName } from "./writer-name-cache";

function fmtDate(iso) {
  try {
    const d = new Date(iso.endsWith("Z") ? iso : iso + "Z");
    return format(d, "MMM d");
  } catch {
    return iso;
  }
}

export function ExploreCard({ post, featured = false }) {
  const name = writerName(post.userId) ?? `Writer #${post.userId}`;
  const rt = readTimeMinutes(post.content);
  return (
    <Link
      to={`/post/${post.id}`}
      className={
        featured
          ? "block rounded-lg border border-border bg-card overflow-hidden hover:brightness-110 transition-all md:grid md:grid-cols-2"
          : "block rounded-lg border border-border bg-card overflow-hidden hover:brightness-110 transition-all"
      }
    >
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt=""
          className={featured ? "w-full h-full object-cover aspect-video md:aspect-auto" : "w-full aspect-video object-cover"}
          loading="lazy"
        />
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <UserAvatar name={name} userId={post.userId} size="xs" />
          <span className="text-xs uppercase tracking-wider font-semibold">{name}</span>
          <span className="text-xs text-muted-foreground">· {fmtDate(post.createdAt)}</span>
        </div>
        {post.title ? (
          <h3
            className={
              featured
                ? "font-serif text-3xl font-semibold leading-tight"
                : "font-serif text-xl font-semibold leading-tight"
            }
          >
            {post.title}
          </h3>
        ) : (
          <p className="text-foreground/90 line-clamp-4 whitespace-pre-wrap">{post.content}</p>
        )}
        {post.subTitle && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.subTitle}</p>
        )}
        <p className="text-xs text-muted-foreground mt-3">{rt} min read</p>
      </div>
    </Link>
  );
}
