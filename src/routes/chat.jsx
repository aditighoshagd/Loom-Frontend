import { MessageSquare } from "lucide-react";
import { AppLayout } from "@/components/loom/AppLayout";
import { EmptyState } from "@/components/loom/EmptyState";
import { useRequireAuth } from "@/lib/auth/context";

export default function ChatPage() {
  const { ready } = useRequireAuth();
  if (!ready) return null;
  return (
    <AppLayout narrow>
      <h1 className="font-serif text-3xl font-semibold mb-6">Chat</h1>
      <EmptyState
        icon={<MessageSquare className="size-6" />}
        title="Coming soon"
        description="Direct messages between writers and readers are on the roadmap."
      />
    </AppLayout>
  );
}
