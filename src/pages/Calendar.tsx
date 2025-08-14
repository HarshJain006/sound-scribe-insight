import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Lock } from 'lucide-react';
import CalendarView from '@/components/CalendarView';
import { addDays, addWeeks } from 'date-fns';

interface CalendarTask {
  id: string;
  text: string;
  date: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

const Calendar = () => {
  // Mock user state - replace with actual auth state when Supabase is connected
  const isSignedIn = true;
  
  // Mock tasks data - in real app, this would come from Supabase
  const [tasks, setTasks] = useState<CalendarTask[]>([
    {
      id: '1',
      text: 'Team meeting with stakeholders',
      date: new Date(),
      completed: false,
      priority: 'high'
    },
    {
      id: '2', 
      text: 'Review presentation slides',
      date: addDays(new Date(), 1),
      completed: false,
      priority: 'medium'
    },
    {
      id: '3',
      text: 'Follow up on client feedback',
      date: addDays(new Date(), 2),
      completed: true,
      priority: 'high'
    },
    {
      id: '4',
      text: 'Plan weekend project',
      date: addWeeks(new Date(), 1),
      completed: false,
      priority: 'low'
    }
  ]);

  const handleTaskSelect = (task: CalendarTask) => {
    console.log('Selected task:', task);
    // Handle task selection (could open a modal, navigate, etc.)
  };

  const handleDateSelect = (date: Date) => {
    console.log('Selected date:', date);
    // Handle date selection
  };

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
    <div className="min-h-screen" style={{ background: 'var(--gradient-background)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold gradient-text">Smart Calendar</h1>
              </div>
            </div>
          </div>

          {/* Split-Screen Calendar Layout */}
          <CalendarView 
            tasks={tasks}
            onTaskSelect={handleTaskSelect}
            onDateSelect={handleDateSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;