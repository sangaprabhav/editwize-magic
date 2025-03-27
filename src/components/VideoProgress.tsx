
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2 } from 'lucide-react';

interface VideoProgressProps {
  status: 'Uploading' | 'Processing' | 'Analyzing' | 'Completed' | 'Error';
  progress?: number; // 0-100
  message?: string;
}

const VideoProgress: React.FC<VideoProgressProps> = ({ 
  status, 
  progress = 0, 
  message 
}) => {
  // Default messages based on status
  const defaultMessages = {
    Uploading: 'Uploading your video...',
    Processing: 'Processing your video with AI...',
    Analyzing: 'Analyzing video content...',
    Completed: 'Processing complete!',
    Error: 'An error occurred during processing'
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
        <div className={`flex items-center gap-2 ${status === 'Error' ? 'text-destructive' : 'text-primary'}`}>
          {status !== 'Completed' && status !== 'Error' && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          <span>{status}</span>
        </div>
        
        {!isIndeterminate && (
          <span>{progress}%</span>
        )}
      </div>
      
      {/* Progress bar */}
      <Progress 
        value={isIndeterminate ? statusCompletion[status] : progress}
        className={`h-2 mb-4 ${status === 'Error' ? 'bg-destructive/20' : ''}`}
      />
      
      {/* Message */}
      <p className="text-sm text-muted-foreground">
        {displayMessage}
      </p>
    </div>
  );
};

export default VideoProgress;
