import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, Pause, AlertCircle, CheckCircle } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface SpeechRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
  disabled?: boolean;
}

const SpeechRecorder: React.FC<SpeechRecorderProps> = ({ 
  onTranscriptionComplete, 
  disabled = false 
}) => {
  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const handleToggleRecording = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        onTranscriptionComplete(transcript);
      }
    } else {
      resetTranscript();
      startListening();
    }
  };

  const displayText = transcript + (interimTranscript ? ' ' + interimTranscript : '');

  if (!isSupported) {
    return (
      <Card className="glass float shadow-medium border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Mic className="w-5 h-5 text-muted-foreground" />
            Speech Recording
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Speech recognition is not supported in this browser. 
              Please use Chrome, Edge, or Safari for the best experience.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-gradient-primary shadow-glow animate-pulse' 
              : 'bg-muted hover:bg-muted/80'
          }`}>
            <Button
              variant={isListening ? "secondary" : "ghost"}
              size="lg"
              onClick={handleToggleRecording}
              disabled={disabled}
              className="w-20 h-20 rounded-full"
            >
              {isListening ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
          </div>
        </div>
        
        {isListening && (
          <div className="text-center fade-in">
            <Badge variant="secondary" className="animate-pulse">
              🎙️ Listening... Speak now
            </Badge>
          </div>
        )}

        {displayText && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border/50 max-h-40 overflow-y-auto">
            <p className="text-sm text-foreground">
              {transcript}
              {interimTranscript && (
                <span className="text-muted-foreground italic"> {interimTranscript}</span>
              )}
            </p>
          </div>
        )}
        
        {transcript && !isListening && (
          <div className="text-center fade-in">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Recording ready for analysis
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeechRecorder;
