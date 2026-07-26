import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  Compass,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import { LoomLogo } from "./LoomLogo";
import { CreateMenu } from "./CreateMenu";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/inbox", label: "Subscriptions", icon: Inbox },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { userId, logout } = useAuth();

  return (
    <aside className="hidden md:flex md:sticky md:top-0 md:h-screen flex-col md:w-16 lg:w-60 shrink-0 border-r border-border bg-background">
      <div className="p-4 lg:px-5">
        <div className="lg:hidden">
          <LoomLogo collapsed={true} />
        </div>
        <div className="hidden lg:block">
          <LoomLogo />
        </div>
      </div>
      <nav className="flex-1 px-2 lg:px-3 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                active && "bg-accent text-foreground font-medium",
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
        {userId != null && (
          <Link
            to={`/profile/${userId}`}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
              pathname.startsWith(`/profile/${userId}`) && "bg-accent text-foreground font-medium",
            )}
          >
            <User className="size-5 shrink-0" />
            <span className="hidden lg:inline">Profile</span>
          </Link>
        )}
      </nav>
      <div className="p-3 space-y-2">
        <CreateMenu />
        <div className="flex justify-center lg:justify-end">
          <ThemeToggle />
        </div>
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Settings className="size-4 shrink-0" />
          <span className="hidden lg:inline">Settings</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <LogOut className="size-4 shrink-0" />
          <span className="hidden lg:inline">Log out</span>
        </button>
      </div>
    </aside>
  );
}
