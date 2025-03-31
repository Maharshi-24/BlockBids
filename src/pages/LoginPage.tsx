
import React from 'react';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 reveal">
            <h1 className="text-3xl font-bold text-gradient-green mb-2">
              Welcome to PolBid
            </h1>
            <p className="text-muted-foreground">
              The blockchain-powered auction platform
            </p>
          </div>
          <Card className="polbid-card reveal">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
