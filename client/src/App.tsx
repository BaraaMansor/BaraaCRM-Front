import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Companies from "@/pages/Companies";
import Branches from "@/pages/Branches";
import Employees from "@/pages/Employees";
import Contacts from "@/pages/Contacts";
import BestPractices from "@/pages/BestPractices";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

/**
 * BaraaCRM Frontend Application
 * Design Philosophy: Minimalist Enterprise
 * - Clean, professional interface
 * - Efficient data management
 * - Responsive design for all devices
 */

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/companies"} component={Companies} />
      <Route path={"/branches"} component={Branches} />
      <Route path={"/employees"} component={Employees} />
      <Route path={"/contacts"} component={Contacts} />
      <Route path={"/best-practices"} component={BestPractices} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
