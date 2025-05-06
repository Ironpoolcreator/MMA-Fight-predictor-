import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FighterProfile from "@/pages/FighterProfile";
import Prediction from "@/pages/Prediction";
import Rankings from "@/pages/Rankings";
import Fights from "@/pages/Fights";
import Analytics from "@/pages/Analytics";
import FighterComparison from "@/pages/FighterComparison";
import BettingOdds from "@/pages/BettingOdds";
import HistoricalEvents from "@/pages/HistoricalEvents";
import FightPreparation from "@/pages/FightPreparation";
import AuthPage from "@/pages/auth-page";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/hooks/use-auth";

// UFC Style Components
import UFCHomePage from "@/pages/UFC/UFCHomePage";
import UFCFighterComparisonPage from "@/pages/UFC/UFCFighterComparisonPage";
import UFCComparisonPage from "@/pages/UFC/UFCComparisonPage";
import CountdownTestPage from "@/pages/UFC/CountdownTestPage";
import RedirectToUFC from "@/pages/RedirectToUFC";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Switch>
        {/* UFC Style Pages - These don't use the common Navbar/Footer */}
        <Route path="/ufc" component={UFCHomePage} />
        <Route path="/ufc/compare" component={UFCFighterComparisonPage} />
        <Route path="/ufc/stats-compare" component={UFCComparisonPage} />
        <Route path="/ufc/prediction/:id" component={UFCHomePage} />
        <Route path="/ufc/predictions" component={UFCHomePage} />
        <Route path="/ufc/countdown-test" component={CountdownTestPage} />
        
        {/* Standard Pages with common layout */}
        <Route path="*">
          <>
            <Navbar />
            <main className="flex-grow">
              <Switch>
                <Route path="/" component={RedirectToUFC} />
                <Route path="/fighter/:id" component={FighterProfile} />
                <Route path="/prediction" component={Prediction} />
                <Route path="/rankings" component={Rankings} />
                <Route path="/fights" component={Fights} />
                <Route path="/analytics" component={Analytics} />
                <Route path="/compare" component={FighterComparison} />
                <Route path="/betting-odds" component={BettingOdds} />
                <Route path="/events" component={HistoricalEvents} />
                <Route path="/fight-preparation" component={FightPreparation} />
                <Route path="/auth" component={AuthPage} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </>
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;