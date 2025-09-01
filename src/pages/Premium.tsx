import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Calendar, AudioLines, Database, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';

const Premium = () => {
  // TODO: BACKEND INTEGRATION - Replace with actual user subscription status
  const isSubscribed = false; // This should come from backend authentication

  const handleSubscribe = async () => {
    try {
      // TODO: BACKEND INTEGRATION - Implement Stripe checkout
      // const response = await fetch('/api/create-subscription', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priceId: 'price_xxx' })
      // });
      // const { url } = await response.json();
      // window.open(url, '_blank');
      
      console.log('Redirecting to payment gateway...');
      alert('Payment integration pending - Connect to backend service');
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const features = {
    free: [
      { text: '7 tasks per day', icon: <Calendar className="w-4 h-4" /> },
      { text: '3 audio transcriptions per day', icon: <AudioLines className="w-4 h-4" /> },
      { text: 'Data saved for 30 days', icon: <Database className="w-4 h-4" /> },
      { text: 'Basic calendar view', icon: <Calendar className="w-4 h-4" /> }
    ],
    premium: [
      { text: 'Unlimited tasks', icon: <CheckCircle className="w-4 h-4 text-success" /> },
      { text: 'Unlimited audio transcriptions', icon: <CheckCircle className="w-4 h-4 text-success" /> },
      { text: 'Unlimited data storage', icon: <CheckCircle className="w-4 h-4 text-success" /> },
      { text: 'Advanced analytics', icon: <CheckCircle className="w-4 h-4 text-success" /> },
      { text: 'Priority support', icon: <CheckCircle className="w-4 h-4 text-success" /> },
      { text: 'Export data', icon: <CheckCircle className="w-4 h-4 text-success" /> },
      { text: 'Dark mode', icon: <CheckCircle className="w-4 h-4 text-success" /> }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-heading font-bold gradient-text">
                LifeVibe Premium
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Unlock Your Full Potential</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Upgrade to <span className="gradient-text">Premium</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to all features and take your productivity to the next level
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Free Plan</span>
                <Badge variant="secondary">Current</Badge>
              </CardTitle>
              <div className="text-3xl font-bold">₹0<span className="text-base text-muted-foreground font-normal">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.free.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  {feature.icon}
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary shadow-glow">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                Most Popular
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Premium Plan</span>
                <Zap className="w-5 h-5 text-primary" />
              </CardTitle>
              <div className="text-3xl font-bold">
                ₹149<span className="text-base text-muted-foreground font-normal">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.premium.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  {feature.icon}
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
              <Button 
                className="w-full"
                onClick={handleSubscribe}
                disabled={isSubscribed}
              >
                {isSubscribed ? 'Already Subscribed' : 'Upgrade to Premium'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-heading font-bold text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {[
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period."
              },
              {
                q: "What happens to my data if I cancel?",
                a: "Your data will be preserved for 30 days after cancellation. You can reactivate your subscription to restore full access."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 7-day money-back guarantee if you're not satisfied with our premium features."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;