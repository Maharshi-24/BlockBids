
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBidContext } from '@/context/BidContext';
import { toast } from 'sonner';
import { ArrowRight, Check, Coins, Info, Loader2 } from 'lucide-react';
import { Item } from '@/context/BidContext';
import { detectWalletProviders, WalletProvider, sendTransaction } from '@/utils/walletUtils';

interface BidFormProps {
  item: Item;
  onBidSuccess: () => void;
}

const BidForm: React.FC<BidFormProps> = ({ item, onBidSuccess }) => {
  const [bidAmount, setBidAmount] = useState(item.basePrice.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletProviders, setWalletProviders] = useState<WalletProvider[]>([]);
  const { addToBiddingHistory, isLoggedIn, wallet } = useBidContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for available wallet extensions
    const checkWallets = async () => {
      const providers = await detectWalletProviders();
      setWalletProviders(providers);
    };
    
    checkWallets();
  }, []);
  
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error("Please login to place a bid", {
        description: "You need to be logged in to bid on this item",
        action: {
          label: "Login",
          onClick: () => navigate('/login')
        }
      });
      return;
    }
    
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount < item.basePrice) {
      toast.error("Invalid bid amount", {
        description: `Bid amount must be at least ${item.basePrice} POL`
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For demo purposes, use simulated transaction
      toast.info("Processing your bid on the blockchain", {
        description: "Please wait while we process your bid..."
      });
      
      // Simulate transaction processing with a slight delay
      setTimeout(() => {
        addToBiddingHistory(item.id, amount);
        onBidSuccess();
        setIsSubmitting(false);
        
        toast.success("Your bid was successful!", {
          description: `Your bid of ${amount} POL has been accepted.`
        });
      }, 1500);
    } catch (error) {
      console.error("Error processing bid:", error);
      toast.error("Error processing bid", {
        description: "There was a problem with your bid. Please try again."
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleBidSubmit} className="space-y-4">
      <div>
        <label htmlFor="bidAmount" className="block text-sm font-medium mb-1 text-blockbid-secondary">
          Your Bid Amount (POL)
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Coins className="h-5 w-5 text-blockbid-secondary" />
          </div>
          <Input
            type="number"
            name="bidAmount"
            id="bidAmount"
            min={item.basePrice}
            step="0.01"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="pl-10 bg-blockbid-dark border-blockbid-light-gray focus:border-blockbid-secondary"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mt-2 flex items-start">
          <Info className="h-4 w-4 text-blockbid-accent mr-2 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Minimum bid: {item.basePrice} POL. For testing, no actual POL will be charged.
          </p>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-blockbid-accent hover:bg-blockbid-accent/90 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <Loader2 size={18} className="mr-2 animate-spin" />
            Processing Bid...
          </span>
        ) : (
          <span className="flex items-center">
            Place Bid with POL <ArrowRight size={18} className="ml-2" />
          </span>
        )}
      </Button>
      
      <div className="mt-4 p-3 bg-blockbid-dark/50 border border-blockbid-light-gray/30 rounded-lg">
        <p className="text-sm text-muted-foreground flex items-center">
          <Check size={16} className="inline mr-2 text-blockbid-secondary" />
          <span className="font-medium text-blockbid-secondary">Test Environment:</span>
          <span className="ml-1">This is a testing platform - no actual POL will be charged</span>
        </p>
      </div>
    </form>
  );
};

export default BidForm;
