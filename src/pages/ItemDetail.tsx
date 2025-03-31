
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BidForm from '@/components/bid/BidForm';
import WinCelebration from '@/components/bid/WinCelebration';
import { Button } from '@/components/ui/button';
import { useBidContext } from '@/context/BidContext';
import { ArrowLeft, Clock, Users } from 'lucide-react';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { items } = useBidContext();
  const navigate = useNavigate();
  const [hasWon, setHasWon] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  
  // Find the item by id
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
          <p className="mb-6">The item you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/items')}>
            Browse Items
          </Button>
        </div>
      </Layout>
    );
  }
  
  const handleBidSuccess = () => {
    setBidAmount(parseFloat((item.basePrice * 1.05).toFixed(2)));
    setHasWon(true);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center text-blockbid-light-gray hover:text-blockbid-secondary"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Item Image */}
          <div className="rounded-lg overflow-hidden shadow-glow relative group">
            <img 
              src={`${item.imageUrl}?auto=format&fit=crop&w=800&h=600`}
              alt={item.name}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blockbid-dark to-transparent opacity-60"></div>
          </div>
          
          {/* Item Info & Bid Form */}
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold mb-2 text-white">{item.name}</h1>
                <span className="bg-blockbid-accent text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  {item.category}
                </span>
              </div>
              
              <div className="flex items-center text-blockbid-light-gray mb-4 space-x-4">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1 text-blockbid-secondary" />
                  <span>{item.timeLeft} left</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-1 text-blockbid-secondary" />
                  <span>{item.bids} bids</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-2xl font-bold text-blockbid-secondary mb-1">
                  {item.basePrice} POL
                </div>
                <p className="text-sm text-blockbid-light-gray">
                  Starting price
                </p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-2 text-white">Description</h3>
                <p className="text-blockbid-light-gray">{item.description}</p>
              </div>
            </div>
            
            {/* Conditional rendering based on bid status */}
            {hasWon ? (
              <WinCelebration item={item} bidAmount={bidAmount} />
            ) : (
              <div className="blockbid-card p-6">
                <h2 className="text-xl font-bold mb-4 text-white">Place Your Bid</h2>
                <BidForm item={item} onBidSuccess={handleBidSuccess} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
