
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Item } from '@/context/BidContext';
import confetti from '@/utils/confetti';

interface WinCelebrationProps {
  item: Item;
  bidAmount: number;
}

const WinCelebration: React.FC<WinCelebrationProps> = ({ item, bidAmount }) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    // Trigger confetti effect
    setShowConfetti(true);
    confetti();
    
    return () => {
      setShowConfetti(false);
      // Clean up any confetti elements
      const confettiElements = document.querySelectorAll('.confetti');
      confettiElements.forEach(el => el.remove());
    };
  }, []);
  
  return (
    <div className="text-center py-8 animate-win-celebration">
      <div className="mb-6">
        <div className="mx-auto bg-bidzone-light-purple w-24 h-24 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-bidzone-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
        <p className="text-xl text-gray-600 mb-4">You've won the auction for {item.name}</p>
        <p className="text-gray-500">Your winning bid: <span className="font-bold text-bidzone-dark-purple">${bidAmount}</span></p>
      </div>
      
      <div className="space-y-4">
        <Button
          onClick={() => navigate('/payment', { state: { item, bidAmount } })}
          className="w-full neu-button bg-bidzone-purple"
        >
          Proceed to Payment
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="w-full"
        >
          View My Bids
        </Button>
      </div>
    </div>
  );
};

export default WinCelebration;
