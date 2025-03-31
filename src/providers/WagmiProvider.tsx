import React, { useEffect } from 'react';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/connectors/injected';

// Increase EventEmitter max listeners to prevent warnings
if (typeof window !== 'undefined' && window.ethereum && window.ethereum.setMaxListeners) {
  window.ethereum.setMaxListeners(30);
}

const { chains, publicClient } = configureChains(
  [sepolia],
  [publicProvider()]
);

// Find all ethereum providers in window
const getAvailableProviders = () => {
  const providers = [];
  
  // Check for global ethereum object (standard wallet)
  if (window.ethereum) {
    // Increase max listeners to prevent memory leak warnings
    if (window.ethereum.setMaxListeners) {
      window.ethereum.setMaxListeners(30);
    }
    
    providers.push({
      name: window.ethereum.isMetaMask ? 'MetaMask' : 'Browser Wallet',
      provider: window.ethereum
    });
  }
  
  // Check for multiple providers
  if (window.ethereum?.providers) {
    window.ethereum.providers.forEach(provider => {
      // Set max listeners for each provider
      if (provider.setMaxListeners) {
        provider.setMaxListeners(30);
      }
      
      providers.push({
        name: provider.isMetaMask ? 'MetaMask' : 
              provider.isBraveWallet ? 'Brave Wallet' : 
              provider.isWalletX ? 'WalletX' : 
              provider.is1inch ? '1inch Wallet' : 
              'Browser Wallet',
        provider
      });
    });
  }
  
  // Log available providers for debugging
  console.log('Available Ethereum providers:', providers);
  
  return providers;
};

// Custom connector for any injected wallets
const customInjectedConnector = new InjectedConnector({
  chains,
  options: {
    getProvider: () => {
      // First check if there are multiple providers available
      if (window.ethereum?.providers) {
        console.log("Multiple providers detected, searching for custom wallet...");
        
        // Search for custom wallet provider first
        for (const provider of window.ethereum.providers) {
          // Look specifically for your custom wallet and prioritize it over Brave Wallet
          if (provider.isWalletX || provider.is1inch || 
              (provider !== window.ethereum && !provider.isBraveWallet)) {
            console.log("Found custom wallet provider:", provider);
            
            // Set max listeners
            if (provider.setMaxListeners) {
              provider.setMaxListeners(30);
            }
            
            return provider;
          }
        }
      }
      
      // Fallback to window.ethereum (but try to avoid Brave Wallet)
      const provider = window.ethereum;
      if (provider && provider.setMaxListeners) {
        provider.setMaxListeners(30);
      }
      
      return provider;
    },
    name: (detectedName) => {
      // Ensure we're handling string input
      const name = typeof detectedName === 'string' ? detectedName : '';
      
      // Check for wallet by name
      if (name.toLowerCase().includes('walletx')) return 'WalletX';
      if (name.toLowerCase().includes('1inch')) return '1inch Wallet';
      
      // Check if we can identify by provider properties
      if (window.ethereum?.isWalletX) return 'WalletX';
      if (window.ethereum?.is1inch) return '1inch Wallet';
      
      return name || 'Custom Wallet';
    },
    shimDisconnect: true,
  },
});

const config = createConfig({
  autoConnect: true,
  connectors: [
    customInjectedConnector,
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
});

export const WagmiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Log available providers and set max listeners on component mount
  useEffect(() => {
    getAvailableProviders();
    
    // Set max listeners for window.ethereum if it exists
    if (window.ethereum && window.ethereum.setMaxListeners) {
      window.ethereum.setMaxListeners(30);
    }
    
    // Log window ethereum object for debugging
    console.log('window.ethereum:', window.ethereum);
    
    // Check if we can detect custom extensions
    const hasCustomWallet = window.ethereum?.hasOwnProperty('isWalletX') || 
                           window.ethereum?.hasOwnProperty('is1inch');
    
    console.log('Custom wallet detected:', hasCustomWallet);
  }, []);
  
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}; 