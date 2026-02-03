import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Shield, Database } from 'lucide-react';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const SignIn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already signed in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home Button */}
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold gradient-text">LifeVibe Insights</h1>
          </div>
          <p className="text-muted-foreground">Welcome back! Sign in to continue your journey.</p>
        </div>

        {/* Sign In Card */}
        <Card className="glass-effect border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Sign in with Google to access your personalized insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign In Button */}
            <GoogleSignInButton className="w-full" size="lg" />
            
            {/* Features */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Database className="h-4 w-4 text-primary" />
                <span>Your data is stored in your own Google Drive</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-success" />
                <span>Secure authentication with Google OAuth</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <span className="text-primary">
                Just sign in with Google to get started!
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Legal Links */}
        <div className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
          <Link to="/terms-of-service" className="text-primary hover:underline">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link to="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
