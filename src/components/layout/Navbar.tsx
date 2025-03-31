
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, Wallet, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useBidContext } from '@/context/BidContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, wallet } = useBidContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled ? 'bg-blockbid-darker/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <div className="flex items-center">
          <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blockbid-accent to-blockbid-tertiary rounded-lg flex items-center justify-center text-white font-bold text-xl">B</div>
            <span className="font-bold text-2xl">
              Block<span className="text-blockbid-accent">Bid</span>
            </span>
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <button onClick={() => navigate('/')} className="text-gray-300 hover:text-blockbid-accent transition-colors">Home</button>
          <button onClick={() => navigate('/items')} className="text-gray-300 hover:text-blockbid-accent transition-colors">All Items</button>
          <button onClick={() => navigate('/how-it-works')} className="text-gray-300 hover:text-blockbid-accent transition-colors">How It Works</button>
          
          {isLoggedIn ? (
            <>
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 border-blockbid-light text-blockbid-secondary hover:bg-blockbid-light hover:text-white">
                <ShoppingBag size={18} />
                <span>My Bids</span>
              </Button>
              <Button onClick={() => navigate('/profile')} className="flex items-center gap-2 bg-blockbid-accent hover:bg-blockbid-accent-hover">
                <User size={18} />
                <span>{wallet ? "Wallet Connected" : "Profile"}</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate('/login')} className="flex items-center gap-2 border-blockbid-light text-blockbid-secondary hover:bg-blockbid-light hover:text-white">
                <User size={18} />
                <span>Login</span>
              </Button>
              <Button onClick={() => navigate('/register')} className="flex items-center gap-2 bg-blockbid-accent hover:bg-blockbid-accent-hover">
                <Wallet size={18} />
                <span>Register</span>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blockbid-accent hover:bg-blockbid-light/10"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-white hover:text-blockbid-accent hover:bg-blockbid-light/10">Home</button>
            <button onClick={() => { navigate('/items'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-white hover:text-blockbid-accent hover:bg-blockbid-light/10">All Items</button>
            <button onClick={() => { navigate('/how-it-works'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-white hover:text-blockbid-accent hover:bg-blockbid-light/10">How It Works</button>
            
            {isLoggedIn ? (
              <>
                <button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-white hover:text-blockbid-accent hover:bg-blockbid-light/10">My Bids</button>
                <button onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-white hover:text-blockbid-accent hover:bg-blockbid-light/10">Profile</button>
              </>
            ) : (
              <>
                <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-white hover:text-blockbid-accent hover:bg-blockbid-light/10">Login</button>
                <button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-white hover:text-blockbid-accent hover:bg-blockbid-light/10">Register</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
