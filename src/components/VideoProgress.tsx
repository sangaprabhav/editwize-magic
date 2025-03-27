
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2, XCircle, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface VideoProgressProps {
  status: 'Uploading' | 'Processing' | 'Analyzing' | 'Completed' | 'Error';
  progress?: number; // 0-100
  message?: string;
  onCancel?: () => void;
  onRetry?: () => void;
}

const VideoProgress: React.FC<VideoProgressProps> = ({ 
  status, 
  progress = 0, 
  message,
  onCancel,
  onRetry
}) => {
  // Default messages based on status
  const defaultMessages = {
    Uploading: 'Uploading your video...',
    Processing: 'Processing your video with GPT-4o...',
    Analyzing: 'GPT-4o is analyzing your video content...',
    Completed: 'GPT-4o processing complete!',
    Error: 'An error occurred during GPT-4o processing'
  };

  // Use provided message or fall back to default
  const displayMessage = message || defaultMessages[status];
  
  // Determine if we should show indeterminate progress (spinner)
  const isIndeterminate = status === 'Analyzing' || progress === 0;
  
  // Calculate status completion percentage for the visual indicator
  const statusCompletion = {
    Uploading: 25,
    Processing: 50,
    Analyzing: 75,
    Completed: 100,
    Error: 100
  };
  
  return (
    <div className="w-full bg-muted/20 rounded-xl p-6 text-center">
      {/* Status indicator */}
      <div className="flex justify-between mb-2 text-sm font-medium">
        <div className={`flex items-center gap-2 ${status === 'Error' ? 'text-destructive' : status === 'Completed' ? 'text-green-500' : 'text-primary'}`}>
          {status === 'Completed' ? (
            <CheckCircle className="w-4 h-4" />
          ) : status === 'Error' ? (
            <XCircle className="w-4 h-4" />
          ) : (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          <span>{status}</span>
        </div>
        
        {!isIndeterminate && status !== 'Completed' && status !== 'Error' && (
          <span>{progress}%</span>
        )}
      </div>
      
      {/* Progress bar */}
      <Progress 
        value={isIndeterminate ? statusCompletion[status] : progress}
        className={`h-2 mb-4 ${status === 'Error' ? 'bg-destructive/20' : status === 'Completed' ? 'bg-green-500/20' : ''}`}
      />
      
      {/* Message */}
      <p className="text-sm text-muted-foreground mb-4">
        {displayMessage}
      </p>
      
      {/* Action buttons */}
      <div className="flex justify-center gap-3">
        {(status === 'Uploading' || status === 'Processing' || status === 'Analyzing') && onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        
        {status === 'Error' && onRetry && (
          <Button variant="default" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoProgress;
