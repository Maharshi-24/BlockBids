
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-bidzone-purple mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! This page doesn't exist</p>
          <Button onClick={() => navigate('/')} className="bg-bidzone-purple hover:bg-bidzone-dark-purple">
            Return to Home
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
