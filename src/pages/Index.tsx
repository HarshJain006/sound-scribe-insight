import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Mic, Upload, Play, Pause, RotateCcw, Sparkles, TrendingUp, CheckCircle, Clock, MessageSquare, Plus, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [transcriptionHistory, setTranscriptionHistory] = useState<string[]>([]);
  const [comments, setComments] = useState<{id: string, text: string, date: string}[]>([]);
  const [newComment, setNewComment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording started",
      description: "Share your thoughts about your day...",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Simulate recorded audio
    setRecordedAudio("data:audio/wav;base64,simulated");
    toast({
      title: "Recording complete",
      description: "Ready for analysis!",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRecordedAudio(url);
      toast({
        title: "File uploaded",
        description: `${file.name} is ready for analysis`,
      });
    }
  };

  const handleAnalyze = () => {
    if (!recordedAudio) {
      toast({
        title: "No audio found",
        description: "Please record or upload audio first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      const mockAnalysis = {
        workDone: "Completed 3 important tasks, attended 2 meetings",
        progress: "Made significant progress on the main project",
        special: "Had a breakthrough moment with the design concept",
        todos: ["Review tomorrow's presentation", "Follow up on client feedback", "Plan weekend project"],
        efficiency: 85,
        efficiencyReason: "Stayed focused and minimized distractions",
        transcription: "Today was a productive day. I managed to complete most of my tasks and had some great insights.",
        feedback: "You're doing amazing! 🌟 Your focus today was impressive. Tomorrow, try taking short breaks to maintain that energy level.",
        improvement: "Consider time-blocking your schedule for even better productivity"
      };
      
      setAnalysis(mockAnalysis);
      setTranscriptionHistory(prev => [...prev, mockAnalysis.transcription]);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete!",
        description: "Your day has been analyzed with insights",
      });
    }, 3000);
  };

  const handleSaveComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment,
        date: new Date().toLocaleDateString()
      };
      setComments(prev => [comment, ...prev]);
      setNewComment("");
      toast({
        title: "Comment saved",
        description: "Your note has been saved successfully!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header with Navigation */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold gradient-text">LifeVibe</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/signin">
            <Button variant="ghost" className="text-foreground hover:bg-muted">
              Sign In
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-gradient-primary hover:shadow-glow">
              Get Started
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-primary text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-glow">
            <Sparkles className="w-4 h-4" />
            AI-Powered Daily Insights
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            <span className="gradient-text">LifeVibe</span>
            <br />
            <span className="text-foreground">Insights</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Turn your daily moments into meaningful insights with AI-powered reflection
          </p>
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
                Upload File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="record" className="space-y-6">
              <Card className="glass float shadow-medium border-white/20">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Mic className="w-5 h-5 text-primary" />
                    Record Your Day
                  </CardTitle>
                  <CardDescription>
                    Share your thoughts, achievements, and reflections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRecording 
                        ? 'bg-gradient-primary shadow-glow animate-pulse' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}>
                      <Button
                        variant={isRecording ? "secondary" : "ghost"}
                        size="lg"
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        className="w-20 h-20 rounded-full"
                      >
                        {isRecording ? (
                          <Pause className="w-8 h-8" />
                        ) : (
                          <Mic className="w-8 h-8" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {isRecording && (
                    <div className="text-center fade-in">
                      <Badge variant="secondary" className="animate-pulse">
                        Recording in progress...
                      </Badge>
                    </div>
                  )}
                  
                  {recordedAudio && !isRecording && (
                    <div className="text-center fade-in">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Audio ready for analysis
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card className="glass float shadow-medium border-white/20">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload Audio File
                  </CardTitle>
                  <CardDescription>
                    Choose a WAV or MP3 file from your device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Drop your audio file here or click to browse</p>
                    <p className="text-sm text-muted-foreground">Supports WAV and MP3 files</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".wav,.mp3"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  
                  {recordedAudio && (
                    <div className="mt-4 text-center fade-in">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        File uploaded successfully
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Analysis Button */}
          <div className="text-center my-8">
            <Button
              onClick={handleAnalyze}
              disabled={!recordedAudio || isAnalyzing}
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

          {/* Comments Section */}
          <Card className="glass float shadow-medium border-white/20 mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-muted-foreground" />
                Quick Notes
              </CardTitle>
              <CardDescription>
                Save your thoughts and reminders
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
                        <span className="text-xs text-muted-foreground">{comment.date}</span>
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