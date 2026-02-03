import { useState, useEffect, useCallback, useRef } from 'react';

// Check if browser supports speech recognition
const SpeechRecognition = typeof window !== 'undefined' 
  ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition 
  : null;

interface UseSpeechRecognitionResult {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useSpeechRecognition = (): UseSpeechRecognitionResult => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');
  const isSupported = !!SpeechRecognition;

  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Configuration for robust recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if still meant to be listening
      if (recognitionRef.current?.shouldContinue) {
        try {
          recognition.start();
        } catch (e) {
          // Already started
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      switch (event.error) {
        case 'no-speech':
          // Don't show error, just continue listening
          break;
        case 'audio-capture':
          setError('No microphone found. Please check your audio settings.');
          setIsListening(false);
          break;
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access.');
          setIsListening(false);
          break;
        case 'network':
          setError('Network error. Please check your connection.');
          // Try to restart
          setTimeout(() => {
            if (recognitionRef.current?.shouldContinue) {
              try {
                recognition.start();
              } catch (e) {
                // Already started
              }
            }
          }, 1000);
          break;
        case 'aborted':
          // User or system aborted, no error message needed
          break;
        default:
          setError(`Recognition error: ${event.error}`);
      }
    };

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;

        if (result.isFinal) {
          finalText += transcriptText + ' ';
        } else {
          interimText += transcriptText;
        }
      }

      if (finalText) {
        finalTranscriptRef.current += finalText;
        setTranscript(finalTranscriptRef.current.trim());
      }
      
      setInterimTranscript(interimText);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.shouldContinue = false;
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition not initialized');
      return;
    }

    setError(null);
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    recognitionRef.current.shouldContinue = true;

    try {
      recognitionRef.current.start();
    } catch (e: any) {
      if (e.name === 'InvalidStateError') {
        // Already started, stop and restart
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (err) {
            setError('Failed to start recognition');
          }
        }, 100);
      } else {
        setError('Failed to start speech recognition');
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.shouldContinue = false;
      recognitionRef.current.stop();
      setIsListening(false);
      
      // Finalize transcript
      const finalText = finalTranscriptRef.current.trim();
      setTranscript(finalText);
      setInterimTranscript('');
    }
  }, []);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};
