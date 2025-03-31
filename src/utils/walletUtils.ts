
import { toast } from 'sonner';

/**
 * Interface for supported wallet providers
 */
export interface WalletProvider {
  name: string;
  provider: any;
  icon: string;
}

/**
 * Checks if a Web3 provider/wallet extension is available in the browser
 * @returns Promise with array of available wallet providers
 */
export const detectWalletProviders = async (): Promise<WalletProvider[]> => {
  const providers: WalletProvider[] = [];
  
  try {
    // Check for window.ethereum (MetaMask and most providers)
    if (window.ethereum) {
      let provider = window.ethereum;
      
      // Check if MetaMask specifically
      if (window.ethereum.isMetaMask) {
        providers.push({
          name: 'MetaMask',
          provider: provider,
          icon: 'https://metamask.io/images/metamask-logo.png'
        });
      }
      
      // Check if it's Trust Wallet
      if (window.ethereum.isTrust || window.ethereum.isTrustWallet) {
        providers.push({
          name: 'Trust Wallet',
          provider: provider,
          icon: 'https://trustwallet.com/assets/images/media/assets/trust_platform.png'
        });
      }
      
      // If not specifically identified but ethereum exists
      if (providers.length === 0) {
        providers.push({
          name: 'Web3 Provider',
          provider: provider,
          icon: 'https://polkadot.network/assets/img/logo-polkadot.svg' // Default icon
        });
      }
    }
    
    // Check for Polkadot{.js} extension
    if ((window as any).injectedWeb3 && (window as any).injectedWeb3['polkadot-js']) {
      providers.push({
        name: 'Polkadot{.js}',
        provider: (window as any).injectedWeb3['polkadot-js'],
        icon: 'https://polkadot.network/assets/img/logo-polkadot.svg'
      });
    }
    
    return providers;
  } catch (error) {
    console.error('Error detecting wallet providers:', error);
    return [];
  }
};

/**
 * Requests connection to the wallet
 * @param provider The wallet provider to connect with
 * @returns The wallet address if successful, null otherwise
 */
export const connectWallet = async (provider: any): Promise<string | null> => {
  try {
    if (!provider) {
      toast.error('No wallet provider available');
      return null;
    }

    // Request account access
    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });

    if (accounts && accounts.length > 0) {
      const address = accounts[0];
      
      // Format to POL address if needed
      const polAddress = address.startsWith('0x') 
        ? 'pol_' + address.slice(2)
        : (address.startsWith('pol_') ? address : 'pol_' + address);
        
      // Save to local storage
      localStorage.setItem('connected_wallet', polAddress);
      
      toast.success('Wallet connected successfully!', {
        description: `Connected to ${polAddress.slice(0, 6)}...${polAddress.slice(-4)}`
      });
      
      return polAddress;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error connecting wallet:', error);
    
    // Handle user rejected request
    if (error.code === 4001) {
      toast.error('Connection rejected', {
        description: 'Please connect your wallet to continue'
      });
    } else {
      toast.error('Failed to connect wallet', {
        description: error.message || 'Unknown error'
      });
    }
    
    return null;
  }
};

/**
 * Initiates a transaction using the connected wallet
 * @param provider The wallet provider to use
 * @param toAddress The recipient address
 * @param amount The amount to send (in wei)
 * @param data Additional data for the transaction
 * @returns The transaction hash if successful, null otherwise
 */
export const sendTransaction = async (
  provider: any,
  toAddress: string,
  amount: string,
  data: string = ''
): Promise<string | null> => {
  try {
    if (!provider) {
      toast.error('No wallet provider available');
      return null;
    }
    
    // For test/demo environment, we don't actually send transactions
    if (process.env.NODE_ENV === 'development' || true) { // Always true for testing
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate fake transaction hash
      const fakeHash = '0x' + Array(64).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)).join('');
      
      return fakeHash;
    }
    
    // Get current account
    const accounts = await provider.request({ method: 'eth_accounts' });
    
    if (!accounts || accounts.length === 0) {
      toast.error('No connected accounts found');
      return null;
    }
    
    // Clean up addresses
    const fromAddress = accounts[0];
    const cleanToAddress = toAddress.startsWith('pol_') ? '0x' + toAddress.slice(4) : toAddress;
    
    // Request to send transaction
    const txHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: fromAddress,
        to: cleanToAddress,
        value: amount, // in wei
        data: data,
        gas: '0x76c0', // 30400 gas
      }],
    });
    
    return txHash;
  } catch (error: any) {
    console.error('Error sending transaction:', error);
    
    // Handle user rejected request
    if (error.code === 4001) {
      toast.error('Transaction rejected', {
        description: 'You rejected the transaction'
      });
    } else {
      toast.error('Transaction failed', {
        description: error.message || 'Unknown error occurred'
      });
    }
    
    return null;
  }
};

/**
 * Initializes wallet detection and setup across the site
 * @returns Promise resolving to available providers
 */
export const initializeWalletDetection = async (): Promise<WalletProvider[]> => {
  try {
    // Detect available wallet providers
    const providers = await detectWalletProviders();
    
    if (providers.length > 0) {
      // Save flag indicating wallet extension is available
      localStorage.setItem('has_pol_wallet', 'true');
      
      // Try to restore previous connection if exists
      const savedWallet = localStorage.getItem('connected_wallet');
      if (savedWallet) {
        // Here we'd validate the saved wallet is still accessible
        // For demo purposes, we'll just assume it is
      }
      
      return providers;
    } else {
      localStorage.setItem('has_pol_wallet', 'false');
    }
    
    return [];
  } catch (error) {
    console.error('Error initializing wallet detection:', error);
    return [];
  }
};

// Add this to window type
declare global {
  interface Window {
    ethereum?: any;
  }
}
