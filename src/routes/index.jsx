import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles, Users } from "lucide-react";
import { LoomLogo } from "@/components/loom/LoomLogo";
import { ThemeToggle } from "@/components/loom/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b border-border">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <LoomLogo />
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="rounded-full bg-primary text-primary-foreground hover:brightness-110">
              <Link to="/signup">Start writing</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
        <p className="uppercase tracking-widest text-xs text-primary mb-6">Write. Publish. Grow.</p>
        <h1 className="font-serif text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
          Your words. Your audience. Your&nbsp;way.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Loom is a modern newsletter platform for independent writers. Publish long-form pieces
          and short notes, grow a subscriber base, and let AI help you polish every draft.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary text-primary-foreground hover:brightness-110"
          >
            <Link to="/signup">
              Start Writing <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/explore">Read Stories</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 grid gap-6 md:grid-cols-3">
        <Feature
          icon={<BookOpen className="size-5" />}
          title="Newsletter publishing"
          body="Long-form posts with cover images, subtitles, and a distraction-free editor."
        />
        <Feature
          icon={<Users className="size-5" />}
          title="Subscriber feeds"
          body="Readers subscribe to writers they love. Personalised inbox, no algorithms."
        />
        <Feature
          icon={<Sparkles className="size-5" />}
          title="AI writing assistant"
          body="Instant summaries, tag suggestions, and semantic search across every post."
        />
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <LoomLogo />
          <p>© {new Date().getFullYear()} Loom. Made for writers.</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{body}</p>
    </div>
  );
}
