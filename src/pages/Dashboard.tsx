import React from 'react';
import Layout from '@/components/layout/Layout';
import ItemGrid from '@/components/items/ItemGrid';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, User, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBidContext } from '@/context/BidContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userItems, wallet, isLoggedIn } = useBidContext();
  
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="mb-6">You need to be logged in to view your dashboard.</p>
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Your Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* User Profile Card */}
          <div className="p-6 bg-[#1C1C28] rounded-lg border border-gray-700">
            <div className="flex items-start">
              <div className="bg-[#8B5CF6]/10 p-3 rounded-full mr-4">
                <User className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Your Profile</h2>
                <p className="text-gray-400 text-sm">
                  Manage your account information
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile')} 
              className="w-full mt-4 bg-black text-white border-gray-700 hover:bg-gray-800"
            >
              Edit Profile
            </Button>
          </div>
          
          {/* Wallet Card */}
          <div className="p-6 bg-[#1C1C28] rounded-lg border border-gray-700">
            <div className="flex items-start">
              <div className="bg-[#8B5CF6]/10 p-3 rounded-full mr-4">
                <Wallet className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Your Wallet</h2>
                {wallet ? (
                  <p className="text-gray-400 text-sm font-mono truncate max-w-[180px]">
                    {wallet.slice(0, 6)}...{wallet.slice(-4)}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">
                    No wallet connected
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/wallet-connect')} 
              className="w-full mt-4 bg-black text-white border-gray-700 hover:bg-gray-800"
            >
              {wallet ? 'Update Wallet' : 'Connect Wallet'}
            </Button>
          </div>
          
          {/* Active Bids Card */}
          <div className="p-6 bg-[#1C1C28] rounded-lg border border-gray-700">
            <div className="flex items-start">
              <div className="bg-[#8B5CF6]/10 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-1">Won Items</h2>
                <p className="text-gray-400 text-sm">
                  You've won {userItems.length} auction{userItems.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/items')} 
              className="w-full mt-4 bg-black text-white border-gray-700 hover:bg-gray-800"
            >
              Browse More Items
            </Button>
          </div>
        </div>
        
        {/* Won Items Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your Won Items</h2>
            {userItems.length > 0 && (
              <Button 
                variant="outline"
                onClick={() => navigate('/items')}
                className="flex items-center bg-black text-white border-gray-700 hover:bg-gray-800"
              >
                Find More <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
          </div>
          
          {userItems.length > 0 ? (
            <ItemGrid items={userItems} />
          ) : (
            <div className="text-center py-12 bg-[#1C1C28] rounded-lg border border-gray-700">
              <h3 className="text-xl font-medium text-white mb-2">No items won yet</h3>
              <p className="text-gray-400 mb-6">Start bidding to win amazing items!</p>
              <Button 
                onClick={() => navigate('/items')} 
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              >
                Browse Items
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
