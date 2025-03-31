import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useBidContext } from '@/context/BidContext';
import { toast } from 'sonner';
import { Wallet, AlertCircle, Loader2, ShieldCheck, CheckCircle } from 'lucide-react';
import { detectWalletProviders, connectWallet, WalletProvider } from '@/utils/walletUtils';

// Initialize Web3Modal
const web3Modal = new Web3Modal({
  cacheProvider: false,
  theme: 'dark',
  // Remove network field and configure chain in providerOptions
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: import.meta.env.VITE_INFURA_ID,
        rpc: {
          11155111: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_ID}`
        },
        // Explicitly set chainId for WalletConnect
        chainId: 11155111,
        qrcodeModalOptions: {
          mobileLinks: ["1inch", "metamask", "trust"]
        }
      }
    }
  }
});

const WalletConnect: React.FC = () => {
  const [walletId, setWalletId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectingWallet, setDetectingWallet] = useState(true);
  const [isValidWallet, setIsValidWallet] = useState<boolean | null>(null);
  const [walletProviders, setWalletProviders] = useState<WalletProvider[]>([]);
  const { setWallet, setWalletDetected } = useBidContext();
  const navigate = useNavigate();

  const connectWithWalletConnect = async () => {
    try {
      setIsSubmitting(true);
      const provider = await web3Modal.connect();
      
      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts: string[]) => {
        console.log("Account changed:", accounts[0]);
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId: number) => {
        console.log("Chain changed:", chainId);
        if (chainId !== 11155111) {
          toast.error('Please switch to Sepolia network', {
            description: 'This app only works with Sepolia testnet'
          });
        }
      });

      // Subscribe to session disconnection
      provider.on("disconnect", (code: number, reason: string) => {
        console.log("Disconnected:", code, reason);
        toast.error('Wallet disconnected', {
          description: reason || 'Please try connecting again'
        });
      });
      
      const ethersProvider = new ethers.BrowserProvider(provider);
      
      // Check if we're on Sepolia network
      const network = await ethersProvider.getNetwork();
      if (network.chainId !== BigInt(11155111)) {
        toast.error('Wrong network detected', {
          description: 'Please switch to Sepolia testnet in your wallet'
        });
        throw new Error('Please switch to Sepolia network');
      }

      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      
      // Format address with POL prefix
      const formattedAddress = `pol_${address.slice(2)}`;
      
      setWallet(formattedAddress);
      window.localStorage.setItem('has_pol_wallet', 'true');
      
      toast.success('POL wallet connected successfully!', {
        duration: 3000
      });
      
      setTimeout(() => {
        toast.success('🎉 Congratulations! You Won!', {
          description: 'You have successfully won 1000 POL tokens! (Test Environment - No actual transfer)',
          duration: 5000
        });
      }, 1000);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet', {
        description: error instanceof Error ? error.message : 'Please try again or use manual connection'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Detect wallet providers
  useEffect(() => {
    const detectWallets = async () => {
      setDetectingWallet(true);
      try {
        const providers = await detectWalletProviders();
        setWalletProviders(providers);
        if (providers.length > 0) {
          setWalletDetected(true);
          toast.success(`${providers.length} wallet extension(s) detected`, {
            description: "You can connect with one click"
          });
        } else {
          setWalletDetected(false);
        }
      } catch (error) {
        console.error("Error detecting wallet:", error);
        setWalletDetected(false);
      } finally {
        setDetectingWallet(false);
      }
    };
    detectWallets();
  }, [setWalletDetected]);

  // Update the validation function to handle both wallet addresses and private keys
  const validateWalletInput = (input: string) => {
    try {
      if (/^[0-9a-fA-F]{64}$/.test(input)) {
        setIsValidWallet(true);
        return true;
      }
      
      if (input.startsWith('pol_')) {
        const ethAddress = '0x' + input.slice(4);
        const isValidEth = ethers.isAddress(ethAddress);
        setIsValidWallet(isValidEth);
        return isValidEth;
      }
      
      const isValidEth = ethers.isAddress(input);
      setIsValidWallet(isValidEth);
      return isValidEth;
    } catch (error) {
      setIsValidWallet(false);
      return false;
    }
  };

  const handleManualConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!walletId) {
      toast.error('Please enter a wallet address', {
        description: 'Wallet address cannot be empty'
      });
      setIsSubmitting(false);
      return;
    }
    
    const isValid = validateWalletInput(walletId);
    
    if (!isValid) {
      toast.error('Invalid wallet address', {
        description: 'Please enter a valid POL or Ethereum address'
      });
      setIsSubmitting(false);
      return;
    }
    
    const formattedWalletId = walletId.startsWith('pol_') ? walletId : `pol_${walletId.startsWith('0x') ? walletId.slice(2) : walletId}`;
    
    setTimeout(() => {
      setWallet(formattedWalletId);
      window.localStorage.setItem('has_pol_wallet', 'true');
      
      toast.success('POL wallet connected successfully!', {
        duration: 3000
      });
      
      setTimeout(() => {
        toast.success('🎉 Congratulations! You Won!', {
          description: 'You have successfully won 1000 POL tokens! (Test Environment - No actual transfer)',
          duration: 5000
        });
      }, 1000);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card className="polbid-card w-full max-w-md mx-auto reveal bg-[#1C1C28]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-white">Connect Your POL Wallet</CardTitle>
        <CardDescription className="text-gray-400">
          Link your blockchain wallet to enable secure bidding with POL cryptocurrency
        </CardDescription>
      </CardHeader>
      <CardContent>
        {detectingWallet ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-pulse rounded-full bg-polbid-light-gray/30 p-6 mb-6">
              <Loader2 className="h-12 w-12 text-polbid-green animate-spin" />
            </div>
            <p className="text-center text-lg font-medium text-white mb-2">Detecting Blockchain Wallets</p>
            <p className="text-center text-muted-foreground">Looking for compatible wallet extensions...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <Button 
                onClick={connectWithWalletConnect}
                className="w-full h-14 text-base flex items-center justify-center gap-3 bg-[#1C1C28] text-white border border-gray-700 hover:bg-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <img src="/walletconnect-logo.svg" alt="WalletConnect" className="h-6 w-6" />
                )}
                <span>Connect with WalletConnect</span>
              </Button>

              {/* MetaMask Button */}
              <Button 
                onClick={() => connectWallet({ name: 'MetaMask' })}
                className="w-full h-14 text-base flex items-center justify-center gap-3 bg-[#1C1C28] text-white border border-gray-700 hover:bg-gray-800"
                disabled={isSubmitting}
              >
                <img src="/metamask-icon.svg" alt="MetaMask" className="h-6 w-6" />
                <span>Connect with MetaMask</span>
              </Button>
            </div>
            
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-[#1C1C28] text-gray-400">Or enter wallet address</span>
              </div>
            </div>
            
            <form onSubmit={handleManualConnect} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="wallet-id" className="flex items-center gap-2 text-white">
                  <Wallet className="h-4 w-4 text-[#8B5CF6]" />
                  POL Wallet Address or Private Key
                </Label>
                <div className="relative">
                  <Input
                    id="wallet-id"
                    value={walletId}
                    onChange={(e) => {
                      const input = e.target.value.trim();
                      setWalletId(input);
                      if (input.length > 8) {
                        validateWalletInput(input);
                      } else {
                        setIsValidWallet(null);
                      }
                    }}
                    placeholder="Enter wallet address or private key"
                    required
                    className="w-full bg-[#0D0D13] border-gray-700 focus:border-[#8B5CF6] font-mono text-sm text-white placeholder:text-gray-500 rounded-md px-4 py-3 [&:-webkit-autofill]:!bg-[#0D0D13] [&:-webkit-autofill]:!text-white [&:-webkit-autofill]:!shadow-[0_0_0_30px_#0D0D13_inset] [&:-webkit-autofill]:!-webkit-text-fill-color-[#ffffff]"
                    style={{ WebkitTextFillColor: 'white' }}
                  />
                  {isValidWallet !== null && walletId.length > 8 && (
                    <div className="absolute right-3 top-2.5">
                      {isValidWallet ? (
                        <CheckCircle size={16} className="text-[#8B5CF6]" />
                      ) : (
                        <AlertCircle size={16} className="text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {isValidWallet === false && walletId.length > 0 && (
                  <p className="text-sm text-red-500 font-medium">
                    Invalid format. Please enter a valid wallet address or private key.
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Enter your POL wallet address, Ethereum address, or private key
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium py-3 rounded-md"
                disabled={isSubmitting || !walletId || isValidWallet === false}
              >
                {isSubmitting ? 
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</> : 
                  'Connect Wallet'
                }
              </Button>
              
              <div className="flex items-center justify-center p-4 bg-[#1C1C28] border border-gray-700 rounded-md mt-6">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck size={18} className="text-[#8B5CF6]" />
                  <p className="text-gray-400">
                    <span className="font-medium text-[#8B5CF6]">Test Environment:</span> No actual POL will be charged.
                  </p>
                </div>
              </div>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
