
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Plus, Film, Upload, Camera, Play, MoreVertical } from 'lucide-react';
import { Video, getMockVideos, formatDate, formatDuration } from '@/types';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  
  useEffect(() => {
    // Load mock videos data
    setRecentVideos(getMockVideos().slice(0, 3)); // Only show 3 most recent
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <AnimatedTransition delay={100}>
          <section className="mb-12">
            <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name}</h1>
            <p className="text-muted-foreground">Create, edit, and share your videos using AI</p>
          </section>
        </AnimatedTransition>
        
        <AnimatedTransition delay={200}>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Link 
              to="/upload" 
              className="block glass-card p-6 text-center hover:shadow-xl transition-all duration-300 border border-border/50"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-2">Upload Video</h2>
              <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                Upload a video from your device and transform it with AI
              </p>
            </Link>
            
            <Link 
              to="/upload?tab=record" 
              className="block glass-card p-6 text-center hover:shadow-xl transition-all duration-300 border border-border/50"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-medium mb-2">Record Video</h2>
              <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                Record directly in the app using your camera
              </p>
            </Link>
          </section>
        </AnimatedTransition>
        
        <AnimatedTransition delay={300}>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-medium">Recent Projects</h2>
              <Link to="/library" className="text-primary hover:underline">
                View all
              </Link>
            </div>
            
            {recentVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentVideos.map((video, index) => (
                  <VideoCard key={video.id} video={video} index={index} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No videos yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by creating your first AI-powered video edit
                </p>
                <Link 
                  to="/upload" 
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-full inline-flex items-center gap-2 button-hover"
                >
                  <Plus size={18} />
                  <span>New Video</span>
                </Link>
              </div>
            )}
          </section>
        </AnimatedTransition>
      </main>
    </div>
  );
};

// Video card component
interface VideoCardProps {
  video: Video;
  index: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, index }) => {
  // Assuming all videos have a duration of 60 seconds for mock data
  const mockDuration = 60;
  
  return (
    <AnimatedTransition delay={400 + index * 100}>
      <div className="bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-shadow">
        <div className="relative aspect-video bg-black">
          <img 
            src={video.originalVideoFile} 
            alt={video.videoTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <div className="flex items-center gap-2 text-white text-sm">
              <span>{formatDuration(mockDuration)}</span>
              <span className="w-1 h-1 rounded-full bg-white/70"></span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                video.status === 'Ready' ? 'bg-green-500/70' :
                video.status === 'Processing' ? 'bg-yellow-500/70' :
                'bg-blue-500/70'
              }`}>
                {video.status}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 transition-opacity">
            <Link 
              to={`/editor/${video.id}`}
              className="bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/30 transition-colors"
            >
              <Play size={24} />
            </Link>
          </div>
        </div>
        <div className="p-4">
          <Link to={`/editor/${video.id}`} className="block">
            <h3 className="font-medium text-foreground truncate mb-1 hover:text-primary transition-colors">
              {video.videoTitle}
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDate(video.createdDate)}
            </span>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default Dashboard;
