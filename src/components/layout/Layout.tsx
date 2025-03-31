import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ScrollArea } from "@/components/ui/scroll-area";
import { initializeWalletDetection } from '@/utils/walletUtils';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Initialize wallet detection
  useEffect(() => {
    const detectWallets = async () => {
      await initializeWalletDetection();
    };
    
    detectWallets();
  }, []);
  
  // Enhanced scroll reveal effect with staggered animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add a staggered delay based on element index
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
    <div className="min-h-screen flex flex-col bg-blockbid-dark bg-grid text-foreground overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              backgroundColor: i % 3 === 0 ? 'rgba(255, 84, 112, 0.4)' : i % 2 === 0 ? 'rgba(61, 214, 245, 0.4)' : 'rgba(114, 43, 247, 0.4)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite ${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <Navbar />
      <ScrollArea className="flex-grow">
        <main className="flex-grow">
          {children}
        </main>
      </ScrollArea>
      <Footer />
      
      {/* Animated Gradient Orbs */}
      <div className="fixed -top-40 -left-40 w-80 h-80 bg-blockbid-accent/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="fixed -bottom-40 -right-40 w-80 h-80 bg-blockbid-tertiary/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="fixed top-1/4 right-10 w-40 h-40 bg-blockbid-secondary/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>
    </div>
  );
};

export default Layout;
