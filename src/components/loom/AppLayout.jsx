import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { ThemeToggle } from "./ThemeToggle";

export function AppLayout({ children, right, narrow = false }) {
  return (
    <div className="min-h-screen w-full flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-16 md:pb-0">
        <div className="md:hidden fixed top-3 right-3 z-40">
          <ThemeToggle variant="outline" className="bg-background/80 backdrop-blur" />
        </div>
        <div
          className={
            right
              ? "mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-6 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8"
              : `mx-auto ${narrow ? "max-w-3xl" : "max-w-4xl"} px-4 md:px-6 lg:px-8 py-6`
          }
        >
          <div className="min-w-0">{children}</div>
          {right && <aside className="hidden lg:block space-y-6">{right}</aside>}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
