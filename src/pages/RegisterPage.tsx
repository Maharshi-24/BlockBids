
import React from 'react';
import Layout from '@/components/layout/Layout';
import RegisterForm from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const RegisterPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent mb-2">
              Join PolBid
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create an account to start bidding with POL
            </p>
          </div>
          <Card className="border-none shadow-xl bg-white dark:bg-slate-900">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
              <CardDescription>
                Join PolBid and start winning auctions today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
