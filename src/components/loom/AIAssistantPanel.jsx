import { useState } from "react";
import { Sparkles, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAiSummary, getAiTags } from "@/lib/api/posts";
import { toast } from "sonner";

export function AIAssistantPanel({ postId }) {
  const [summary, setSummary] = useState(null);
  const [tags, setTags] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  const runSummary = async () => {
    setLoadingSummary(true);
    try {
      setSummary(await getAiSummary(postId));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  const runTags = async () => {
    setLoadingTags(true);
    try {
      setTags(await getAiTags(postId));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoadingTags(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 my-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="size-4 text-primary" />
        <h4 className="font-semibold text-sm">AI Tools</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={runSummary} disabled={loadingSummary}>
          <Sparkles className="size-3.5" /> {loadingSummary ? "Summarising…" : "Summarise"}
        </Button>
        <Button size="sm" variant="outline" onClick={runTags} disabled={loadingTags}>
          <TagIcon className="size-3.5" /> {loadingTags ? "Tagging…" : "Suggest tags"}
        </Button>
      </div>
      {summary && (
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed border-l-2 border-primary/60 pl-3">
          {summary}
        </p>
      )}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((t) => (
            <Badge key={t} variant="secondary" className="rounded-full">
              {t}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
