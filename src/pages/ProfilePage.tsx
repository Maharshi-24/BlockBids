
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBidContext } from '@/context/BidContext';
import { toast } from 'sonner';
import { 
  User, 
  Wallet, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  History,
  ArrowRight
} from 'lucide-react';
import { detectWalletProviders, WalletProvider } from '@/utils/walletUtils';

const ProfilePage = () => {
  const { wallet, setWallet } = useBidContext();
  const [walletAddress, setWalletAddress] = useState(wallet || '');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [availableWallets, setAvailableWallets] = useState<WalletProvider[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUsername('PolBid User');
      setEmail('user@example.com');
    }, 500);
    
    // Validate wallet on initial load if exists
    if (wallet) {
      validateWalletAddress(wallet);
    }
    
    // Check for available wallet extensions
    const checkWallets = async () => {
      const providers = await detectWalletProviders();
      setAvailableWallets(providers);
    };
    
    checkWallets();
  }, [wallet]);
  
  const validateWalletAddress = (address: string) => {
    try {
      // First check for POL format (our custom format)
      if (address.startsWith('pol_')) {
        // Validate the part after pol_ as a valid ethereum address
        const ethAddress = '0x' + address.slice(4);
        const isValidEth = ethers.isAddress(ethAddress);
        setIsValid(isValidEth);
        return isValidEth;
      }
      
      // Check if it's a valid Ethereum address
      const isValidEth = ethers.isAddress(address);
      setIsValid(isValidEth);
      return isValidEth;
    } catch (error) {
      setIsValid(false);
      return false;
    }
  };
  
  const handleSaveWallet = () => {
    setIsLoading(true);
    
    // Validate wallet address
    const valid = validateWalletAddress(walletAddress);
    
    setTimeout(() => {
      if (valid) {
        // Format wallet to POL format if not already
        const formattedWallet = walletAddress.startsWith('pol_') 
          ? walletAddress 
          : `pol_${walletAddress.startsWith('0x') ? walletAddress.slice(2) : walletAddress}`;
        
        setWallet(formattedWallet);
        toast.success('Wallet address updated successfully', {
          description: 'Your POL wallet has been linked to your account'
        });
      } else {
        toast.error('Invalid wallet address', {
          description: 'Please enter a valid POL or Ethereum wallet address'
        });
      }
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center reveal">
            <h1 className="text-3xl font-bold text-gradient-green mb-2">
              Your Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your account details and wallet connection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <Card className="polbid-card reveal">
              <CardHeader className="pb-2">
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Your basic information</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center py-6">
                <div className="w-24 h-24 bg-polbid-light-gray rounded-full flex items-center justify-center mb-4">
                  <User size={48} className="text-polbid-green" />
                </div>
                <h3 className="text-xl font-semibold">{username}</h3>
                <p className="text-muted-foreground">{email}</p>
              </CardContent>
            </Card>
            
            {/* Wallet Management Card */}
            <Card className="polbid-card md:col-span-2 reveal" style={{animationDelay: '200ms'}}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-polbid-green" />
                  Blockchain Wallet
                </CardTitle>
                <CardDescription>Manage your POL wallet connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 py-4">
                {/* Connected wallet extensions section */}
                {availableWallets.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Available Wallet Extensions</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableWallets.map((walletProvider, index) => (
                        <div 
                          key={`provider-${index}`} 
                          className="flex items-center gap-2 bg-polbid-dark-gray/80 px-3 py-2 rounded-md border border-polbid-light-gray/30"
                        >
                          <img src={walletProvider.icon} alt={walletProvider.name} className="h-5 w-5" />
                          <span className="text-sm">{walletProvider.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              
                <div className="space-y-2">
                  <Label htmlFor="wallet-address" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    POL Wallet Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="wallet-address"
                      value={walletAddress}
                      onChange={(e) => {
                        setWalletAddress(e.target.value);
                        if (e.target.value.length > 8) {
                          validateWalletAddress(e.target.value);
                        } else {
                          setIsValid(null);
                        }
                      }}
                      placeholder="pol_0x..."
                      className="pr-10 bg-polbid-dark-gray border-polbid-light-gray focus:border-polbid-green"
                    />
                    {isValid !== null && (
                      <div className="absolute right-3 top-2.5">
                        {isValid ? (
                          <CheckCircle size={18} className="text-polbid-green" />
                        ) : (
                          <AlertTriangle size={18} className="text-polbid-amber" />
                        )}
                      </div>
                    )}
                  </div>
                  {isValid === false && (
                    <p className="text-sm text-polbid-amber mt-1">
                      Please enter a valid POL or Ethereum wallet address
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Your wallet address is used for testing POL transactions. No actual cryptocurrency will be used.
                  </p>
                </div>
                
                <div className="border border-polbid-light-gray/30 rounded-md p-4 bg-polbid-dark-gray">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle size={16} className="text-polbid-green" />
                    Test Environment
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    This is a test environment for POL transactions. No real cryptocurrency will be charged
                    when making bids or payments.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-end w-full">
                  <Button 
                    onClick={handleSaveWallet} 
                    disabled={isLoading || !walletAddress || isValid === false}
                    className="polbid-button"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Wallet
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Bid History Card */}
            <Card className="polbid-card md:col-span-3 reveal" style={{animationDelay: '400ms'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-polbid-blue" />
                  Auction History
                </CardTitle>
                <CardDescription>Your recent POL bid activity</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Empty state */}
                <div className="text-center py-12">
                  <div className="rounded-full bg-polbid-light-gray/20 p-4 inline-flex mb-4">
                    <Wallet size={24} className="text-polbid-green" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No bid history yet</h3>
                  <p className="text-muted-foreground mb-6">Start bidding on items to build your history</p>
                  <Button onClick={() => navigate('/items')} className="polbid-button-secondary">
                    Browse Items 
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
