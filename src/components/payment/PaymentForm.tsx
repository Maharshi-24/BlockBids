import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useBidContext } from '@/context/BidContext';
import { toast } from 'sonner';
import { Item } from '@/context/BidContext';
import { ArrowRight, CheckCircle, Clock, Loader2, ShieldCheck } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

interface PaymentFormProps {
  item: Item;
  bidAmount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ item, bidAmount }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes countdown
  const [hasCustomWallet, setHasCustomWallet] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: hash, sendTransaction, isLoading: isTransactionLoading } = useSendTransaction();
  const navigate = useNavigate();
  
  // Check for custom wallet extensions
  useEffect(() => {
    // Check if custom wallet extension exists
    if (window.ethereum) {
      console.log("Detected provider:", window.ethereum);
      setHasCustomWallet(true);
    }
  }, []);
  
  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Handle direct connection with window.ethereum
  const handleDirectConnect = async () => {
    // Check if we have multiple providers
    if (window.ethereum?.providers) {
      console.log("Multiple providers detected. Looking for custom wallet...");
      
      // Look for custom wallet first
      let customProvider = null;
      
      for (const provider of window.ethereum.providers) {
        // Skip Brave Wallet and look for your custom wallet
        if (provider.isWalletX || provider.is1inch || 
            (provider !== window.ethereum && !provider.isBraveWallet)) {
          customProvider = provider;
          console.log("Found custom wallet provider:", provider);
          break;
        }
      }
      
      if (customProvider) {
        try {
          // Add a delay before requesting accounts to ensure the wallet is ready
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Use the specific provider to request accounts
          console.log("Requesting accounts from custom wallet provider...");
          
          // For WalletX specifically, we need to handle the connection differently
          if (customProvider.isWalletX) {
            try {
              // First try to connect using the standard method with a longer timeout
              const accountsPromise = customProvider.request({
                method: 'eth_requestAccounts',
                params: []
              });

              // Set a timeout for the connection request (25 seconds to be safe)
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Connection timeout')), 25000);
              });

              const accounts = await Promise.race([accountsPromise, timeoutPromise]);
              
              if (accounts && accounts.length > 0) {
                await handleSuccessfulConnection(customProvider, accounts);
                return;
              }
            } catch (error) {
              console.log("Standard connection failed, trying alternative method:", error);
            }
            
            // If standard method fails, try alternative connection method
            try {
              // Force inject this provider as window.ethereum temporarily
              const originalEthereum = window.ethereum;
              window.ethereum = customProvider;
              
              // Connect with wagmi first
              for (const connector of connectors) {
                if (connector.id === 'injected') {
                  try {
                    await connect({ connector });
                    console.log('Successfully connected custom wallet');
                    break;
                  } catch (error) {
                    console.log('Secondary connection failed:', error);
                  }
                }
              }
              
              // Then request accounts with a longer timeout
              const accountsPromise = customProvider.request({
                method: 'eth_requestAccounts',
                params: []
              });

              // Set a timeout for the connection request (25 seconds to be safe)
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Connection timeout')), 25000);
              });

              const accounts = await Promise.race([accountsPromise, timeoutPromise]);
              
              if (accounts && accounts.length > 0) {
                await handleSuccessfulConnection(customProvider, accounts);
              }
              
              // Restore original ethereum provider
              window.ethereum = originalEthereum;
              return;
            } catch (error) {
              console.error("Alternative connection method failed:", error);
              throw error;
            }
          } else {
            // For other wallets, use standard connection method
            const accounts = await customProvider.request({
              method: 'eth_requestAccounts',
              params: []
            });
            
            if (accounts && accounts.length > 0) {
              await handleSuccessfulConnection(customProvider, accounts);
            }
          }
        } catch (error) {
          console.error("Error connecting to custom provider:", error);
          if (error.message?.includes('rejected') || error.code === 4001) {
            toast.error('Connection rejected', {
              description: 'You rejected the wallet connection request'
            });
          } else if (error.message?.includes('timeout')) {
            toast.error('Connection timeout', {
              description: 'The wallet connection request timed out. Please try again.'
            });
          } else if (error.message?.includes('message port closed')) {
            toast.error('Connection timeout', {
              description: 'The wallet connection request timed out. Please try again.'
            });
          } else {
            toast.error('Connection failed', {
              description: 'Failed to connect to your wallet. Please try again.'
            });
          }
          return;
        }
      }
    }
    
    // Fallback to regular ethereum object if custom provider wasn't found or failed
    if (!window.ethereum) {
      toast.error('No wallet extension found', {
        description: 'Please install a wallet extension like MetaMask, WalletX, or 1inch'
      });
      return;
    }
    
    try {
      // Add a delay before requesting accounts
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force the wallet popup by directly requesting accounts
      console.log('Requesting accounts to trigger wallet popup...');
      
      const accountsPromise = window.ethereum.request({ 
        method: 'eth_requestAccounts',
        params: []
      });

      // Set a timeout for the connection request (25 seconds to be safe)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 25000);
      });

      const accounts = await Promise.race([accountsPromise, timeoutPromise]);
      
      if (accounts && accounts.length > 0) {
        await handleSuccessfulConnection(window.ethereum, accounts);
      }
    } catch (error) {
      console.error('Error connecting wallet directly:', error);
      
      if (error.message?.includes('rejected') || error.code === 4001) {
        toast.error('Connection rejected', {
          description: 'You rejected the wallet connection request'
        });
      } else if (error.message?.includes('timeout')) {
        toast.error('Connection timeout', {
          description: 'The wallet connection request timed out. Please try again.'
        });
      } else if (error.message?.includes('message port closed')) {
        toast.error('Connection timeout', {
          description: 'The wallet connection request timed out. Please try again.'
        });
      } else {
        toast.error('Failed to connect wallet', {
          description: 'Please make sure your wallet is unlocked and try again'
        });
      }
    }
  };

  // Helper function to handle successful connection
  const handleSuccessfulConnection = async (provider: any, accounts: string[]) => {
    console.log('Received accounts:', accounts);
    
    toast.success('Wallet connected!', {
      description: 'Your wallet has been connected successfully'
    });
    
    // Force refresh wagmi state with the connected account
    for (const connector of connectors) {
      if (connector.id === 'injected') {
        try {
          await connect({ connector });
          console.log('Wagmi connector successfully connected');
          break;
        } catch (error) {
          console.log('Secondary connection failed, but accounts already accessible:', error);
        }
      }
    }
  };
  
  const handlePayment = async () => {
    if (!isConnected || !address) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet to proceed with payment'
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Calculate total amount including service fee
      const totalAmount = bidAmount * 1.05;
      
      // Show info toast
      toast.info('Preparing blockchain transaction', {
        description: 'Please confirm the transaction in your wallet extension'
      });
      
      try {
        // Send the transaction
        await sendTransaction({
          to: '0x123456789AbCdEf123456789AbCdEf123456789', // Replace with actual project address
          value: parseEther(totalAmount.toString()),
          chainId: 11155111, // Sepolia testnet
        });
        
        // Note: This will only execute if the transaction was sent successfully
        // The actual hash will be available in the hook's data property
        toast.success('Transaction sent!', {
          description: 'Your transaction has been submitted to the blockchain'
        });
        
        if (hash) {
          navigate('/payment-success', { state: { item, txHash: hash } });
        }
      } catch (txError) {
        throw txError; // Re-throw to be caught by the outer catch
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      
      // Handle different error types
      if (error.message?.includes('rejected') || error.code === 4001) {
        toast.error('Transaction rejected', {
          description: 'You rejected the transaction in your wallet'
        });
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient funds', {
          description: 'Your wallet does not have enough funds for this transaction'
        });
      } else {
        toast.error('Transaction failed', {
          description: 'There was an error processing your payment. Please try again.'
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto polbid-card">
      <CardHeader>
        <CardTitle className="text-2xl text-gradient-green">Complete Payment</CardTitle>
        <CardDescription>
          Secure your auction win for {item.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-polbid-dark-gray border border-polbid-light-gray/30 p-4 rounded-lg">
            <h3 className="font-medium text-polbid-green mb-2">Payment Summary</h3>
            <div className="flex justify-between py-1 border-b border-polbid-light-gray/20">
              <span className="text-muted-foreground">Item:</span>
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-polbid-light-gray/20">
              <span className="text-muted-foreground">Bid Amount:</span>
              <span className="font-medium">{bidAmount} POL</span>
            </div>
            <div className="flex justify-between py-1 border-b border-polbid-light-gray/20">
              <span className="text-muted-foreground">Service Fee:</span>
              <span className="font-medium">{(bidAmount * 0.05).toFixed(2)} POL</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-polbid-green">{(bidAmount * 1.05).toFixed(2)} POL</span>
            </div>
          </div>
          
          <div className="bg-polbid-dark-gray border border-polbid-light-gray/30 p-4 rounded-lg">
            <h3 className="font-medium text-polbid-green mb-2">Wallet Information</h3>
            {isConnected ? (
              <div>
                <p className="text-muted-foreground mb-2">Connected Wallet:</p>
                <div className="bg-polbid-gray/50 p-2 border border-polbid-light-gray/30 rounded-md font-mono text-sm break-all">
                  {address.slice(0, 8)}...{address.slice(-8)}
                </div>
                <Button
                  variant="outline"
                  onClick={() => disconnect()}
                  className="mt-2 w-full"
                >
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">Connect your crypto wallet to complete payment.</p>
                
                {/* Direct connect button for custom wallets */}
                {hasCustomWallet && (
                  <Button
                    onClick={handleDirectConnect}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-md flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <span className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {window.ethereum?.providers ? "Connect with Custom Wallet" : "Connect Your Wallet Extension"}
                    </span>
                  </Button>
                )}
                
                {/* Standard connector buttons */}
                {connectors.map((connector) => (
                  <Button
                    key={connector.id}
                    onClick={async () => {
                      try {
                        await connect({ connector });
                      } catch (error) {
                        console.error('Connection error:', error);
                        if (error.message?.includes('rejected')) {
                          toast.error('Connection rejected', {
                            description: 'You rejected the connection request in your wallet'
                          });
                        } else {
                          toast.error('Connection failed', {
                            description: 'Could not connect to your wallet. Please try again.'
                          });
                        }
                      }
                    }}
                    className="w-full"
                    disabled={!connector.ready || isConnecting}
                  >
                    {isConnecting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Connecting...
                      </span>
                    ) : (
                      `Connect ${connector.name}`
                    )}
                  </Button>
                ))}
                <p className="text-xs text-muted-foreground text-center">
                  Supports WalletX, 1inch Wallet, MetaMask and other Ethereum-compatible wallets
                </p>
              </div>
            )}
          </div>
          
          {countdown > 0 && (
            <div className="bg-polbid-dark-gray border border-polbid-blue/30 p-3 rounded-md flex items-center justify-between">
              <div>
                <p className="text-polbid-blue font-medium">Time remaining:</p>
                <p className="text-sm text-muted-foreground">Complete payment to secure your win</p>
              </div>
              <div className="flex items-center gap-2 bg-polbid-gray/50 p-2 rounded-md">
                <Clock size={18} className="text-polbid-blue" />
                <div className="font-mono text-lg font-bold text-polbid-blue">
                  {formatTime(countdown)}
                </div>
              </div>
            </div>
          )}
          
          <Button
            onClick={handlePayment}
            className="w-full polbid-button"
            disabled={isProcessing || !isConnected || countdown <= 0 || isTransactionLoading}
          >
            {isProcessing || isTransactionLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 size={18} className="mr-2 animate-spin" /> 
                Processing Payment...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Complete Payment with POL <ArrowRight size={18} className="ml-2" />
              </span>
            )}
          </Button>
          
          {countdown <= 0 && (
            <div className="bg-polbid-dark-gray border border-polbid-amber/30 p-3 rounded-md text-center">
              <p className="font-medium text-polbid-amber">Payment window expired</p>
              <p className="text-sm mt-1 text-muted-foreground">Please place a new bid to try again</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-polbid-light-gray/20 pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={16} className="text-polbid-green" />
          <span>Test environment - no real POL will be charged</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
