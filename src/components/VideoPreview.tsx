
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Share2, Download } from 'lucide-react';

interface VideoPreviewProps {
  src: string;
  title?: string;
  className?: string;
  onShare?: () => void;
  onDownload?: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  src,
  title,
  className,
  onShare,
  onDownload
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    // Set up event listeners
    const onLoadedMetadata = () => {
      setDuration(videoElement.duration);
      setIsLoading(false);
    };
    
    const onTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };
    
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      videoElement.currentTime = 0;
    };
    
    const onError = () => {
      setError("Failed to load video");
      setIsLoading(false);
    };
    
    videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
    videoElement.addEventListener('timeupdate', onTimeUpdate);
    videoElement.addEventListener('ended', onEnded);
    videoElement.addEventListener('error', onError);
    
    // Reset state when src changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setError(null);
    
    // Clean up event listeners
    return () => {
      videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      videoElement.removeEventListener('timeupdate', onTimeUpdate);
      videoElement.removeEventListener('ended', onEnded);
      videoElement.removeEventListener('error', onError);
    };
  }, [src]);
  
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };
  
  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle download
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = src;
      link.download = title || 'video';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-2xl overflow-hidden bg-black/95 relative">
        {/* Video Element */}
        <div className="relative">
          <video
            ref={videoRef}
            src={src}
            className="w-full aspect-video object-contain"
            muted={isMuted}
            playsInline
          />
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          
          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
              <p>{error}</p>
            </div>
          )}
          
          {/* Play/Pause Overlay Button */}
          {!isLoading && !error && (
            <button
              onClick={togglePlay}
              className={cn(
                "absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-300",
                isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
              )}
            >
              <div className="bg-black/30 p-5 rounded-full backdrop-blur-sm">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white" />
                )}
              </div>
            </button>
          )}
        </div>
        
        {/* Video Controls */}
        <div className="p-4 bg-foreground/5 backdrop-blur-sm">
          {/* Title */}
          {title && (
            <h3 className="text-sm font-medium mb-3 text-foreground">{title}</h3>
          )}
          
          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-muted/30 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              style={{
                background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(currentTime / (duration || 1)) * 100}%, hsl(var(--muted)) ${(currentTime / (duration || 1)) * 100}%, hsl(var(--muted)) 100%)`,
              }}
            />
          </div>
          
          {/* Controls Row */}
          <div className="flex items-center justify-between">
            {/* Time Display */}
            <div className="text-xs text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="text-foreground hover:text-primary transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>
              
              {onShare && (
                <button
                  onClick={onShare}
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label="Share"
                >
                  <Share2 size={18} />
                </button>
              )}
              
              <button
                onClick={handleDownload}
                className="text-foreground hover:text-primary transition-colors"
                aria-label="Download"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
