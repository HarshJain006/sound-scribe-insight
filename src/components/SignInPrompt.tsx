import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import GoogleSignInButton from './GoogleSignInButton';

interface SignInPromptProps {
  title?: string;
  description?: string;
}

const SignInPrompt: React.FC<SignInPromptProps> = ({
  title = "Sign in to continue",
  description = "Please sign in with your Google account to use this feature. Your data will be securely stored in your own Google Drive."
}) => {
  return (
    <Card className="glass float shadow-medium border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription className="max-w-md mx-auto">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <GoogleSignInButton size="lg" variant="gradient" />
        <p className="text-xs text-muted-foreground text-center max-w-sm">
          We use Google OAuth for secure authentication. Your audio is never stored - only the transcribed text is saved to your private Google Sheet.
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInPrompt;
