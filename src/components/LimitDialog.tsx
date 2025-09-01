import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Calendar, AudioLines, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  limitType: 'tasks' | 'transcriptions';
  currentCount: number;
  maxCount: number;
}

const LimitDialog: React.FC<LimitDialogProps> = ({
  open,
  onOpenChange,
  limitType,
  currentCount,
  maxCount,
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate('/premium');
  };

  const getIcon = () => {
    return limitType === 'tasks' ? (
      <Calendar className="w-6 h-6 text-warning" />
    ) : (
      <AudioLines className="w-6 h-6 text-warning" />
    );
  };

  const getTitle = () => {
    return limitType === 'tasks' ? 'Daily Task Limit Reached' : 'Daily Transcription Limit Reached';
  };

  const getDescription = () => {
    const type = limitType === 'tasks' ? 'tasks' : 'audio transcriptions';
    return `You've reached your daily limit of ${maxCount} ${type}. Upgrade to Premium for unlimited access!`;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-warning/10 rounded-full">
              {getIcon()}
            </div>
          </div>
          <AlertDialogTitle className="text-xl font-heading">
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Usage Stats */}
        <div className="bg-muted/30 rounded-lg p-4 my-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Today's Usage</span>
            <Badge variant="outline">{currentCount} / {maxCount}</Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-warning h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentCount / maxCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Premium Benefits */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">Premium Benefits</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-success" />
              Unlimited {limitType === 'tasks' ? 'tasks' : 'transcriptions'}
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-success" />
              Unlimited data storage
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-success" />
              Advanced analytics & insights
            </li>
          </ul>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto">
            Try Tomorrow
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button 
              onClick={handleUpgrade}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade for ₹149/month
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LimitDialog;