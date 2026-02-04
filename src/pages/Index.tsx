import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Mic, Upload, RotateCcw, Sparkles, TrendingUp, CheckCircle, Clock, MessageSquare, Plus, Save, Calendar, History, Crown, Database, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import TodoList from "@/components/TodoList";
import SpeechRecorder from "@/components/SpeechRecorder";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import UserMenu from "@/components/UserMenu";
import { extractTasksFromTranscription, ExtractedTask } from "@/utils/audioTaskExtractor";
import SignInPrompt from "@/components/SignInPrompt";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import LimitDialog from "@/components/LimitDialog";
import UsageIndicator from "@/components/UsageIndicator";
import MobileNav from "@/components/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import { TodoItem as SheetTodoItem, Note, AnalysisData } from "@/services/googleSheetsService";
import { format } from "date-fns";

const Index = () => {
  const { user } = useAuth();
  const { 
    isInitialized, 
    isLoading: sheetsLoading, 
    currentDayData,
    saveTodos,
    saveNotes,
    saveAnalysis,
  } = useGoogleSheets();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [transcriptionHistory, setTranscriptionHistory] = useState<string[]>([]);
  const [comments, setComments] = useState<Note[]>([]);
  const [newComment, setNewComment] = useState("");
  const [todos, setTodos] = useState<ExtractedTask[]>([]);
  const [currentTranscription, setCurrentTranscription] = useState("");
  const { toast } = useToast();

  // Usage limits and premium functionality
  const { canPerformAction, updateUsage, getRemainingCount } = useUsageLimits();
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [limitType, setLimitType] = useState<'tasks' | 'transcriptions'>('tasks');

  // Load data from sheets when initialized
  useEffect(() => {
    if (currentDayData) {
      // Convert sheet todos to local format
      const sheetTodos: ExtractedTask[] = currentDayData.todos.map(todo => ({
        id: todo.id,
        text: todo.text,
        date: new Date(todo.date),
        completed: todo.completed,
        priority: todo.priority,
        source: todo.source,
      }));
      setTodos(sheetTodos);
      setComments(currentDayData.notes);
      setTranscriptionHistory(currentDayData.transcriptions);
      if (currentDayData.analysis) {
        setAnalysis(currentDayData.analysis);
      }
    }
  }, [currentDayData]);

  // Auto-save todos to sheets
  useEffect(() => {
    if (user && isInitialized && todos.length > 0) {
      const today = new Date();
      const sheetTodos: SheetTodoItem[] = todos.map(todo => ({
        id: todo.id,
        text: todo.text,
        date: format(todo.date, 'yyyy-MM-dd'),
        completed: todo.completed,
        priority: todo.priority,
        source: todo.source,
        createdAt: new Date().toISOString(),
      }));
      saveTodos(today, sheetTodos);
    }
  }, [todos, user, isInitialized]);

  const handleTranscriptionComplete = (transcription: string) => {
    if (!canPerformAction('transcriptions')) {
      setLimitType('transcriptions');
      setShowLimitDialog(true);
      return;
    }
    setCurrentTranscription(transcription);
    toast({
      title: "Recording complete",
      description: "Ready for analysis!",
    });
  };

  const handleAnalyze = async () => {
    if (!currentTranscription) {
      toast({
        title: "No transcription found",
        description: "Please record your thoughts first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis (in real app, this would call an AI API)
    setTimeout(async () => {
      const mockAnalysis: AnalysisData = {
        workDone: "Completed important tasks based on your recording",
        progress: "Made progress on your goals",
        special: "Had meaningful insights",
        todos: ["Review tomorrow's priorities", "Follow up on key items"],
        efficiency: 85,
        efficiencyReason: "Stayed focused and productive",
        transcription: currentTranscription,
        feedback: "You're doing great! Keep up the momentum.",
        improvement: "Consider time-blocking for better focus"
      };
      
      setAnalysis(mockAnalysis);
      setTranscriptionHistory(prev => [...prev, currentTranscription]);
      
      // Extract tasks from transcription
      const extractedTasks = extractTasksFromTranscription(currentTranscription);
      
      // Check task limit before adding new tasks
      const tasksToAdd = extractedTasks.filter(task => 
        !todos.some(todo => todo.text.toLowerCase() === task.text.toLowerCase())
      );
      
      if (tasksToAdd.length > 0) {
        const remainingTaskSlots = getRemainingCount('tasks');
        
        if (remainingTaskSlots < tasksToAdd.length && remainingTaskSlots > 0) {
          const tasksWeCanAdd = tasksToAdd.slice(0, remainingTaskSlots);
          setTodos(prev => [...prev, ...tasksWeCanAdd]);
          updateUsage('tasks', tasksWeCanAdd.length);
          toast({
            title: "Task limit approaching!",
            description: `Added ${tasksWeCanAdd.length} tasks. Upgrade to Premium for unlimited tasks!`,
            variant: "destructive",
          });
        } else if (remainingTaskSlots === 0) {
          setLimitType('tasks');
          setShowLimitDialog(true);
        } else {
          setTodos(prev => [...prev, ...tasksToAdd]);
          updateUsage('tasks', tasksToAdd.length);
        }
      }

      // Save analysis to Google Sheets
      if (user && isInitialized) {
        await saveAnalysis(new Date(), mockAnalysis, currentTranscription);
      }

      updateUsage('transcriptions');
      setIsAnalyzing(false);
      setCurrentTranscription("");
      
      toast({
        title: "Analysis complete!",
        description: `Your day has been analyzed${tasksToAdd.length > 0 ? ` and ${Math.min(tasksToAdd.length, getRemainingCount('tasks') + tasksToAdd.length)} task(s) added` : ''}`,
      });
    }, 3000);
  };

  const handleSaveComment = async () => {
    if (newComment.trim()) {
      const comment: Note = {
        id: Date.now().toString(),
        text: newComment,
        createdAt: new Date().toISOString(),
      };
      
      const newComments = [comment, ...comments];
      setComments(newComments);
      setNewComment("");
      
      // Save to Google Sheets
      if (user && isInitialized) {
        await saveNotes(new Date(), newComments);
      }
      
      toast({
        title: "Note saved",
        description: user ? "Synced to your Google Sheet!" : "Saved locally",
      });
    }
  };

  const handleTodoToggle = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleTodoRemove = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const handleTodoAdd = (text: string, date: Date) => {
    if (!canPerformAction('tasks')) {
      setLimitType('tasks');
      setShowLimitDialog(true);
      return;
    }

    const newTodo: ExtractedTask = {
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      date,
      priority: 'medium',
      source: 'manual',
      completed: false
    };
    setTodos(prev => [...prev, newTodo]);
    updateUsage('tasks');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-background)' }}>
      {/* Limit Dialog */}
      <LimitDialog
        open={showLimitDialog}
        onOpenChange={setShowLimitDialog}
        limitType={limitType}
        currentCount={limitType === 'tasks' ? todos.filter(t => t.date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length : transcriptionHistory.length}
        maxCount={limitType === 'tasks' ? 7 : 3}
      />

      {/* Header with Navigation */}
      <header className="container mx-auto px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text">LifeVibe</h2>
          {user && isInitialized && (
            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
              <Database className="w-3 h-3 mr-1" />
              Synced
            </Badge>
          )}
          {user && sheetsLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link to="/calendar" className="hidden md:block">
            <Button variant="ghost" className="text-foreground hover:bg-muted text-sm">
              <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden lg:inline">Calendar</span>
            </Button>
          </Link>
          <Link to="/history" className="hidden md:block">
            <Button variant="ghost" className="text-foreground hover:bg-muted text-sm">
              <History className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden lg:inline">History</span>
            </Button>
          </Link>
          <Link to="/premium" className="hidden sm:block">
            <Button variant="ghost" className="text-primary hover:bg-primary/10 bg-primary/5 border border-primary/20 text-sm">
              <Crown className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">Premium</span>
            </Button>
          </Link>
          <Link to="/premium" className="sm:hidden">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 bg-primary/5 border border-primary/20">
              <Crown className="w-4 h-4" />
            </Button>
          </Link>
          <ThemeToggle />
          {user ? (
            <UserMenu />
          ) : (
            <>
              <div className="hidden lg:block">
                <GoogleSignInButton size="default" />
              </div>
              <div className="lg:hidden">
                <GoogleSignInButton size="sm" />
              </div>
            </>
          )}
          <MobileNav />
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            <span className="gradient-text">LifeVibe</span>
            <br />
            <span className="text-foreground">Insights</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Turn your daily moments into meaningful insights with AI-powered reflection
          </p>
          {!user && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">
                Sign in with Google to sync your data across devices
              </p>
              <GoogleSignInButton size="lg" variant="gradient" />
            </div>
          )}
        </div>

        {/* Main App Interface */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="record" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="record" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Record Audio
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Text Input
              </TabsTrigger>
            </TabsList>

            <TabsContent value="record" className="space-y-6">
              <SpeechRecorder 
                onTranscriptionComplete={handleTranscriptionComplete}
                disabled={isAnalyzing}
              />
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              {!user ? (
                <SignInPrompt 
                  title="Sign in to type your thoughts"
                  description="Sign in with Google to start journaling. Your data is privately stored in your own Google Drive."
                />
              ) : (
                <Card className="glass float shadow-medium border-white/20">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Type Your Thoughts
                    </CardTitle>
                    <CardDescription>
                      Write about your day, tasks, and reflections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="What did you accomplish today? What are your plans? Any meetings or deadlines coming up?"
                      value={currentTranscription}
                      onChange={(e) => setCurrentTranscription(e.target.value)}
                      className="min-h-32 bg-background/50 border-white/20"
                    />
                    {currentTranscription && (
                      <div className="mt-4 text-center fade-in">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ready for analysis
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Analysis Button */}
          <div className="text-center my-8">
            {!user ? (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">Sign in to analyze your day</p>
                <GoogleSignInButton size="lg" variant="gradient" />
              </div>
            ) : (
              <Button
                onClick={handleAnalyze}
                disabled={!currentTranscription || isAnalyzing}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Your Day...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze My Day
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6 fade-in">
              <Card className="glass shadow-strong border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Your Day Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-success flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Work Done
                      </h4>
                      <p className="text-muted-foreground">{analysis.workDone}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-primary flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Progress Made
                      </h4>
                      <p className="text-muted-foreground">{analysis.progress}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-warning flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Something Special
                    </h4>
                    <p className="text-muted-foreground">{analysis.special}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Tomorrow's Focus
                    </h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {analysis.todos.map((todo: string, index: number) => (
                        <li key={index}>{todo}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-secondary rounded-lg">
                    <span className="font-semibold">Daily Efficiency</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">{analysis.efficiency}%</span>
                      <Badge variant="secondary">{analysis.efficiencyReason}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass shadow-medium border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-success" />
                    Feedback for Tomorrow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <p className="text-success-foreground">{analysis.feedback}</p>
                  </div>
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <h5 className="font-semibold text-warning mb-2">Area for Improvement</h5>
                    <p className="text-warning-foreground">{analysis.improvement}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transcription History */}
          {transcriptionHistory.length > 0 && (
            <Card className="glass shadow-medium border-white/20 mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  Transcription History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
                  {transcriptionHistory.map((transcription, index) => (
                    <div
                      key={index}
                      className="p-4 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <p className="text-sm text-muted-foreground mb-1">
                        Session {index + 1}
                      </p>
                      <p>{transcription}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Smart To-Do List Section */}
          <div className="mt-8 space-y-6">
            {/* Usage Indicator */}
            <UsageIndicator />
            
            <TodoList 
              todos={todos}
              onToggle={handleTodoToggle}
              onRemove={handleTodoRemove}
              onAdd={handleTodoAdd}
            />
          </div>

          {/* Comments Section */}
          <Card className="glass float shadow-medium border-white/20 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-muted-foreground" />
                Quick Notes
              </CardTitle>
              <CardDescription>
                Save your thoughts and reminders {user ? '(synced to Google Sheets)' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a quick note or reminder..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-background/50 border-white/20 resize-none"
                  rows={3}
                />
                <Button 
                  onClick={handleSaveComment}
                  size="sm"
                  className="self-end"
                  disabled={!newComment.trim()}
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
              
              {comments.length > 0 && (
                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
