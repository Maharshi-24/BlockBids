
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useBidContext } from '@/context/BidContext';
import { toast } from 'sonner';
import { Item } from '@/context/BidContext';
import { ArrowRight, CheckCircle, Clock, Loader2, ShieldCheck } from 'lucide-react';
import { detectWalletProviders, WalletProvider, sendTransaction } from '@/utils/walletUtils';

interface PaymentFormProps {
  item: Item;
  bidAmount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ item, bidAmount }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes countdown
  const [walletProviders, setWalletProviders] = useState<WalletProvider[]>([]);
  const { wallet } = useBidContext();
  const navigate = useNavigate();
  
  // Detect available wallet providers
  useEffect(() => {
    const checkWallets = async () => {
      const providers = await detectWalletProviders();
      setWalletProviders(providers);
    };
    
    checkWallets();
  }, []);
  
  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Find a suitable provider
      let provider = null;
      if (walletProviders.length > 0) {
        provider = walletProviders[0].provider;
      }
      
      // Show info toast
      toast.info('Preparing blockchain transaction', {
        description: 'Please confirm the transaction in your wallet'
      });
      
      // For demo purposes, we'll simulate a transaction
      setTimeout(() => {
        toast.success('Payment successful!', {
          description: 'Your transaction has been confirmed on the blockchain'
        });
        navigate('/payment-success', { state: { item } });
        setIsProcessing(false);
      }, 2000);
      
      // In a real app, we'd use the wallet to sign and send the transaction
      // const txHash = await sendTransaction(
      //   provider,
      //   'pol_destination_address', 
      //   ethers.utils.parseEther(bidAmount.toString()).toString(),
      //   '0x'
      // );
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Transaction failed', {
        description: 'There was an error processing your payment. Please try again.'
      });
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto polbid-card">
      <CardHeader>
        <CardTitle className="text-2xl text-gradient-green">Complete Payment</CardTitle>
        <CardDescription>
          Secure your auction win for {item.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-polbid-dark-gray border border-polbid-light-gray/30 p-4 rounded-lg">
            <h3 className="font-medium text-polbid-green mb-2">Payment Summary</h3>
            <div className="flex justify-between py-1 border-b border-polbid-light-gray/20">
              <span className="text-muted-foreground">Item:</span>
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-polbid-light-gray/20">
              <span className="text-muted-foreground">Bid Amount:</span>
              <span className="font-medium">{bidAmount} POL</span>
            </div>
            <div className="flex justify-between py-1 border-b border-polbid-light-gray/20">
              <span className="text-muted-foreground">Service Fee:</span>
              <span className="font-medium">{(bidAmount * 0.05).toFixed(2)} POL</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-polbid-green">{(bidAmount * 1.05).toFixed(2)} POL</span>
            </div>
          </div>
          
          <div className="bg-polbid-dark-gray border border-polbid-light-gray/30 p-4 rounded-lg">
            <h3 className="font-medium text-polbid-green mb-2">Wallet Information</h3>
            {wallet ? (
              <div>
                <p className="text-muted-foreground mb-2">Connected Wallet:</p>
                <div className="bg-polbid-gray/50 p-2 border border-polbid-light-gray/30 rounded-md font-mono text-sm break-all">
                  {wallet.slice(0, 8)}...{wallet.slice(-8)}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No wallet connected. Please connect your wallet to proceed.</p>
            )}
          </div>
          
          {countdown > 0 && (
            <div className="bg-polbid-dark-gray border border-polbid-blue/30 p-3 rounded-md flex items-center justify-between">
              <div>
                <p className="text-polbid-blue font-medium">Time remaining:</p>
                <p className="text-sm text-muted-foreground">Complete payment to secure your win</p>
              </div>
              <div className="flex items-center gap-2 bg-polbid-gray/50 p-2 rounded-md">
                <Clock size={18} className="text-polbid-blue" />
                <div className="font-mono text-lg font-bold text-polbid-blue">
                  {formatTime(countdown)}
                </div>
              </div>
            </div>
          )}
          
          <Button
            onClick={handlePayment}
            className="w-full polbid-button"
            disabled={isProcessing || !wallet || countdown <= 0}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <Loader2 size={18} className="mr-2 animate-spin" /> 
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Complete Payment with POL <ArrowRight size={18} className="ml-2" />
              </span>
            )}
          </Button>
          
          {!wallet && (
            <Button
              variant="outline"
              onClick={() => navigate('/wallet-connect')}
              className="w-full"
            >
              Connect Wallet
            </Button>
          )}
          
          {countdown <= 0 && (
            <div className="bg-polbid-dark-gray border border-polbid-amber/30 p-3 rounded-md text-center">
              <p className="font-medium text-polbid-amber">Payment window expired</p>
              <p className="text-sm mt-1 text-muted-foreground">Please place a new bid to try again</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-polbid-light-gray/20 pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={16} className="text-polbid-green" />
          <span>Test environment - no real POL will be charged</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
