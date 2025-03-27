
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Play, Share2, MoreVertical } from 'lucide-react';
import { Video, getMockVideos, formatDate } from '@/types';

const Library = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  
  useEffect(() => {
    // Load mock videos data
    setVideos(getMockVideos());
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <AnimatedTransition delay={100}>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Videos</h1>
            <Link 
              to="/upload" 
              className="bg-primary text-primary-foreground px-5 py-2 rounded-full button-hover"
            >
              Upload New Video
            </Link>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition delay={200}>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <VideoCard key={video.id} video={video} index={index} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your first video to get started
              </p>
              <Link 
                to="/upload" 
                className="bg-primary text-primary-foreground px-5 py-2 rounded-full button-hover"
              >
                Upload Video
              </Link>
            </div>
          )}
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
  return (
    <AnimatedTransition delay={300 + index * 100}>
      <div className="bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-shadow">
        <div className="relative aspect-video bg-black">
          <img 
            src={video.originalVideoFile} 
            alt={video.videoTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <div className="flex items-center gap-2 text-white text-sm">
              <span className={`px-2 py-1 rounded-full text-xs ${
                video.status === 'Ready' ? 'bg-green-500/70' :
                video.status === 'Processing' ? 'bg-yellow-500/70' :
                'bg-blue-500/70'
              }`}>
                {video.status}
              </span>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/30 transition-opacity">
            <div className="flex gap-2">
              <Link 
                to={`/editor/${video.id}`}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <Play size={20} />
              </Link>
              <Link 
                to={`/share/${video.id}`}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                <Share2 size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="p-4">
          <Link to={`/editor/${video.id}`} className="block">
            <h3 className="font-medium text-foreground truncate mb-1 hover:text-primary transition-colors">
              {video.videoTitle}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {video.videoDescription || 'No description'}
          </p>
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

export default Library;
