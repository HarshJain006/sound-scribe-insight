import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft, History as HistoryIcon, Lock, Calendar, MessageSquare, TrendingUp } from 'lucide-react';

const History = () => {
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
              Please sign in to view your history and track your growth
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

  // Mock data for when user is signed in
  const mockHistory = [
    {
      date: "2024-01-15",
      transcription: "Had a productive day at work, completed the project proposal and had a great team meeting.",
      analysis: "High productivity day with strong team collaboration",
      efficiency: 92,
      todos: ["Review client feedback", "Prepare presentation", "Team one-on-one meetings"]
    },
    {
      date: "2024-01-14", 
      transcription: "Spent time learning new coding techniques and worked on personal projects.",
      analysis: "Focused on skill development and personal growth",
      efficiency: 78,
      todos: ["Continue React tutorial", "Update portfolio", "Plan weekend activities"]
    },
    {
      date: "2024-01-13",
      transcription: "Relaxing weekend with family, went for a hike and had dinner together.",
      analysis: "Great work-life balance with quality family time",
      efficiency: 85,
      todos: ["Plan next week", "Grocery shopping", "Call old friends"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
              <div className="flex items-center gap-2">
                <HistoryIcon className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold gradient-text">Your Journey</h1>
              </div>
            </div>
            <Link to="/calendar">
              <Button variant="outline" className="border-white/20">
                <Calendar className="w-4 h-4 mr-2" />
                Calendar View
              </Button>
            </Link>
          </div>

          {/* Growth Overview */}
          <Card className="glass-effect border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Growth Overview
              </CardTitle>
              <CardDescription>Your progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">15</div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">85%</div>
                  <div className="text-sm text-muted-foreground">Avg Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">7</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History Timeline */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Recent Activities</h2>
            {mockHistory.map((entry, index) => (
              <Card key={index} className="glass-effect border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      {entry.efficiency}% Efficiency
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="flex items-center gap-2 font-medium mb-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      Daily Reflection
                    </h4>
                    <p className="text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      {entry.transcription}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">AI Analysis</h4>
                    <p className="text-accent bg-accent/10 p-3 rounded-lg">
                      {entry.analysis}
                    </p>
                  </div>

                  {entry.todos.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Generated Todos</h4>
                      <div className="space-y-1">
                        {entry.todos.map((todo, todoIndex) => (
                          <div key={todoIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span className="text-muted-foreground">{todo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;