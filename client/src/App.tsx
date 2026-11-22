import { Route, Redirect, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "./_core/hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import Users from "./pages/Users";
import Support from "./pages/Support";
import ActivityLog from "./pages/ActivityLog";
import Reports from "./pages/Reports";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#f2f4f7] flex items-center justify-center text-[#1f2937]">
      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
        <span className="size-2.5 animate-pulse rounded-full bg-[#22c55e]" />
        <span className="text-sm font-medium">Vérification de la session…</span>
      </div>
    </div>
  );
}

function AccessGuard({ page = "dashboard" }: { page?: "dashboard" | "payments" | "users" | "support" | "activity" | "reports" }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Redirect to="/login" />;
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#f2f4f7] flex items-center justify-center p-6">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_18px_55px_rgba(24,35,52,0.10)]">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#fff1f2] text-[#dc2626]">!</div>
          <h1 className="text-xl font-bold text-[#111827]">Accès non autorisé</h1>
          <p className="mt-2 text-sm leading-6 text-[#64748b]">Ce compte ne dispose pas des permissions nécessaires pour accéder à l’espace de modération.</p>
          <a className="mt-6 inline-flex rounded-xl bg-[#1f2326] px-4 py-2.5 text-sm font-semibold text-white" href="/login">Retour à la connexion</a>
        </div>
      </div>
    );
  }

  if (page === "payments") return <Payments />;
  if (page === "users") return <Users />;
  if (page === "support") return <Support />;
  if (page === "activity") return <ActivityLog />;
  if (page === "reports") return <Reports />;
  return <Dashboard />;
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return <Redirect to={user?.role === "admin" ? "/dashboard" : "/login"} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <AccessGuard page="dashboard" />
      </Route>
      <Route path="/payments">
        <AccessGuard page="payments" />
      </Route>
      <Route path="/users">
        <AccessGuard page="users" />
      </Route>
      <Route path="/support">
        <AccessGuard page="support" />
      </Route>
      <Route path="/activity">
        <AccessGuard page="activity" />
      </Route>
      <Route path="/reports">
        <AccessGuard page="reports" />
      </Route>
      <Route path="/" component={HomeRedirect} />
      <Route path="/404">
        <Redirect to="/login" />
      </Route>
      <Route>
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
