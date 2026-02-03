import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Shield, Database, Sparkles } from 'lucide-react';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
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
          <p className="text-muted-foreground">Create your account to start your personal growth journey.</p>
        </div>

        {/* Sign Up Card */}
        <Card className="glass-effect border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Get Started</CardTitle>
            <CardDescription className="text-center">
              Sign in with Google to create your account instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign In Button */}
            <GoogleSignInButton className="w-full" size="lg" />
            
            {/* Benefits */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-sm font-semibold text-center mb-3">What you'll get:</h4>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI-powered daily insights & analysis</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Database className="h-4 w-4 text-primary" />
                <span>Private data stored in your Google Drive</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-success" />
                <span>You control your data, always</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Legal Links */}
        <div className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{' '}
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

export default Login;
