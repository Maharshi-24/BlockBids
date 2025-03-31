
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, ExternalLink } from 'lucide-react';
import { Item } from '@/context/BidContext';
import confetti from '@/utils/confetti';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LocationState {
  item: Item;
}

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  useEffect(() => {
    // Trigger confetti on success page load
    confetti();
  }, []);
  
  if (!state || !state.item) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Payment Success</h2>
          <p className="mb-6">Something went wrong. Please check your dashboard for item status.</p>
          <Button onClick={() => navigate('/dashboard')} className="polbid-button">
            Go to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }
  
  const { item } = state;
  const transactionId = `${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <div className="mx-auto bg-polbid-green/20 w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-win-celebration">
            <Check className="h-12 w-12 text-polbid-green" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gradient-green">Transaction Confirmed!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your blockchain transaction has been verified and recorded successfully.
          </p>
          
          <Card className="polbid-card mb-8">
            <CardHeader>
              <h3 className="font-bold text-lg text-center">Blockchain Transaction</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-polbid-light-gray/20">
                <span className="text-muted-foreground">Item:</span>
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-polbid-light-gray/20">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono text-sm bg-polbid-dark-gray py-1 px-2 rounded">
                  {transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-polbid-light-gray/20">
                <span className="text-muted-foreground">Blockchain:</span>
                <span className="font-medium">POL Network</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium text-polbid-green flex items-center gap-1">
                  <Check size={16} />
                  Confirmed
                </span>
              </div>
              
              {/* Fake blockchain explorer link */}
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full text-muted-foreground text-sm"
                  onClick={() => navigate('/dashboard')} // Just navigate to dashboard, real link would go to explorer
                >
                  View on POL Explorer
                  <ExternalLink size={14} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="w-full polbid-button"
            >
              View My Items <ArrowRight size={18} className="ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/items')} 
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccessPage;
