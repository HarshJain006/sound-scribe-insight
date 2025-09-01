import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, AudioLines, Crown, AlertTriangle } from 'lucide-react';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import { useNavigate } from 'react-router-dom';

const UsageIndicator: React.FC = () => {
  const { subscription, usage, limits, getRemainingCount } = useUsageLimits();
  const navigate = useNavigate();

  if (subscription.isPremium) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Premium Active</span>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              Unlimited
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tasksRemaining = getRemainingCount('tasks');
  const transcriptionsRemaining = getRemainingCount('transcriptions');
  const tasksUsagePercent = (usage.tasks / limits.tasksPerDay) * 100;
  const transcriptionsUsagePercent = (usage.transcriptions / limits.transcriptionsPerDay) * 100;

  const isTasksLimitNear = tasksUsagePercent >= 70;
  const isTranscriptionsLimitNear = transcriptionsUsagePercent >= 70;
  const showUpgradePrompt = isTasksLimitNear || isTranscriptionsLimitNear;

  return (
    <Card className={`${showUpgradePrompt ? 'border-warning/50 bg-warning/5' : ''}`}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Daily Usage</h3>
          {showUpgradePrompt && (
            <div className="flex items-center gap-1 text-warning">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">Limit approaching</span>
            </div>
          )}
        </div>

        {/* Tasks Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Tasks</span>
            </div>
            <Badge variant={tasksRemaining === 0 ? 'destructive' : tasksRemaining <= 2 ? 'secondary' : 'outline'}>
              {usage.tasks} / {limits.tasksPerDay}
            </Badge>
          </div>
          <Progress 
            value={tasksUsagePercent} 
            className={`h-2 ${tasksUsagePercent >= 100 ? 'progress-full' : tasksUsagePercent >= 70 ? 'progress-warning' : ''}`}
          />
          <p className="text-xs text-muted-foreground">
            {tasksRemaining > 0 ? `${tasksRemaining} tasks remaining` : 'Daily limit reached'}
          </p>
        </div>

        {/* Transcriptions Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AudioLines className="w-4 h-4" />
              <span>Audio Transcriptions</span>
            </div>
            <Badge variant={transcriptionsRemaining === 0 ? 'destructive' : transcriptionsRemaining <= 1 ? 'secondary' : 'outline'}>
              {usage.transcriptions} / {limits.transcriptionsPerDay}
            </Badge>
          </div>
          <Progress 
            value={transcriptionsUsagePercent} 
            className={`h-2 ${transcriptionsUsagePercent >= 100 ? 'progress-full' : transcriptionsUsagePercent >= 70 ? 'progress-warning' : ''}`}
          />
          <p className="text-xs text-muted-foreground">
            {transcriptionsRemaining > 0 ? `${transcriptionsRemaining} transcriptions remaining` : 'Daily limit reached'}
          </p>
        </div>

        {/* Upgrade Prompt */}
        {showUpgradePrompt && (
          <div className="pt-3 border-t border-muted">
            <Button 
              onClick={() => navigate('/premium')} 
              size="sm" 
              className="w-full"
              variant="default"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium - ₹149/month
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageIndicator;