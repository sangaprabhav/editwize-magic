
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import VideoPreview from '@/components/VideoPreview';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Video, getMockVideos } from '@/types';
import { ArrowLeft, Copy, Facebook, Twitter, Instagram } from 'lucide-react';

const Share = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [video, setVideo] = useState<Video | null>(null);
  const [videoLink, setVideoLink] = useState<string>('');
  
  useEffect(() => {
    if (id) {
      const videos = getMockVideos();
      const foundVideo = videos.find(v => v.id === id);
      
      if (foundVideo) {
        setVideo(foundVideo);
        
        // Generate a shareable link (in a real app, this would be a real URL)
        const baseUrl = window.location.origin;
        setVideoLink(`${baseUrl}/share/${foundVideo.id}`);
      }
    }
  }, [id]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoLink)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Share link has been copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Please try copying the link manually",
          variant: "destructive",
        });
      });
  };
  
  const handleShareOnSocial = (platform: string) => {
    // In a real app, this would integrate with social media APIs
    toast({
      title: `Share on ${platform}`,
      description: "This feature would share to social media in a real app",
    });
  };
  
  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Video Not Found</h1>
          <Link to="/library" className="text-primary hover:underline">
            Return to My Videos
          </Link>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <AnimatedTransition delay={100}>
          <div className="mb-6">
            <Link 
              to={`/editor/${video.id}`} 
              className="inline-flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to Editor</span>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{video.videoTitle}</h1>
          {video.videoDescription && (
            <p className="text-muted-foreground mb-6">{video.videoDescription}</p>
          )}
        </AnimatedTransition>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video Preview */}
          <AnimatedTransition delay={200} className="lg:col-span-2">
            <div className="glass-card p-6">
              <h2 className="text-xl font-medium mb-4">Preview</h2>
              <VideoPreview
                src={video.editedVideoFile || video.originalVideoFile}
                title={video.videoTitle}
              />
            </div>
          </AnimatedTransition>
          
          {/* Right Column - Share Options */}
          <AnimatedTransition delay={300} className="lg:col-span-1">
            <div className="glass-card p-6">
              <h2 className="text-xl font-medium mb-4">Share Video</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Video Link
                  </label>
                  <div className="flex items-center gap-2">
                    <Input value={videoLink} readOnly />
                    <Button variant="secondary" onClick={handleCopyLink}>
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Share on Social Media
                  </label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => handleShareOnSocial('Facebook')}
                    >
                      <Facebook size={16} className="mr-2" />
                      Facebook
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => handleShareOnSocial('Twitter')}
                    >
                      <Twitter size={16} className="mr-2" />
                      Twitter
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => handleShareOnSocial('Instagram')}
                    >
                      <Instagram size={16} className="mr-2" />
                      Instagram
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <Link to="/library">
                    <Button variant="default" className="w-full">
                      Back to My Videos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </main>
    </div>
  );
};

export default Share;
