
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">How AutoWin Bidding Works</h1>
          <p className="text-xl text-gray-600 mb-12 text-center">Our revolutionary bidding platform guarantees success with every bid.</p>
          
          {/* Steps */}
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-bidzone-purple text-white rounded-full flex items-center justify-center font-bold mr-3">1</div>
                  <h2 className="text-2xl font-bold">Browse Available Items</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Explore our wide selection of premium items available for bidding. From electronics to fashion and collectibles, there's something for everyone.
                </p>
                <Button 
                  onClick={() => navigate('/items')} 
                  variant="outline"
                >
                  Browse Items
                </Button>
              </div>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center order-1 md:order-2">
                <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-bidzone-purple text-white rounded-full flex items-center justify-center font-bold mr-3">2</div>
                  <h2 className="text-2xl font-bold">Place Your Bid</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Enter your bid amount for your chosen item. Unlike traditional auctions, our platform guarantees that every bid is a winner. No waiting, no competing - just instant gratification!
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-bidzone-purple text-white rounded-full flex items-center justify-center font-bold mr-3">3</div>
                  <h2 className="text-2xl font-bold">Celebrate Your Win</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Once you place your bid, you'll immediately be declared the winner! Our innovative system ensures that every participant walks away happy.
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center order-1 md:order-2">
                <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <svg className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-bidzone-purple text-white rounded-full flex items-center justify-center font-bold mr-3">4</div>
                  <h2 className="text-2xl font-bold">Secure Payment with Cryptocurrency</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Complete your purchase using cryptocurrency. Our platform seamlessly integrates with popular wallets like MetaMask, Trust Wallet, and Coinbase Wallet for secure, transparent transactions.
                </p>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Winning?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied users who are winning auctions every day.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="neu-button"
            >
              Create Account <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
          
          {/* FAQ */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2">How can everyone win?</h4>
                <p className="text-gray-600">
                  Our innovative platform is designed to ensure that every participant experiences the joy of winning. Each bid is processed individually, allowing everyone to be a winner.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2">What cryptocurrencies do you accept?</h4>
                <p className="text-gray-600">
                  We currently accept Bitcoin, Ethereum, and other major cryptocurrencies. Our platform integrates with popular wallets for seamless transactions.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2">How long does shipping take?</h4>
                <p className="text-gray-600">
                  Shipping times vary depending on your location and the item purchased. Typically, items are shipped within 1-3 business days, with delivery taking 5-10 business days.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold mb-2">Is my payment information secure?</h4>
                <p className="text-gray-600">
                  Absolutely. We use blockchain technology to ensure all transactions are secure, transparent, and tamper-proof. Your wallet information is never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
