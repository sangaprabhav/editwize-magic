
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import VideoPreview from '@/components/VideoPreview';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Video, getMockVideos } from '@/types';
import { ArrowLeft, Copy, Facebook, Twitter, Instagram, Mail, Download } from 'lucide-react';
import { showShareNotification } from '@/utils/notifications';

const Share = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [video, setVideo] = useState<Video | null>(null);
  const [videoLink, setVideoLink] = useState<string>('');
  const [embedCode, setEmbedCode] = useState<string>('');
  const [shareStatus, setShareStatus] = useState<{
    platform: string;
    status: 'idle' | 'sharing' | 'success' | 'error';
  }>({ platform: '', status: 'idle' });
  
  useEffect(() => {
    if (id) {
      const videos = getMockVideos();
      const foundVideo = videos.find(v => v.id === id);
      
      if (foundVideo) {
        setVideo(foundVideo);
        
        // Generate a shareable link and embed code (in a real app, this would be a real URL)
        const baseUrl = window.location.origin;
        const videoUrl = `${baseUrl}/share/${foundVideo.id}`;
        setVideoLink(videoUrl);
        setEmbedCode(`<iframe width="560" height="315" src="${videoUrl}/embed" frameborder="0" allowfullscreen></iframe>`);
      }
    }
  }, [id]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoLink)
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
  };
  
  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode)
      .then(() => {
        toast({
          title: "Embed code copied",
          description: "You can now paste it into your website",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Please try copying the embed code manually",
          variant: "destructive",
        });
      });
  };
  
  const handleShareOnSocial = (platform: string) => {
    // In a real app, this would integrate with social media APIs
    setShareStatus({ platform, status: 'sharing' });
    
    // Simulate API call
    setTimeout(() => {
      setShareStatus({ platform, status: 'success' });
      
      toast({
        title: `Shared on ${platform}`,
        description: `Your video has been shared on ${platform}`,
      });
      
      // Reset status after a delay
      setTimeout(() => {
        setShareStatus({ platform: '', status: 'idle' });
      }, 2000);
    }, 1500);
  };
  
  const handleDownload = () => {
    if (!video) return;
    
    // In a real app, this would trigger a download
    const videoSrc = video.editedVideoFile || video.originalVideoFile;
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = videoSrc;
    link.download = `${video.videoTitle.replace(/\s+/g, '_')}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your video download has started",
    });
  };
  
  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-6">Video Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The video you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/library">
            <Button>
              Return to My Videos
            </Button>
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
                onShare={() => handleCopyLink()}
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
                    <Input value={videoLink} readOnly className="font-mono text-xs" />
                    <Button variant="secondary" onClick={handleCopyLink}>
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Embed Code
                  </label>
                  <div className="flex items-center gap-2">
                    <Input value={embedCode} readOnly className="font-mono text-xs" />
                    <Button variant="secondary" onClick={handleCopyEmbed}>
                      <Copy size={16} />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Copy this code to embed the video in your website
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Share on Social Media
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => handleShareOnSocial('Facebook')}
                      disabled={shareStatus.status === 'sharing'}
                    >
                      {shareStatus.platform === 'Facebook' && shareStatus.status === 'sharing' ? (
                        <span className="animate-spin mr-2">⟳</span>
                      ) : (
                        <Facebook size={16} className="mr-2" />
                      )}
                      Facebook
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => handleShareOnSocial('Twitter')}
                      disabled={shareStatus.status === 'sharing'}
                    >
                      {shareStatus.platform === 'Twitter' && shareStatus.status === 'sharing' ? (
                        <span className="animate-spin mr-2">⟳</span>
                      ) : (
                        <Twitter size={16} className="mr-2" />
                      )}
                      Twitter
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => handleShareOnSocial('Instagram')}
                      disabled={shareStatus.status === 'sharing'}
                    >
                      {shareStatus.platform === 'Instagram' && shareStatus.status === 'sharing' ? (
                        <span className="animate-spin mr-2">⟳</span>
                      ) : (
                        <Instagram size={16} className="mr-2" />
                      )}
                      Instagram
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => handleShareOnSocial('Email')}
                      disabled={shareStatus.status === 'sharing'}
                    >
                      {shareStatus.platform === 'Email' && shareStatus.status === 'sharing' ? (
                        <span className="animate-spin mr-2">⟳</span>
                      ) : (
                        <Mail size={16} className="mr-2" />
                      )}
                      Email
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleDownload}
                    >
                      <Download size={16} className="mr-2" />
                      Download
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
