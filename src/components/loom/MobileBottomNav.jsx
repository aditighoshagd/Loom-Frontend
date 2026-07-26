import { Link, useLocation } from "react-router-dom";
import { Activity, Compass, Home, Plus, User } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const { userId } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border bg-background/95 backdrop-blur">
      <ul className="flex justify-around items-center h-14">
        <li>
          <Link
            to="/home"
            aria-label="Home"
            className={cn(
              "flex items-center justify-center px-4 py-2",
              pathname === "/home" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Home className="size-5" />
          </Link>
        </li>
        <li>
          <Link
            to="/explore"
            aria-label="Explore"
            className={cn(
              "flex items-center justify-center px-4 py-2",
              pathname === "/explore" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Compass className="size-5" />
          </Link>
        </li>
        <li>
          <Link
            to="/create"
            aria-label="Create"
            className="flex items-center justify-center px-4 py-2 text-primary"
          >
            <Plus className="size-6" />
          </Link>
        </li>
        <li>
          <Link
            to="/activity"
            aria-label="Activity"
            className={cn(
              "flex items-center justify-center px-4 py-2",
              pathname === "/activity" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <Activity className="size-5" />
          </Link>
        </li>
        <li>
          {userId != null ? (
            <Link
              to={`/profile/${userId}`}
              aria-label="Profile"
              className={cn(
                "flex items-center justify-center px-4 py-2",
                pathname.startsWith(`/profile/${userId}`) ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <User className="size-5" />
            </Link>
          ) : (
            <Link
              to="/settings"
              aria-label="Settings"
              className="flex items-center justify-center px-4 py-2 text-muted-foreground"
            >
              <User className="size-5" />
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
