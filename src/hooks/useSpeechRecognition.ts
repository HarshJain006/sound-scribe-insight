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
  const isListeningRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const isSupported = !!SpeechRecognition;

  const initRecognition = useCallback(() => {
    if (!SpeechRecognition) {
      return null;
    }

    const recognition = new SpeechRecognition();
    
    // Configuration for robust recognition using device's built-in transcriber
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || 'en-US'; // Use device language
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      retryCountRef.current = 0;
      console.log('Speech recognition started');
    };

    recognition.onend = () => {
      console.log('Speech recognition ended, isListeningRef:', isListeningRef.current);
      
      // Auto-restart if still meant to be listening
      if (isListeningRef.current && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        console.log(`Auto-restarting speech recognition (attempt ${retryCountRef.current})`);
        setTimeout(() => {
          if (isListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.log('Already started or error:', e);
            }
          }
        }, 100);
      } else {
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      switch (event.error) {
        case 'no-speech':
          // This is normal - just means silence was detected
          // Don't show error, recognition will auto-restart
          break;
        case 'audio-capture':
          setError('No microphone found. Please check your audio settings and allow microphone access.');
          setIsListening(false);
          isListeningRef.current = false;
          break;
        case 'not-allowed':
          setError('Microphone access denied. Please click the lock icon in your browser and allow microphone access, then try again.');
          setIsListening(false);
          isListeningRef.current = false;
          break;
        case 'network':
          // Network errors are common - try to recover silently
          console.log('Network error in speech recognition, will auto-restart');
          if (retryCountRef.current >= maxRetries) {
            setError('Network error. Speech recognition requires an internet connection. Please check your connection and try again.');
            setIsListening(false);
            isListeningRef.current = false;
          }
          break;
        case 'aborted':
          // User or system aborted - this is normal when stopping
          break;
        case 'service-not-allowed':
          setError('Speech recognition service is not available. Please try using Chrome or Edge browser.');
          setIsListening(false);
          isListeningRef.current = false;
          break;
        default:
          if (retryCountRef.current >= maxRetries) {
            setError(`Speech recognition error: ${event.error}. Please try again.`);
            setIsListening(false);
            isListeningRef.current = false;
          }
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

    return recognition;
  }, []);

  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari for the best experience.');
      return;
    }

    recognitionRef.current = initRecognition();

    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, [initRecognition]);

  const startListening = useCallback(() => {
    setError(null);
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    retryCountRef.current = 0;
    isListeningRef.current = true;

    // Re-initialize if needed
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }

    if (!recognitionRef.current) {
      setError('Speech recognition not available');
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (e: any) {
      if (e.name === 'InvalidStateError') {
        // Already started, stop and restart
        try {
          recognitionRef.current.stop();
        } catch (stopError) {
          // Ignore
        }
        setTimeout(() => {
          if (isListeningRef.current) {
            try {
              recognitionRef.current?.start();
            } catch (err) {
              setError('Failed to start speech recognition. Please refresh and try again.');
            }
          }
        }, 100);
      } else {
        setError('Failed to start speech recognition. Please ensure microphone access is allowed.');
      }
    }
  }, [initRecognition]);

  const stopListening = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
    }
    
    // Finalize transcript
    const finalText = finalTranscriptRef.current.trim();
    setTranscript(finalText);
    setInterimTranscript('');
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
