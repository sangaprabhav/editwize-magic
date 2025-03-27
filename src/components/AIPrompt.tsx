
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Send, Trash } from 'lucide-react';

interface AIPromptProps {
  onSubmit: (prompt: string) => void;
  isProcessing?: boolean;
  className?: string;
  placeholder?: string;
  history?: Array<{ prompt: string; timestamp: Date }>;
  onHistoryClear?: () => void;
}

const AIPrompt: React.FC<AIPromptProps> = ({
  onSubmit,
  isProcessing = false,
  className,
  placeholder = "Describe the edits you'd like to make...",
  history = [],
  onHistoryClear
}) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (prompt.trim() && !isProcessing) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleHistoryItemClick = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Previous prompts history */}
      {history.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Previous Prompts</h3>
            {onHistoryClear && (
              <button
                onClick={onHistoryClear}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                aria-label="Clear history"
              >
                <Trash size={12} />
                <span>Clear</span>
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryItemClick(item.prompt)}
                className="text-xs bg-secondary/50 hover:bg-secondary text-foreground px-3 py-1 rounded-full truncate max-w-[200px] transition-colors"
              >
                {item.prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Prompt input form */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          disabled={isProcessing}
          className={cn(
            "w-full min-h-[100px] p-4 pr-12 rounded-xl border bg-background resize-y focus:ring-2 ring-offset-2 ring-offset-background transition-all",
            isProcessing ? "opacity-70 cursor-not-allowed" : "opacity-100"
          )}
        />
        
        <button
          type="submit"
          disabled={!prompt.trim() || isProcessing}
          className={cn(
            "absolute bottom-4 right-4 p-2 rounded-full transition-colors",
            prompt.trim() && !isProcessing
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          aria-label="Send prompt"
        >
          <Send size={18} />
        </button>
      </form>
      
      {/* Example prompts */}
      <div className="mt-4">
        <p className="text-xs text-muted-foreground mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          <ExamplePrompt text="Add a caption at the bottom" onClick={() => setPrompt("Add a caption at the bottom saying 'Summer memories'")} />
          <ExamplePrompt text="Make it slow motion" onClick={() => setPrompt("Convert the video to slow motion")} />
          <ExamplePrompt text="Add background music" onClick={() => setPrompt("Add upbeat background music")} />
          <ExamplePrompt text="Apply cinematic filter" onClick={() => setPrompt("Apply a cinematic color grade")} />
        </div>
      </div>
    </div>
  );
};

const ExamplePrompt: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="text-xs bg-secondary/30 hover:bg-secondary text-foreground px-3 py-1 rounded-full transition-colors"
  >
    {text}
  </button>
);

export default AIPrompt;
