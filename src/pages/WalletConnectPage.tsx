
import React from 'react';
import Layout from '@/components/layout/Layout';
import WalletConnect from '@/components/wallet/WalletConnect';

const WalletConnectPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 reveal">
            <h1 className="text-3xl font-bold text-gradient-green mb-2">
              Connect Your POL Wallet
            </h1>
            <p className="text-muted-foreground">
              Link your blockchain wallet to enable secure bidding with POL cryptocurrency
            </p>
          </div>
          <WalletConnect />
        </div>
      </div>
    </Layout>
  );
};

export default WalletConnectPage;
