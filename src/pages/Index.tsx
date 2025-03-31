
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ItemGrid from '@/components/items/ItemGrid';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBidContext } from '@/context/BidContext';
import HeroSvg from '@/components/ui/HeroSvg';

const Index = () => {
  const navigate = useNavigate();
  const { featuredItems } = useBidContext();
  
  // Enhanced scroll reveal animation with staggered effect
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay based on element index
          setTimeout(() => {
            entry.target.classList.add('active');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(element => {
      observer.observe(element);
    });

    return () => {
      revealElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1">
              <div className="reveal" style={{ transitionDelay: '0.1s' }}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight animate-pulse">
                  <span className="text-gradient">Block</span>
                  <span className="text-white">Bid</span>
                </h1>
                <p className="text-xl text-blockbid-light-gray mb-8 max-w-xl">
                  The first blockchain auction platform where every bid wins. Powered by cutting-edge technology for a seamless, transparent bidding experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => navigate('/items')} 
                    className="blockbid-button text-lg hover:scale-105 transition-transform duration-200"
                  >
                    Start Bidding <ArrowRight size={20} className="ml-2 animate-bounce-horizontal" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/how-it-works')}
                    className="border-blockbid-light text-blockbid-secondary hover:bg-blockbid-light hover:text-white text-lg hover:scale-105 transition-transform duration-200"
                  >
                    How It Works
                  </Button>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="reveal floating" style={{ transitionDelay: '0.3s' }}>
                <HeroSvg />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-10 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Active Auctions', value: '34,782+', icon: <Zap size={24} className="text-blockbid-accent animate-pulse" /> },
              { label: 'Successful Bids', value: '2.3M+', icon: <Shield size={24} className="text-blockbid-secondary animate-pulse" /> },
              { label: 'Global Users', value: '189K+', icon: <Globe size={24} className="text-blockbid-tertiary animate-pulse" /> },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="glass-panel p-6 text-center reveal hover:transform hover:scale-105 transition-all duration-300"
                style={{ transitionDelay: `${0.1 * index}s` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blockbid-blue/30 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-2 animate-fade-in">{stat.value}</div>
                <div className="text-blockbid-light-gray">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl font-bold mb-4 text-gradient animate-pulse">Why BlockBid?</h2>
            <p className="text-xl text-blockbid-light-gray max-w-2xl mx-auto">
              Our platform offers a cutting-edge bidding experience with full blockchain integration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="glass-panel p-6 rounded-xl reveal hover:transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blockbid-accent to-blockbid-secondary flex items-center justify-center mb-6 animate-spin-slow">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Secure Blockchain</h3>
              <p className="text-blockbid-light-gray">
                All transactions are secured and verified by blockchain technology for full transparency.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl reveal hover:transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blockbid-secondary to-blockbid-tertiary flex items-center justify-center mb-6 animate-spin-slow">
                <Zap size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Instant Wins</h3>
              <p className="text-blockbid-light-gray">
                Our revolutionary bidding system guarantees success with every bid you place.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl reveal hover:transform hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.3s' }}>
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blockbid-tertiary to-blockbid-accent flex items-center justify-center mb-6 animate-spin-slow">
                <Globe size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Global Marketplace</h3>
              <p className="text-blockbid-light-gray">
                Access exclusive items from sellers worldwide with our expansive marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Items Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10 reveal">
            <h2 className="text-3xl font-bold text-gradient animate-pulse">Hot Auctions</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/items')}
              className="border-blockbid-accent text-blockbid-accent hover:bg-blockbid-accent hover:text-white transition-all duration-300 hover:scale-105"
            >
              View All <ArrowRight size={16} className="ml-2 animate-bounce-horizontal" />
            </Button>
          </div>
          
          <div className="reveal">
            <ItemGrid items={featuredItems} />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-blockbid-tertiary/20 to-blockbid-blue/20 blur-xl animate-pulse"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center glass-panel p-10 rounded-2xl reveal hover:transform hover:border-blockbid-accent/50 transition-all duration-500">
            <h2 className="text-4xl font-bold mb-6 text-gradient animate-pulse">Start Bidding Today</h2>
            <p className="text-xl text-blockbid-light-gray mb-8">
              Join our revolutionary platform and experience the thrill of bidding with a guaranteed win every time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => navigate('/register')} 
                className="blockbid-button py-6 text-lg hover:scale-105 transition-transform duration-300"
              >
                Create Account <ArrowRight size={20} className="ml-2 animate-bounce-horizontal" />
              </Button>
              <Button 
                onClick={() => navigate('/how-it-works')} 
                variant="outline"
                className="border-blockbid-light text-blockbid-secondary hover:bg-blockbid-light hover:text-white py-6 text-lg hover:scale-105 transition-transform duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
