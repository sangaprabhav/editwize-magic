
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import VideoUploader from '@/components/VideoUploader';
import VideoRecorder from '@/components/VideoRecorder';
import AIPrompt from '@/components/AIPrompt';
import VideoPreview from '@/components/VideoPreview';
import VideoProgress from '@/components/VideoProgress';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, Upload, Save, Share2, 
  ArrowLeft, Check, AlertTriangle 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Video, EditRequest, EditRequestStatus, getMockVideos } from '@/types';
import { handleEditRequest } from '@/services/videoEditService';
import { 
  showEditCompleteNotification, 
  showErrorNotification,
  showProcessingNotification,
  showSaveNotification,
  showShareNotification 
} from '@/utils/notifications';

const VideoEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // State
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [promptHistory, setPromptHistory] = useState<Array<{ prompt: string; timestamp: Date }>>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<'Uploading' | 'Processing' | 'Analyzing' | 'Completed' | 'Error'>('Processing');
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [editRequests, setEditRequests] = useState<EditRequest[]>([]);
  
  // Load video if ID is provided
  useEffect(() => {
    if (id) {
      const videos = getMockVideos();
      const video = videos.find(v => v.id === id);
      if (video) {
        setCurrentVideo(video);
        setVideoSource(video.originalVideoFile);
        if (video.editedVideoFile) {
          setProcessedVideo(video.editedVideoFile);
        }
      }
    }
  }, [id]);
  
  // Handle video upload
  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
    const url = URL.createObjectURL(file);
    setVideoSource(url);
    
    toast({
      title: "Video uploaded",
      description: "Your video is ready for editing",
    });
  };
  
  // Handle video recording
  const handleVideoRecord = (blob: Blob) => {
    setRecordedVideo(blob);
    const url = URL.createObjectURL(blob);
    setVideoSource(url);
    
    toast({
      title: "Video recorded",
      description: "Your recording is ready for editing",
    });
  };
  
  // Handle prompt submission
  const handlePromptSubmit = async (promptText: string) => {
    if (!videoSource) {
      toast({
        title: "No video selected",
        description: "Please upload or record a video first",
        variant: "destructive",
      });
      return;
    }
    
    setPrompt(promptText);
    setPromptHistory(prev => [...prev, { prompt: promptText, timestamp: new Date() }]);
    
    // Start processing
    setIsProcessing(true);
    setProcessingStatus('Processing');
    setProcessingProgress(0);
    
    // Show processing notification
    showProcessingNotification();
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 10);
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            setProcessingStatus('Analyzing');
            return 90;
          }
          return newProgress;
        });
      }, 600);
      
      // Process the edit request using our service
      const result = await handleEditRequest(
        {
          videoId: currentVideo?.id || 'new_video',
          userId: 'user1', // In a real app, this would be the current user's ID
          promptText,
        },
        videoSource,
        promptHistory
      );
      
      // Clear the progress interval
      clearInterval(progressInterval);
      
      // Add the new edit request to our list
      setEditRequests(prev => [...prev, result.editRequest]);
      
      // If we got a processed video URL back, use it
      if (result.processedVideoUrl) {
        setProcessedVideo(result.processedVideoUrl);
        setProcessingStatus('Completed');
        setProcessingProgress(100);
        
        // Show success toast
        showEditCompleteNotification();
        
        // Simulate slight delay before removing progress indicator
        setTimeout(() => {
          setIsProcessing(false);
        }, 1000);
      } else {
        throw new Error('No processed video URL returned');
      }
    } catch (error) {
      console.error('Error processing video:', error);
      
      setProcessingStatus('Error');
      
      // Show error toast
      showErrorNotification();
      
      // Remove progress indicator after a delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  };
  
  // Clear prompt history
  const handleClearHistory = () => {
    setPromptHistory([]);
  };
  
  // Save video
  const handleSaveVideo = () => {
    showSaveNotification();
    
    // In a real app, this would save to backend
    // For demo, we'll navigate back to dashboard
    setTimeout(() => {
      navigate('/library');
    }, 1500);
  };
  
  // Share video
  const handleShareVideo = () => {
    // Copy video URL to clipboard (in a real app)
    if (navigator.clipboard && processedVideo) {
      navigator.clipboard.writeText(window.location.origin + '/share/' + (currentVideo?.id || 'new_video'))
        .then(() => {
          showShareNotification();
        })
        .catch(() => {
          toast({
            title: "Failed to copy",
            description: "Please try copying the link manually",
            variant: "destructive",
          });
        });
    } else {
      // Fallback or navigate to share page
      navigate('/share/' + (currentVideo?.id || 'new_video'));
    }
  };
  
  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (videoSource && !currentVideo) {
        URL.revokeObjectURL(videoSource);
      }
      if (processedVideo && processedVideo !== videoSource && !currentVideo?.editedVideoFile) {
        URL.revokeObjectURL(processedVideo);
      }
    };
  }, [videoSource, processedVideo, currentVideo]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <AnimatedTransition delay={100}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-2"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <h1 className="text-3xl font-bold">
                {currentVideo ? `Editing: ${currentVideo.videoTitle}` : 'AI Video Editor'}
              </h1>
            </div>
            
            {processedVideo && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveVideo}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>Save</span>
                </Button>
                
                <Button
                  onClick={handleShareVideo}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </Button>
              </div>
            )}
          </div>
        </AnimatedTransition>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload/Record */}
          <AnimatedTransition delay={200} className="lg:col-span-1">
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-medium mb-4">Video Source</h2>
              
              {!currentVideo ? (
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="upload" className="w-full">
                      <Upload size={16} className="mr-2" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="record" className="w-full">
                      <Camera size={16} className="mr-2" />
                      Record
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="mt-0">
                    <VideoUploader onVideoSelect={handleVideoUpload} />
                  </TabsContent>
                  
                  <TabsContent value="record" className="mt-0">
                    <VideoRecorder onVideoRecord={handleVideoRecord} maxDuration={60} />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <p className="text-muted-foreground">
                    Editing existing video: <strong>{currentVideo.videoTitle}</strong>
                  </p>
                </div>
              )}
            </div>
            
            {/* AI Prompt Section */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-medium mb-4">Edit with AI</h2>
              
              <AIPrompt
                onSubmit={handlePromptSubmit}
                isProcessing={isProcessing}
                placeholder="Describe how you want to edit the video..."
                history={promptHistory}
                onHistoryClear={handleClearHistory}
              />
            </div>
            
            {/* Edit History */}
            {editRequests.length > 0 && (
              <div className="glass-card p-6 mt-6">
                <h2 className="text-xl font-medium mb-4">Edit History</h2>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {editRequests.map((request) => (
                    <div key={request.id} className="p-3 bg-card border border-border/50 rounded-lg">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-medium line-clamp-2">{request.promptText}</p>
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                          request.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          request.status === 'Error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {request.status === 'Completed' && <Check size={12} />}
                          {request.status === 'Error' && <AlertTriangle size={12} />}
                          {request.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(request.createdDate).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AnimatedTransition>
          
          {/* Right Column - Preview */}
          <AnimatedTransition delay={300} className="lg:col-span-2">
            <div className="glass-card p-6">
              <h2 className="text-xl font-medium mb-4">Video Preview</h2>
              
              {isProcessing ? (
                <VideoProgress
                  status={processingStatus}
                  progress={processingProgress}
                />
              ) : processedVideo ? (
                <VideoPreview
                  src={processedVideo}
                  title={currentVideo?.videoTitle || "Processed Video"}
                  onShare={handleShareVideo}
                />
              ) : videoSource ? (
                <VideoPreview
                  src={videoSource}
                  title={currentVideo?.videoTitle || "Original Video"}
                />
              ) : (
                <div className="aspect-video bg-black/5 rounded-xl flex flex-col items-center justify-center p-8">
                  <h3 className="text-lg font-medium mb-2">No video selected</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Upload a video or record one using your camera to get started
                  </p>
                  <Button
                    onClick={() => setActiveTab('upload')}
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-full"
                  >
                    Select a Video
                  </Button>
                </div>
              )}
              
              {videoSource && !processedVideo && !isProcessing && (
                <div className="mt-6 p-4 bg-secondary/30 rounded-xl">
                  <h3 className="text-sm font-medium mb-2">How to use the AI editor</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
                    <li>Your video is ready for editing</li>
                    <li>Enter a prompt describing how you'd like to edit the video</li>
                    <li>Our AI will process your request and generate the edited video</li>
                    <li>You can continue refining with additional prompts</li>
                  </ol>
                </div>
              )}
            </div>
          </AnimatedTransition>
        </div>
      </main>
    </div>
  );
};

export default VideoEditor;
