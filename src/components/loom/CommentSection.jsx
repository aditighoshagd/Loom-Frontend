import { useState } from "react";
import { useApiQuery, useApiMutation } from "@/lib/use-api";
import { formatDistanceToNow } from "date-fns";
import { addComment, getComments } from "@/lib/api/posts";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./UserAvatar";
import { writerName } from "./writer-name-cache";
import { toast } from "sonner";

function fmtTime(iso) {
  try {
    const d = new Date(iso.endsWith("Z") ? iso : iso + "Z");
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return iso;
  }
}

export function CommentSection({ postId }) {
  const [text, setText] = useState("");
  const { data: comments = [], isLoading, refetch } = useApiQuery({
    queryFn: () => getComments(postId),
    enabled: !!postId,
    deps: [postId],
  });

  const mut = useApiMutation({
    mutationFn: (c) => addComment(postId, c),
    onSuccess: () => {
      setText("");
      refetch();
    },
    onError: (e) => toast.error(e?.message || "Failed to post comment"),
  });

  const commentList = comments ?? [];

  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Comments ({commentList.length})</h3>
      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts…"
          rows={3}
          className="border-0 bg-transparent p-0 focus-visible:ring-0 resize-none"
        />
        <div className="flex justify-end mt-2">
          <Button
            size="sm"
            disabled={!text.trim() || mut.isPending}
            onClick={() => mut.mutate(text.trim())}
          >
            Comment
          </Button>
        </div>
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      <ul className="space-y-4">
        {commentList.map((c) => {
          const name = writerName(c.userId) ?? `Writer #${c.userId}`;
          return (
            <li key={c.id} className="flex gap-3">
              <UserAvatar name={name} userId={c.userId} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-sm">
                  <span className="font-semibold">{name}</span>
                  <span className="text-muted-foreground"> · {fmtTime(c.createdAt)}</span>
                </div>
                <p className="text-sm mt-0.5 whitespace-pre-wrap">{c.content}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
