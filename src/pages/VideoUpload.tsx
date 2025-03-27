
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import VideoUploader from '@/components/VideoUploader';
import VideoRecorder from '@/components/VideoRecorder';
import VideoProgress from '@/components/VideoProgress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, ArrowUp } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Video } from '@/types';
import { showUploadNotification } from '@/utils/notifications';

// Form validation schema
const formSchema = z.object({
  videoTitle: z.string().min(3, { message: "Title must be at least 3 characters" }),
  videoDescription: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const VideoUpload = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoTitle: "",
      videoDescription: "",
    },
  });
  
  // Handle video upload
  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
    const url = URL.createObjectURL(file);
    setVideoSource(url);
    
    toast({
      title: "Video ready",
      description: "Now add a title and description",
    });
  };
  
  // Handle video recording
  const handleVideoRecord = (blob: Blob) => {
    setRecordedVideo(blob);
    const url = URL.createObjectURL(blob);
    setVideoSource(url);
    
    toast({
      title: "Recording ready",
      description: "Now add a title and description",
    });
  };
  
  // Simulate upload progress
  const simulateUploadProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    return () => clearInterval(interval);
  };
  
  // Handle form submission
  const onSubmit = (values: FormValues) => {
    if (!videoSource) {
      toast({
        title: "No video selected",
        description: "Please upload or record a video first",
        variant: "destructive",
      });
      return;
    }
    
    // Start the upload progress simulation
    const clearProgressInterval = simulateUploadProgress();
    
    // Create a new video object
    const newVideo: Video = {
      id: `vid_${Date.now()}`,
      ownerId: user?.id || 'user1',
      originalVideoFile: videoSource,
      videoTitle: values.videoTitle,
      videoDescription: values.videoDescription,
      createdDate: new Date(),
      status: 'Uploaded',
    };
    
    // Simulate uploading process
    setTimeout(() => {
      clearProgressInterval();
      
      // Show upload notification
      showUploadNotification(values.videoTitle);
      
      // Navigate to the editor with the new video ID
      setTimeout(() => {
        setIsUploading(false);
        navigate(`/editor/${newVideo.id}`);
      }, 500);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <AnimatedTransition delay={100}>
          <h1 className="text-3xl font-bold mb-6">Upload New Video</h1>
        </AnimatedTransition>
        
        {isUploading ? (
          <AnimatedTransition delay={200}>
            <div className="max-w-2xl mx-auto">
              <VideoProgress 
                status="Uploading" 
                progress={uploadProgress}
                message="Uploading your video to the server..."
              />
            </div>
          </AnimatedTransition>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upload/Record */}
            <AnimatedTransition delay={200} className="lg:col-span-1">
              <div className="glass-card p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Video Source</h2>
                
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
              </div>
            </AnimatedTransition>
            
            {/* Right Column - Metadata Form */}
            <AnimatedTransition delay={300} className="lg:col-span-2">
              <div className="glass-card p-6">
                <h2 className="text-xl font-medium mb-4">Video Details</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="videoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Video title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="videoDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter a brief description of your video" 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={!videoSource}
                      >
                        <ArrowUp className="mr-2" />
                        Save and Continue to Editor
                      </Button>
                      
                      {!videoSource && (
                        <p className="text-sm text-muted-foreground text-center mt-2">
                          Please upload or record a video first
                        </p>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
            </AnimatedTransition>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoUpload;
