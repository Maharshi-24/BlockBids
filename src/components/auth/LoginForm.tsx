import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useBidContext } from '@/context/BidContext';
import { toast } from 'sonner';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useBidContext();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate login process
    setTimeout(() => {
      login();
      toast.success('Login successful!');
      navigate('/');
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Login to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="john@example.com"
              className="w-full bg-[#0D0D13] border-gray-700 focus:border-[#8B5CF6] text-sm text-white placeholder:text-gray-500 rounded-md px-4 py-3 [&:-webkit-autofill]:!bg-[#0D0D13] [&:-webkit-autofill]:!text-white [&:-webkit-autofill]:!shadow-[0_0_0_30px_#0D0D13_inset] [&:-webkit-autofill]:!-webkit-text-fill-color-[#ffffff]"
              style={{ WebkitTextFillColor: 'white' }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#0D0D13] border-gray-700 focus:border-[#8B5CF6] text-sm text-white placeholder:text-gray-500 rounded-md px-4 py-3 [&:-webkit-autofill]:bg-[#0D0D13] [&:-webkit-autofill]:text-white [&:-webkit-autofill]:shadow-[0_0_0_30px_#0D0D13_inset] [&:-webkit-autofill]:[background-clip:content-box_!important]"
            />
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-bidzone-purple hover:underline"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </button>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-bidzone-purple hover:underline font-medium"
            onClick={() => navigate('/register')}
          >
            Create account
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
