import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./lib/auth";
import AuthPage from "./pages/auth.js";
import DashboardPage from "./pages/dashboard.js";
import CalendarPage from "./pages/calendar.js";
import SymptomsPage from "./pages/symptoms.js";
import InsightsPage from "./pages/insights.js";
import Navigation from "./components/navigation.js";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pb-20 md:pb-0">
        <Switch>
          <Route path="/" component={DashboardPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/calendar" component={CalendarPage} />
          <Route path="/symptoms" component={SymptomsPage} />
          <Route path="/insights" component={InsightsPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function AppRouter() {
  const { data: user, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto">
            <i className="fas fa-calendar-heart text-2xl text-primary-foreground"></i>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">FlowTracker</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || error?.message.includes("401")) {
    return <AuthPage />;
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
