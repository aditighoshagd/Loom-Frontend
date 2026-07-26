import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useApiMutation } from "@/lib/use-api";
import { AppLayout } from "@/components/loom/AppLayout";
import { Button } from "@/components/ui/button";
import { useAuth, useRequireAuth } from "@/lib/auth/context";
import { createPost, getPost, suggestTags, suggestTitleSubtitle } from "@/lib/api/posts";
import { uploadFile } from "@/lib/api/uploads";
import { toast } from "sonner";
import { ImagePlus, Sparkles, Tag } from "lucide-react";

export default function CreatePage() {
  const { ready, token } = useAuth();
  useRequireAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const edit = searchParams.get("edit");

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!edit || !token) return;
    const id = Number(edit);
    if (!Number.isFinite(id)) return;
    getPost(id)
      .then((p) => {
        setTitle(p.title ?? "");
        setSubTitle(p.subTitle ?? "");
        setContent(p.content);
        setImageUrl(p.imageUrl);
      })
      .catch((e) => toast.error(e.message));
  }, [edit, token]);

  const publish = useApiMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append(
        "post",
        new Blob(
          [
            JSON.stringify({
              title: title.trim() || null,
              subTitle: subTitle.trim() || null,
              content,
              parentPostId: null,
            }),
          ],
          { type: "application/json" },
        ),
      );
      if (file) form.append("file", file);
      return createPost(form);
    },
    onSuccess: (p) => {
      toast.success("Post published");
      navigate(`/post/${p.id}`);
    },
    onError: (e) => toast.error(e?.message),
  });

  const handleFile = async (f) => {
    setFile(f);
    setUploading(true);
    try {
      const url = await uploadFile(f);
      setImageUrl(url);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const runSuggestTitle = async () => {
    if (content.trim().length < 30) {
      toast.error("Write a bit more content first.");
      return;
    }
    try {
      const s = await suggestTitleSubtitle(content);
      const m = /Title:\s*(.+)\nSubtitle:\s*(.+)/i.exec(s);
      if (m) {
        setTitle(m[1].trim());
        setSubTitle(m[2].trim());
        toast.success("Suggestion applied");
      } else {
        setTitle(s.trim());
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  const runSuggestTags = async () => {
    if (content.trim().length < 30) {
      toast.error("Write a bit more content first.");
      return;
    }
    try {
      setTags(await suggestTags(content));
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (!ready) return null;

  return (
    <AppLayout
      right={
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            AI assistant
          </h3>
          <Button variant="outline" className="w-full justify-start" onClick={runSuggestTitle}>
            <Sparkles className="size-4" /> Suggest title & subtitle
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={runSuggestTags}>
            <Tag className="size-4" /> Generate tags
          </Button>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tags.map((t) => (
                <span key={t} className="rounded-full bg-muted text-xs px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      }
    >
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">Draft {edit ? `· editing #${edit}` : ""}</p>
        <Button
          onClick={() => publish.mutate()}
          disabled={publish.isPending || !content.trim()}
          className="rounded-full bg-primary text-primary-foreground hover:brightness-110"
        >
          {publish.isPending ? "Publishing…" : "Publish"}
        </Button>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="mb-6 rounded-lg border border-dashed border-border p-4 text-center"
      >
        {imageUrl ? (
          <div className="space-y-2">
            <img
              src={imageUrl}
              alt=""
              className="mx-auto rounded-md max-h-64 object-cover"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setImageUrl(null);
                setFile(null);
              }}
            >
              Remove cover
            </Button>
          </div>
        ) : (
          <label className="cursor-pointer text-muted-foreground text-sm flex flex-col items-center gap-2 py-4">
            <ImagePlus className="size-5" />
            <span>{uploading ? "Uploading…" : "Drag & drop a cover image, or click to upload"}</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileInput}
            />
          </label>
        )}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full bg-transparent font-serif text-4xl md:text-5xl font-semibold leading-tight focus:outline-none placeholder:text-muted-foreground/50"
      />
      <input
        value={subTitle}
        onChange={(e) => setSubTitle(e.target.value)}
        placeholder="Subtitle"
        className="w-full bg-transparent text-xl text-muted-foreground mt-3 focus:outline-none placeholder:text-muted-foreground/50"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tell your story…"
        rows={20}
        className="w-full bg-transparent mt-6 text-lg leading-[1.7] focus:outline-none resize-none placeholder:text-muted-foreground/50"
      />
    </AppLayout>
  );
}
