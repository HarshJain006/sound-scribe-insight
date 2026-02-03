import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { googleSheetsService, DayData, TodoItem, Note, AnalysisData } from '@/services/googleSheetsService';
import { format } from 'date-fns';

interface UseGoogleSheetsResult {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  currentDayData: DayData | null;
  daysWithData: string[];
  initializeSheet: () => Promise<void>;
  loadDayData: (date: Date) => Promise<DayData | null>;
  saveTodos: (date: Date, todos: TodoItem[]) => Promise<boolean>;
  saveNotes: (date: Date, notes: Note[]) => Promise<boolean>;
  saveAnalysis: (date: Date, analysis: AnalysisData, transcription: string) => Promise<boolean>;
  saveMood: (date: Date, mood: string, efficiency: number) => Promise<boolean>;
  refreshDaysWithData: () => Promise<void>;
}

export const useGoogleSheets = (): UseGoogleSheetsResult => {
  const { user, updateUser, isGapiReady } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDayData, setCurrentDayData] = useState<DayData | null>(null);
  const [daysWithData, setDaysWithData] = useState<string[]>([]);

  const initializeSheet = useCallback(async () => {
    if (!user?.accessToken || !isGapiReady) {
      setError('Not authenticated or Google API not ready');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sheetId = await googleSheetsService.initializeSheet(
        user.accessToken,
        user.sheetId
      );

      if (sheetId && sheetId !== user.sheetId) {
        updateUser({ sheetId });
      }

      setIsInitialized(true);

      // Load days with data
      const dates = await googleSheetsService.getAllDaysWithData();
      setDaysWithData(dates);

      // Load today's data
      const today = new Date();
      const todayData = await googleSheetsService.getDayData(today);
      setCurrentDayData(todayData);
    } catch (err: any) {
      console.error('Error initializing sheet:', err);
      setError(err.message || 'Failed to initialize Google Sheet');
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUser, isGapiReady]);

  // Auto-initialize when user signs in
  useEffect(() => {
    if (user?.accessToken && isGapiReady && !isInitialized && !isLoading) {
      initializeSheet();
    }
  }, [user, isGapiReady, isInitialized, isLoading, initializeSheet]);

  const loadDayData = useCallback(async (date: Date): Promise<DayData | null> => {
    if (!isInitialized) {
      return null;
    }

    setIsLoading(true);
    try {
      const data = await googleSheetsService.getDayData(date);
      if (format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
        setCurrentDayData(data);
      }
      return data;
    } catch (err: any) {
      console.error('Error loading day data:', err);
      setError(err.message || 'Failed to load day data');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const saveTodos = useCallback(async (date: Date, todos: TodoItem[]): Promise<boolean> => {
    if (!isInitialized) {
      return false;
    }

    try {
      const success = await googleSheetsService.saveDayData(date, { todos });
      if (success && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
        setCurrentDayData(prev => prev ? { ...prev, todos } : null);
      }
      
      // Update days with data
      const dateString = format(date, 'yyyy-MM-dd');
      if (!daysWithData.includes(dateString)) {
        setDaysWithData(prev => [...prev, dateString]);
      }
      
      return success;
    } catch (err: any) {
      console.error('Error saving todos:', err);
      setError(err.message || 'Failed to save todos');
      return false;
    }
  }, [isInitialized, daysWithData]);

  const saveNotes = useCallback(async (date: Date, notes: Note[]): Promise<boolean> => {
    if (!isInitialized) {
      return false;
    }

    try {
      const success = await googleSheetsService.saveDayData(date, { notes });
      if (success && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
        setCurrentDayData(prev => prev ? { ...prev, notes } : null);
      }
      
      // Update days with data
      const dateString = format(date, 'yyyy-MM-dd');
      if (!daysWithData.includes(dateString)) {
        setDaysWithData(prev => [...prev, dateString]);
      }
      
      return success;
    } catch (err: any) {
      console.error('Error saving notes:', err);
      setError(err.message || 'Failed to save notes');
      return false;
    }
  }, [isInitialized, daysWithData]);

  const saveAnalysis = useCallback(async (
    date: Date, 
    analysis: AnalysisData, 
    transcription: string
  ): Promise<boolean> => {
    if (!isInitialized) {
      return false;
    }

    try {
      // Get existing transcriptions
      const existingData = await googleSheetsService.getDayData(date);
      const existingTranscriptions = existingData?.transcriptions || [];
      
      const success = await googleSheetsService.saveDayData(date, { 
        analysis,
        efficiency: analysis.efficiency,
        transcriptions: [...existingTranscriptions, transcription],
      });
      
      if (success && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
        setCurrentDayData(prev => prev ? { 
          ...prev, 
          analysis, 
          efficiency: analysis.efficiency,
          transcriptions: [...existingTranscriptions, transcription],
        } : null);
      }
      
      // Update days with data
      const dateString = format(date, 'yyyy-MM-dd');
      if (!daysWithData.includes(dateString)) {
        setDaysWithData(prev => [...prev, dateString]);
      }
      
      return success;
    } catch (err: any) {
      console.error('Error saving analysis:', err);
      setError(err.message || 'Failed to save analysis');
      return false;
    }
  }, [isInitialized, daysWithData]);

  const saveMood = useCallback(async (date: Date, mood: string, efficiency: number): Promise<boolean> => {
    if (!isInitialized) {
      return false;
    }

    try {
      const success = await googleSheetsService.saveDayData(date, { mood, efficiency });
      if (success && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
        setCurrentDayData(prev => prev ? { ...prev, mood, efficiency } : null);
      }
      return success;
    } catch (err: any) {
      console.error('Error saving mood:', err);
      setError(err.message || 'Failed to save mood');
      return false;
    }
  }, [isInitialized]);

  const refreshDaysWithData = useCallback(async () => {
    if (!isInitialized) {
      return;
    }

    try {
      const dates = await googleSheetsService.getAllDaysWithData();
      setDaysWithData(dates);
    } catch (err: any) {
      console.error('Error refreshing days:', err);
    }
  }, [isInitialized]);

  return {
    isInitialized,
    isLoading,
    error,
    currentDayData,
    daysWithData,
    initializeSheet,
    loadDayData,
    saveTodos,
    saveNotes,
    saveAnalysis,
    saveMood,
    refreshDaysWithData,
  };
};
