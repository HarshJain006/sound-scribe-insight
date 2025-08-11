import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Lock } from 'lucide-react';

const Calendar = () => {
  // Mock user state - replace with actual auth state when Supabase is connected
  const isSignedIn = false;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
        <Card className="glass-effect border-white/10 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your calendar and daily activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <Link to="/signin" className="w-full">
                <Button className="w-full">Sign In</Button>
              </Link>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full border-white/20">Create Account</Button>
              </Link>
            </div>
            <div className="text-center">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold gradient-text">Calendar View</h1>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle>Your Daily Journey</CardTitle>
              <CardDescription>
                Track your daily reflections and insights over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6 + new Date().getDate();
                  const isToday = day === new Date().getDate();
                  const hasData = Math.random() > 0.7; // Mock data
                  
                  return (
                    <div
                      key={i}
                      className={`aspect-square p-2 rounded-lg border text-center text-sm cursor-pointer transition-all hover:scale-105 ${
                        isToday 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : hasData 
                            ? 'bg-accent/50 border-accent text-accent-foreground' 
                            : 'bg-muted/30 border-border/20 text-muted-foreground'
                      }`}
                    >
                      {day > 0 && day <= 31 ? day : ''}
                      {hasData && day > 0 && day <= 31 && (
                        <div className="w-1 h-1 bg-current rounded-full mx-auto mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded" />
                  <span className="text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded" />
                  <span className="text-muted-foreground">Has Activity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted rounded" />
                  <span className="text-muted-foreground">No Activity</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;