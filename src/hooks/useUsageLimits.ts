import { useState, useEffect } from 'react';

interface UsageData {
  date: string;
  tasks: number;
  transcriptions: number;
}

interface UsageLimits {
  tasksPerDay: number;
  transcriptionsPerDay: number;
  dataRetentionDays: number;
}

interface UserSubscription {
  isPremium: boolean;
  subscriptionEnd?: Date;
}

export const useUsageLimits = () => {
  // TODO: BACKEND INTEGRATION - Replace with actual user subscription status
  const [subscription, setSubscription] = useState<UserSubscription>({
    isPremium: false, // This should come from backend authentication
  });

  const [usage, setUsage] = useState<UsageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Define limits based on subscription
  const limits: UsageLimits = subscription.isPremium 
    ? {
        tasksPerDay: Infinity,
        transcriptionsPerDay: Infinity,
        dataRetentionDays: Infinity,
      }
    : {
        tasksPerDay: 7,
        transcriptionsPerDay: 3,
        dataRetentionDays: 30,
      };

  // Get today's date string
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Load usage data from localStorage
  useEffect(() => {
    const loadUsageData = () => {
      try {
        const stored = localStorage.getItem('lifevibe_usage');
        const parsedUsage = stored ? JSON.parse(stored) : [];
        
        // Clean old data based on retention policy
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - limits.dataRetentionDays);
        
        const filteredUsage = parsedUsage.filter((item: UsageData) => {
          return new Date(item.date) >= cutoffDate;
        });
        
        setUsage(filteredUsage);
        
        // Save cleaned data back
        localStorage.setItem('lifevibe_usage', JSON.stringify(filteredUsage));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading usage data:', error);
        setUsage([]);
        setIsLoading(false);
      }
    };

    // TODO: BACKEND INTEGRATION - Load user subscription status
    const loadSubscriptionStatus = async () => {
      try {
        // const response = await fetch('/api/user/subscription');
        // const subscriptionData = await response.json();
        // setSubscription(subscriptionData);
        console.log('Loading subscription status from backend...');
      } catch (error) {
        console.error('Error loading subscription:', error);
      }
    };

    loadUsageData();
    loadSubscriptionStatus();
  }, [limits.dataRetentionDays]);

  // Get today's usage
  const getTodayUsage = (): UsageData => {
    const today = getTodayString();
    const todayUsage = usage.find(u => u.date === today);
    return todayUsage || { date: today, tasks: 0, transcriptions: 0 };
  };

  // Update usage
  const updateUsage = (type: 'tasks' | 'transcriptions', increment: number = 1) => {
    const today = getTodayString();
    const newUsage = [...usage];
    const todayIndex = newUsage.findIndex(u => u.date === today);
    
    if (todayIndex >= 0) {
      newUsage[todayIndex] = {
        ...newUsage[todayIndex],
        [type]: newUsage[todayIndex][type] + increment,
      };
    } else {
      newUsage.push({
        date: today,
        tasks: type === 'tasks' ? increment : 0,
        transcriptions: type === 'transcriptions' ? increment : 0,
      });
    }
    
    setUsage(newUsage);
    localStorage.setItem('lifevibe_usage', JSON.stringify(newUsage));

    // TODO: BACKEND INTEGRATION - Sync usage to server
    // syncUsageToServer(newUsage);
  };

  // Check if user can perform action
  const canPerformAction = (type: 'tasks' | 'transcriptions'): boolean => {
    if (subscription.isPremium) return true;
    
    const todayUsage = getTodayUsage();
    const limit = type === 'tasks' ? limits.tasksPerDay : limits.transcriptionsPerDay;
    const current = type === 'tasks' ? todayUsage.tasks : todayUsage.transcriptions;
    
    return current < limit;
  };

  // Get remaining count for the day
  const getRemainingCount = (type: 'tasks' | 'transcriptions'): number => {
    if (subscription.isPremium) return Infinity;
    
    const todayUsage = getTodayUsage();
    const limit = type === 'tasks' ? limits.tasksPerDay : limits.transcriptionsPerDay;
    const current = type === 'tasks' ? todayUsage.tasks : todayUsage.transcriptions;
    
    return Math.max(0, limit - current);
  };

  // TODO: BACKEND INTEGRATION - Sync usage to server
  const syncUsageToServer = async (usageData: UsageData[]) => {
    try {
      // await fetch('/api/user/usage', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ usage: usageData }),
      // });
      console.log('Syncing usage to server:', usageData);
    } catch (error) {
      console.error('Error syncing usage:', error);
    }
  };

  return {
    subscription,
    limits,
    usage: getTodayUsage(),
    canPerformAction,
    getRemainingCount,
    updateUsage,
    isLoading,
  };
};