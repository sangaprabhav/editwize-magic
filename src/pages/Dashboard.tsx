
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Plus, Film, Clock, Image, Play, MoreVertical } from 'lucide-react';

// Mock data for videos
const mockVideos = [
  {
    id: '1',
    title: 'Beach Sunset',
    thumbnail: 'https://i.pravatar.cc/300?img=1',
    duration: 122, // in seconds
    date: new Date(2023, 6, 15),
    status: 'completed',
  },
  {
    id: '2',
    title: 'Mountain Hike',
    thumbnail: 'https://i.pravatar.cc/300?img=2',
    duration: 45,
    date: new Date(2023, 6, 10),
    status: 'completed',
  },
  {
    id: '3',
    title: 'City Timelapse',
    thumbnail: 'https://i.pravatar.cc/300?img=3',
    duration: 67,
    date: new Date(2023, 6, 5),
    status: 'completed',
  },
];

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [recentVideos, setRecentVideos] = useState(mockVideos);
  
  // Format time in MM:SS format
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
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
          <section className="mb-12">
            <Link 
              to="/editor" 
              className="block glass-card p-8 text-center hover:shadow-xl transition-all duration-300 border border-border/50"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-medium mb-3">New Video Edit</h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                Upload a video or record directly in the app, then use AI to transform it with simple text prompts
              </p>
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl button-hover">
                Start New Project
              </button>
            </Link>
          </section>
        </AnimatedTransition>
        
        <AnimatedTransition delay={300}>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-medium">Recent Projects</h2>
              <Link to="/videos" className="text-primary hover:underline">
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
                  to="/editor" 
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
  video: {
    id: string;
    title: string;
    thumbnail: string;
    duration: number;
    date: Date;
    status: string;
  };
  index: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, index }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <AnimatedTransition delay={400 + index * 100}>
      <div className="bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-shadow">
        <div className="relative aspect-video bg-black">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <div className="flex items-center gap-2 text-white text-sm">
              <Clock size={14} />
              <span>{formatDuration(video.duration)}</span>
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
              {video.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatDate(video.date)}
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
