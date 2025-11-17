import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

export function AuthModal({ open, onOpenChange }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetView, setIsResetView] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) throw error;
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your email for instructions to reset your password.',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let error;
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        error = signUpError;
        if (!error) {
           toast({
            title: 'Account created!',
            description: 'Please check your email to verify your account.',
          });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        error = signInError;
         if (!error) {
           toast({
            title: 'Welcome back!',
            description: 'You have successfully signed in.',
          });
        }
      }
      
      if (error) throw error;
      
      onOpenChange(false);
      setEmail('');
      setPassword('');

    } catch (error) {
      toast({
        title: 'Authentication Error',
        description: error.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setIsSignUp(false);
    setIsResetView(false);
    setEmail('');
    setPassword('');
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { onOpenChange(isOpen); if (!isOpen) resetState(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isResetView ? 'Reset Password' : isSignUp ? 'Create Account' : 'Sign In'}</DialogTitle>
          <DialogDescription>
            {isResetView ? 'Enter your email to receive a password reset link.' : isSignUp ? 'Enter your details to create a new account.' : 'Enter your credentials to access your AI Research Assistant.'}
          </DialogDescription>
        </DialogHeader>
        {isResetView ? (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {!isSignUp && (
              <div className="text-right">
                <Button variant="link" type="button" className="p-0 h-auto text-sm" onClick={() => setIsResetView(true)}>
                  Forgot password?
                </Button>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        )}
         <Button variant="link" onClick={() => { setIsSignUp(!isSignUp); setIsResetView(false); }} className="w-full">
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}