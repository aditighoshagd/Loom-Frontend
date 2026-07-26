import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colorFromId, initials } from "@/lib/loom-utils";
import { cn } from "@/lib/utils";

const SIZES = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-24 text-2xl",
};

export function UserAvatar({ name, userId, src, size = "md", className }) {
  const label = name?.trim() || "User";
  return (
    <Avatar className={cn(SIZES[size], className)}>
      {src ? <AvatarImage src={src} alt={label} /> : null}
      <AvatarFallback
        style={{ background: colorFromId(userId ?? label), color: "white" }}
        className="font-semibold"
      >
        {initials(label) || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
