import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Lock } from 'lucide-react';
import CalendarView from '@/components/CalendarView';
import { useAuth } from '@/contexts/AuthContext';

interface CalendarTask {
  id: string;
  text: string;
  date: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

const Calendar = () => {
  const { user } = useAuth();

  const handleTaskSelect = (task: CalendarTask) => {
    console.log('Selected task:', task);
    // Handle task selection (could open a modal, navigate, etc.)
  };

  const handleDateSelect = (date: Date) => {
    console.log('Selected date:', date);
    // Handle date selection
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 safe-area-inset">
        <Card className="glass border-border/20 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 touch-manipulation">
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
                <Button className="w-full h-12 text-base touch-manipulation">Sign In</Button>
              </Link>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full h-12 text-base border-border/20 touch-manipulation">Create Account</Button>
              </Link>
            </div>
            <div className="text-center">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors touch-manipulation py-2">
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
    <div className="min-h-screen safe-area-inset" style={{ background: 'var(--gradient-background)' }}>
      <div className="container mx-auto px-4 py-4 pb-20 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors touch-manipulation py-2">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <h1 className="text-xl md:text-3xl font-bold gradient-text">Calendar</h1>
              </div>
            </div>
          </div>

          {/* Split-Screen Calendar Layout */}
          <CalendarView 
            onTaskSelect={handleTaskSelect}
            onDateSelect={handleDateSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;