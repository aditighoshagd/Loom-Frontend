import { useState } from "react";
import { Repeat2 } from "lucide-react";
import { useApiMutation } from "@/lib/use-api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { reloomPost } from "@/lib/api/posts";
import { toast } from "sonner";

export function ReloomPopover({ postId }) {
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);

  const mut = useApiMutation({
    mutationFn: (n) => reloomPost(postId, n || undefined),
    onSuccess: () => {
      toast.success("Reloomed");
      setNote("");
      setOpen(false);
    },
    onError: (e) => toast.error(e?.message || "Reloom failed"),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Reloom"
        >
          <Repeat2 className="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-3">
          <p className="text-sm font-medium">Reloom this post</p>
          <Textarea
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => mut.mutate(note)} disabled={mut.isPending}>
              Reloom
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
