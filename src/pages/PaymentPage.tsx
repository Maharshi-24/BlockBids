
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PaymentForm from '@/components/payment/PaymentForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Item } from '@/context/BidContext';

interface LocationState {
  item: Item;
  bidAmount: number;
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  if (!state || !state.item || !state.bidAmount) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Payment Request</h2>
          <p className="mb-6">Something went wrong with your payment request. Please try again.</p>
          <Button onClick={() => navigate('/items')}>
            Browse Items
          </Button>
        </div>
      </Layout>
    );
  }
  
  const { item, bidAmount } = state;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-bidzone-purple"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Item
          </Button>
        </div>
        
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">Complete Payment</h1>
          <PaymentForm item={item} bidAmount={bidAmount} />
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
