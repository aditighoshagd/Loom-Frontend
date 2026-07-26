import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useApiQuery } from "@/lib/use-api";
import { semanticSearch } from "@/lib/api/posts";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 350);
    return () => clearTimeout(id);
  }, [q]);

  const { data: searchResults, isLoading: isFetching } = useApiQuery({
    queryFn: () => semanticSearch(debounced, 6),
    enabled: debounced.length > 1,
    deps: [debounced],
  });

  const data = searchResults ?? [];

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search posts…"
        className="pl-9 bg-muted/50 border-border rounded-full"
      />
      {debounced.length > 1 && (
        <div className="absolute z-20 mt-2 w-full rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
          {isFetching && (
            <p className="p-3 text-sm text-muted-foreground">Searching…</p>
          )}
          {!isFetching && data.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">
              No posts found. Try different keywords.
            </p>
          )}
          {data.map((p) => (
            <Link
              key={p.id}
              to={`/post/${p.id}`}
              className="block px-3 py-2 hover:bg-accent text-sm"
              onClick={() => setQ("")}
            >
              <p className="font-medium line-clamp-1">{p.title ?? p.content.slice(0, 60)}</p>
              {p.subTitle && (
                <p className="text-xs text-muted-foreground line-clamp-1">{p.subTitle}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
