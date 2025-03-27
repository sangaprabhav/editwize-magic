
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Camera, Play, Square, X, Check } from 'lucide-react';

interface VideoRecorderProps {
  onVideoRecord: (blob: Blob) => void;
  className?: string;
  maxDuration?: number; // In seconds
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ 
  onVideoRecord, 
  className,
  maxDuration = 60 // Default max duration is 60 seconds
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [permission, setPermission] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  
  const timerRef = useRef<number | null>(null);

  // Request camera permission and set up video stream
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setPermission(true);
      setIsCameraActive(true);
      
      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        setRecordedVideo(videoURL);
        onVideoRecord(blob);
        chunksRef.current = [];
      };
    } catch (err) {
      console.error("Error accessing camera:", err);
      setPermission(false);
    }
  };

  // Start recording
  const startRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    chunksRef.current = [];
    mediaRecorderRef.current.start(200); // Collect data every 200ms
    setIsRecording(true);
    setRecordingTime(0);
    
    // Start the timer
    timerRef.current = window.setInterval(() => {
      setRecordingTime((prevTime) => {
        const newTime = prevTime + 1;
        
        // Auto-stop recording if max duration is reached
        if (newTime >= maxDuration) {
          stopRecording();
        }
        
        return newTime;
      });
    }, 1000);
  };

  // Stop recording
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    if (mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    
    // Clear the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      // Stop any ongoing recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      // Stop and release camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Release any video URLs
      if (recordedVideo) {
        URL.revokeObjectURL(recordedVideo);
      }
    };
  }, [recordedVideo]);

  // Reset the recorded video
  const resetRecording = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }
    setRecordedVideo(null);
  };

  // Start or stop camera
  const toggleCamera = () => {
    if (isCameraActive) {
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
    } else {
      // Start camera
      setupCamera();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="border rounded-2xl overflow-hidden bg-secondary/10">
        {/* Camera View / Recorded Video */}
        <div className="relative aspect-video bg-black">
          {recordedVideo ? (
            // Show recorded video preview
            <video
              src={recordedVideo}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            // Show camera feed or placeholder
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={cn(
                  "w-full h-full object-cover",
                  !isCameraActive && "hidden"
                )}
              />
              
              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Camera className="w-10 h-10 mb-3" />
                  <p>Click below to enable camera</p>
                </div>
              )}
            </>
          )}
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-foreground/80 text-background px-3 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-subtle" />
              <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="p-4 flex items-center justify-between">
          {recordedVideo ? (
            // Controls for recorded video
            <div className="w-full flex items-center justify-center gap-4">
              <button
                onClick={resetRecording}
                className="bg-secondary rounded-full p-3 button-hover"
                aria-label="Discard recording"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
              
              <button
                onClick={() => setRecordedVideo(null)} // Accept the recording
                className="bg-primary rounded-full p-3 button-hover"
                aria-label="Accept recording"
              >
                <Check className="w-6 h-6 text-primary-foreground" />
              </button>
            </div>
          ) : (
            // Controls for camera view
            <div className="w-full flex items-center justify-center gap-4">
              <button
                onClick={toggleCamera}
                className={cn(
                  "rounded-full p-3 button-hover",
                  isCameraActive ? "bg-secondary" : "bg-primary"
                )}
                aria-label={isCameraActive ? "Stop camera" : "Start camera"}
              >
                <Camera className={cn(
                  "w-6 h-6",
                  isCameraActive ? "text-foreground" : "text-primary-foreground"
                )} />
              </button>
              
              {isCameraActive && (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(
                    "rounded-full p-3 button-hover",
                    isRecording ? "bg-destructive" : "bg-primary"
                  )}
                  disabled={!permission}
                  aria-label={isRecording ? "Stop recording" : "Start recording"}
                >
                  {isRecording ? (
                    <Square className="w-6 h-6 text-destructive-foreground" />
                  ) : (
                    <Play className="w-6 h-6 text-primary-foreground" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;
