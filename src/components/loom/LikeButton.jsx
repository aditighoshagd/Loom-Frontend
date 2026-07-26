import { Heart } from "lucide-react";
import { useState } from "react";
import { useApiMutation } from "@/lib/use-api";
import { likePost, unlikePost } from "@/lib/api/posts";
import { cn } from "@/lib/utils";

export function LikeButton({ postId, initialCount = 0 }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  const mut = useApiMutation({
    mutationFn: async (nextLiked) => {
      if (nextLiked) await likePost(postId);
      else await unlikePost(postId);
    },
    onMutate: (nextLiked) => {
      setLiked(nextLiked);
      setCount((c) => c + (nextLiked ? 1 : -1));
    },
    onError: (_e, nextLiked) => {
      setLiked(!nextLiked);
      setCount((c) => c + (nextLiked ? -1 : 1));
    },
  });

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mut.mutate(!liked);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors",
        liked && "text-destructive hover:text-destructive",
      )}
      aria-pressed={liked}
      aria-label="Like"
    >
      <Heart className={cn("size-4", liked && "fill-current")} />
      {count > 0 && <span>{count}</span>}
    </button>
  );
}
