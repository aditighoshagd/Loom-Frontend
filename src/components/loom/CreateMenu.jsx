import { Link } from "react-router-dom";
import { NotebookPen, Pencil, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function CreateMenu({ collapsed = false }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-full rounded-full bg-primary text-primary-foreground hover:brightness-110"
          size={collapsed ? "icon" : "default"}
        >
          <Plus className="size-4" />
          {!collapsed && <span>Create</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top">
        <DropdownMenuItem asChild>
          <Link to="/create">
            <Pencil className="size-4" /> Write Post
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/home">
            <NotebookPen className="size-4" /> Quick Note
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
