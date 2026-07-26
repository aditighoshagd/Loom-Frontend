import { useState } from "react";
import { useApiMutation } from "@/lib/use-api";
import { Check } from "lucide-react";
import { subscribe, unsubscribe } from "@/lib/api/connections";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SubscribeButton({
  targetUserId,
  isSubscribed: initialSubscribed,
  size = "sm",
  className,
  onStatusChange,
}) {
  const { userId } = useAuth();
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const isSelf = userId === targetUserId;

  const mut = useApiMutation({
    mutationFn: async (next) => {
      if (next) await subscribe(targetUserId);
      else await unsubscribe(targetUserId);
    },
    onMutate: (next) => {
      setSubscribed(next);
      if (onStatusChange) onStatusChange(next);
    },
    onError: (_e, next) => {
      setSubscribed(!next);
      if (onStatusChange) onStatusChange(!next);
    },
  });

  if (isSelf) return null;

  return (
    <Button
      size={size}
      variant={subscribed ? "outline" : "default"}
      className={cn(
        "rounded-full",
        !subscribed && "bg-primary text-primary-foreground hover:brightness-110",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mut.mutate(!subscribed);
      }}
      disabled={mut.isPending}
    >
      {subscribed ? (
        <>
          <Check className="size-4" /> Following
        </>
      ) : (
        "Subscribe"
      )}
    </Button>
  );
}
