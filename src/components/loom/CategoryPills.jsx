import { cn } from "@/lib/utils";

export function CategoryPills({ categories, active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors",
            c === active
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40",
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
