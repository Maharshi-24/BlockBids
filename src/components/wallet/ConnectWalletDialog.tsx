
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useBidContext } from '@/context/BidContext';
import { Loader2 } from 'lucide-react';
import { WalletProvider, connectWallet } from '@/utils/walletUtils';

interface ConnectWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
  walletProviders: WalletProvider[];
}

const ConnectWalletDialog: React.FC<ConnectWalletDialogProps> = ({ 
  isOpen, 
  onClose,
  walletProviders
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<WalletProvider | null>(null);
  const { setWallet } = useBidContext();
  const navigate = useNavigate();
  
  const handleConnectWallet = async (provider: WalletProvider) => {
    setSelectedProvider(provider);
    setIsConnecting(true);
    
    try {
      const address = await connectWallet(provider.provider);
      if (address) {
        setWallet(address);
        onClose();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
      setSelectedProvider(null);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-polbid-dark-gray border border-polbid-light-gray/50 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl text-gradient-green">Connect Blockchain Wallet</DialogTitle>
          <DialogDescription>
            Select a wallet provider to connect with the POL network.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {walletProviders.map((provider, index) => (
            <Button
              key={`dialog-wallet-${index}`}
              variant="outline"
              className="flex justify-start items-center h-14 px-4 hover:bg-polbid-light-gray/20"
              onClick={() => handleConnectWallet(provider)}
              disabled={isConnecting}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-polbid-gray/50 flex items-center justify-center">
                  <img src={provider.icon} alt={provider.name} className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{provider.name}</span>
                  <span className="text-xs text-muted-foreground">Connect using browser extension</span>
                </div>
              </div>
              
              {isConnecting && selectedProvider?.name === provider.name && (
                <Loader2 className="ml-auto h-5 w-5 animate-spin text-muted-foreground" />
              )}
            </Button>
          ))}
          
          {walletProviders.length === 0 && (
            <div className="text-center p-6 border border-polbid-light-gray/20 rounded-md">
              <p className="mb-2">No wallet extensions detected</p>
              <p className="text-sm text-muted-foreground mb-4">
                You need to install a blockchain wallet extension
              </p>
              <Button 
                size="sm"
                onClick={() => window.open('https://metamask.io/download', '_blank')}
              >
                Get a Wallet
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => navigate('/wallet-connect')} 
            className="w-full sm:w-auto"
          >
            Manual Connection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletDialog;
