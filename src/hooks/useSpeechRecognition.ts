import { useState, useCallback, useRef } from 'react';

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
  const isListeningRef = useRef(false);
  
  const isSupported = !!SpeechRecognition;

  const createRecognition = useCallback(() => {
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    
    // Use device's built-in speech recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      console.log('🎤 Speech recognition ended');
      // Auto-restart if user is still holding/wants to record
      if (isListeningRef.current) {
        console.log('🎤 Auto-restarting...');
        setTimeout(() => {
          if (isListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // Ignore - might already be started
            }
          }
        }, 50);
      } else {
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('🎤 Speech recognition error:', event.error);
      
      switch (event.error) {
        case 'no-speech':
          // Normal - silence detected, will auto-restart
          break;
        case 'audio-capture':
          setError('Microphone not found. Please connect a microphone and try again.');
          isListeningRef.current = false;
          setIsListening(false);
          break;
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access in your browser settings.');
          isListeningRef.current = false;
          setIsListening(false);
          break;
        case 'network':
          // Chrome's speech recognition needs internet - show friendly message
          console.log('🎤 Network error - Chrome needs internet for speech recognition');
          // Don't stop - will auto-restart
          break;
        case 'aborted':
          // User stopped - normal
          break;
        case 'service-not-allowed':
          setError('Speech service not available. Try using Chrome or Edge browser.');
          isListeningRef.current = false;
          setIsListening(false);
          break;
        default:
          console.log('🎤 Unknown error:', event.error);
      }
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          final += text + ' ';
        } else {
          interim += text;
        }
      }

      if (final) {
        finalTranscriptRef.current += final;
        setTranscript(finalTranscriptRef.current.trim());
      }
      
      setInterimTranscript(interim);
    };

    return recognition;
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    setError(null);
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    isListeningRef.current = true;

    // Create fresh recognition instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore
      }
    }
    
    recognitionRef.current = createRecognition();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e: any) {
        console.error('🎤 Failed to start:', e);
        setError('Failed to start speech recognition. Please try again.');
        isListeningRef.current = false;
      }
    }
  }, [createRecognition]);

  const stopListening = useCallback(() => {
    console.log('🎤 Stopping...');
    isListeningRef.current = false;
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
    }
    
    setIsListening(false);
    setInterimTranscript('');
    
    // Finalize transcript
    const finalText = finalTranscriptRef.current.trim();
    if (finalText) {
      setTranscript(finalText);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    setError(null);
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
