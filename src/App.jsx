import { Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "./lib/theme/context";
import { AuthProvider } from "./lib/auth/context";
import { Toaster } from "./components/ui/sonner";

import Landing from "./routes/index";
import HomePage from "./routes/home";
import ExplorePage from "./routes/explore";
import InboxPage from "./routes/inbox";
import ActivityPage from "./routes/activity";
import ChatPage from "./routes/chat";
import DashboardPage from "./routes/dashboard";
import CreatePage from "./routes/create";
import LoginPage from "./routes/login";
import SignupPage from "./routes/signup";
import SettingsPage from "./routes/settings";
import PostPage from "./routes/post.$postId";
import ProfilePage from "./routes/profile.$userId";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </ThemeProvider>
  );
}
