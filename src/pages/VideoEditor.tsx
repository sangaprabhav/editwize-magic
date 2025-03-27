
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import VideoUploader from '@/components/VideoUploader';
import VideoRecorder from '@/components/VideoRecorder';
import AIPrompt from '@/components/AIPrompt';
import VideoPreview from '@/components/VideoPreview';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Save, Loader2, Share2 } from 'lucide-react';
import { Video, EditRequest, EditRequestStatus, getMockVideos } from '@/types';

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
    setPrompt(promptText);
    setPromptHistory(prev => [...prev, { prompt: promptText, timestamp: new Date() }]);
    
    // Create a new edit request
    const newEditRequest: EditRequest = {
      id: `edit_${Date.now()}`,
      videoId: currentVideo?.id || 'new_video',
      userId: 'user1', // In a real app, this would be the current user's ID
      promptText,
      createdDate: new Date(),
      status: 'In Progress',
    };
    
    setEditRequests(prev => [...prev, newEditRequest]);
    
    // Simulate AI processing
    setIsProcessing(true);
    
    try {
      // In a real app, this would be an API call to the AI service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we'll just use the original video
      setProcessedVideo(videoSource);
      
      // Update the edit request status
      setEditRequests(prev => 
        prev.map(req => 
          req.id === newEditRequest.id 
            ? { ...req, status: 'Completed' as EditRequestStatus, responseJSON: JSON.stringify({ effect: 'applied', timestamp: new Date() }) } 
            : req
        )
      );
      
      toast({
        title: "Edit complete",
        description: "Your video has been processed with AI",
      });
    } catch (error) {
      // Update the edit request status to error
      setEditRequests(prev => 
        prev.map(req => 
          req.id === newEditRequest.id 
            ? { ...req, status: 'Error' as EditRequestStatus } 
            : req
        )
      );
      
      toast({
        title: "Processing failed",
        description: "There was an error processing your video",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Clear prompt history
  const handleClearHistory = () => {
    setPromptHistory([]);
  };
  
  // Save video
  const handleSaveVideo = () => {
    toast({
      title: "Video saved",
      description: "Your edited video has been saved to your library",
    });
    
    // In a real app, this would save to backend
    // For demo, we'll navigate back to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };
  
  // Share video
  const handleShareVideo = () => {
    toast({
      title: "Share options",
      description: "Share options would appear here in a real app",
    });
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
          <h1 className="text-3xl font-bold mb-6">
            {currentVideo ? `Editing: ${currentVideo.videoTitle}` : 'AI Video Editor'}
          </h1>
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
          </AnimatedTransition>
          
          {/* Right Column - Preview */}
          <AnimatedTransition delay={300} className="lg:col-span-2">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">Video Preview</h2>
                
                {processedVideo && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveVideo}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center gap-2 button-hover"
                    >
                      <Save size={16} />
                      <span>Save</span>
                    </button>
                    
                    <button
                      onClick={handleShareVideo}
                      className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full flex items-center gap-2 button-hover"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                )}
              </div>
              
              {isProcessing ? (
                <div className="aspect-video bg-black/5 rounded-xl flex flex-col items-center justify-center p-8">
                  <div className="mb-4">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Processing your video</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Our AI is working its magic to apply your edits. This might take a moment...
                  </p>
                </div>
              ) : processedVideo ? (
                <VideoPreview
                  src={processedVideo}
                  title="Processed Video"
                  onShare={handleShareVideo}
                />
              ) : videoSource ? (
                <VideoPreview
                  src={videoSource}
                  title="Original Video"
                />
              ) : (
                <div className="aspect-video bg-black/5 rounded-xl flex flex-col items-center justify-center p-8">
                  <h3 className="text-lg font-medium mb-2">No video selected</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    Upload a video or record one using your camera to get started
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-full button-hover"
                  >
                    Select a Video
                  </button>
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
              
              {editRequests.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Edit History</h3>
                  <div className="space-y-2">
                    {editRequests.map((request) => (
                      <div key={request.id} className="p-3 bg-card border border-border/50 rounded-lg">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{request.promptText}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            request.status === 'Error' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
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
            </div>
          </AnimatedTransition>
        </div>
      </main>
    </div>
  );
};

export default VideoEditor;
