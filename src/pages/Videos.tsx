
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Share2, Pencil, Plus, Filter, SortDesc } from 'lucide-react';
import { Video, getMockVideos, formatDate } from '@/types';

const Videos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  
  useEffect(() => {
    // Load mock videos data
    const fetchedVideos = getMockVideos();
    setVideos(fetchedVideos);
  }, []);
  
  // Sort videos based on selected criteria
  const sortedVideos = [...videos].sort((a, b) => {
    if (sortBy === 'date') {
      return b.createdDate.getTime() - a.createdDate.getTime();
    } else {
      return a.videoTitle.localeCompare(b.videoTitle);
    }
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <AnimatedTransition delay={100}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">My Videos</h1>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setSortBy('date')} className={sortBy === 'date' ? 'bg-secondary' : ''}>
                <SortDesc className="h-4 w-4 mr-2" />
                Date
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSortBy('title')} className={sortBy === 'title' ? 'bg-secondary' : ''}>
                <Filter className="h-4 w-4 mr-2" />
                Title
              </Button>
              <Link to="/upload">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition delay={200}>
          {sortedVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedVideos.map((video, index) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative aspect-video bg-black">
                    <img 
                      src={video.originalVideoFile} 
                      alt={video.videoTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={
                        video.status === 'Ready' ? 'default' :
                        video.status === 'Processing' ? 'secondary' :
                        'outline'
                      }>
                        {video.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{video.videoTitle}</CardTitle>
                    <CardDescription>
                      Created on {formatDate(video.createdDate)}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {video.videoDescription || 'No description provided'}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-2 flex gap-2">
                    <Link to={`/editor/${video.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/share/${video.id}`}>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </Link>
                    <Button variant="secondary" size="sm" className="ml-auto">
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <CardHeader>
                <CardTitle>No videos yet</CardTitle>
                <CardDescription>
                  Upload your first video to get started
                </CardDescription>
              </CardHeader>
              <CardFooter className="justify-center pt-4">
                <Link to="/upload">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default Videos;
