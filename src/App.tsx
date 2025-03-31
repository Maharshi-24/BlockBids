import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BidProvider } from "./context/BidContext";
import { WagmiProvider } from "./providers/WagmiProvider";

// Pages
import Index from "./pages/Index";
import ItemDetail from "./pages/ItemDetail";
import ItemsPage from "./pages/ItemsPage";
import HowItWorks from "./pages/HowItWorks";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import WalletConnectPage from "./pages/WalletConnectPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider>
        <BrowserRouter future={{ 
          v7_startTransition: true,
          v7_relativeSplatPath: true 
        }}>
          <BidProvider>
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/items" element={<ItemsPage />} />
                <Route path="/items/:id" element={<ItemDetail />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/wallet-connect" element={<WalletConnectPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BidProvider>
        </BrowserRouter>
      </WagmiProvider>
    </QueryClientProvider>
    <Toaster />
    <Sonner />
  </>
);

export default App;
