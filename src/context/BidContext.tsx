
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Item {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  category: string;
  timeLeft: string;
  bids: number;
}

interface BidContextType {
  items: Item[];
  featuredItems: Item[];
  userItems: Item[];
  biddingHistory: Array<{itemId: string, amount: number, timestamp: Date}>;
  addToBiddingHistory: (itemId: string, amount: number) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  wallet: string | null;
  setWallet: (wallet: string | null) => void;
  walletDetected: boolean;
  setWalletDetected: (detected: boolean) => void;
}

const BidContext = createContext<BidContextType | undefined>(undefined);

const mockItems: Item[] = [
  {
    id: '1',
    name: 'Vintage Mechanical Watch',
    description: 'A beautiful vintage mechanical watch with leather straps. Excellent condition and working perfectly.',
    basePrice: 150,
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    category: 'Accessories',
    timeLeft: '2 hours',
    bids: 5
  },
  {
    id: '2',
    name: 'Premium Gaming Laptop',
    description: 'High-performance gaming laptop with the latest graphics card and processor. Perfect for gaming enthusiasts.',
    basePrice: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    category: 'Electronics',
    timeLeft: '4 hours',
    bids: 12
  },
  {
    id: '3',
    name: 'Professional Camera Kit',
    description: 'Complete professional camera kit including lenses, tripod, and accessories. Perfect for photography enthusiasts.',
    basePrice: 850,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    category: 'Electronics',
    timeLeft: '1 day',
    bids: 8
  },
  {
    id: '4',
    name: 'Designer Sunglasses',
    description: 'Elegant designer sunglasses with UV protection. Stylish and practical for sunny days.',
    basePrice: 120,
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    category: 'Fashion',
    timeLeft: '6 hours',
    bids: 3
  },
  {
    id: '5',
    name: 'Smart Home Assistant',
    description: 'Voice-controlled smart home assistant with advanced features. Control your home with voice commands.',
    basePrice: 80,
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    category: 'Electronics',
    timeLeft: '12 hours',
    bids: 7
  },
  {
    id: '6',
    name: 'Handcrafted Leather Bag',
    description: 'Handcrafted leather messenger bag with multiple compartments. Durable and stylish for daily use.',
    basePrice: 200,
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    category: 'Fashion',
    timeLeft: '2 days',
    bids: 4
  }
];

export const BidProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [items] = useState<Item[]>(mockItems);
  const [biddingHistory, setBiddingHistory] = useState<Array<{itemId: string, amount: number, timestamp: Date}>>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletDetected, setWalletDetected] = useState(false);

  // Get featured items (first 3)
  const featuredItems = items.slice(0, 3);
  
  // Mock user items (won items)
  const userItems = biddingHistory.map(bid => 
    items.find(item => item.id === bid.itemId)
  ).filter(Boolean) as Item[];

  const addToBiddingHistory = (itemId: string, amount: number) => {
    setBiddingHistory(prev => [...prev, {
      itemId,
      amount,
      timestamp: new Date()
    }]);
  };

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <BidContext.Provider value={{
      items,
      featuredItems,
      userItems,
      biddingHistory,
      addToBiddingHistory,
      isLoggedIn,
      login,
      logout,
      wallet,
      setWallet,
      walletDetected,
      setWalletDetected
    }}>
      {children}
    </BidContext.Provider>
  );
};

export const useBidContext = () => {
  const context = useContext(BidContext);
  if (context === undefined) {
    throw new Error('useBidContext must be used within a BidProvider');
  }
  return context;
};
