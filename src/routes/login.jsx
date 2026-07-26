import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoomLogo } from "@/components/loom/LoomLogo";
import { ThemeToggle } from "@/components/loom/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.ready && auth.token) navigate("/home");
  }, [auth.ready, auth.token, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await auth.login(email, password);
      navigate("/home");
    } catch (err) {
      toast.error(err.message || "Could not log in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="fixed top-3 right-3 z-40">
        <ThemeToggle variant="outline" />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <LoomLogo />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-center">Welcome back</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">
          Log in to continue writing.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary text-primary-foreground hover:brightness-110"
          >
            {busy ? "Signing in…" : "Log in"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground text-center mt-6">
          New to Loom?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
