
// User type definition
export interface User {
  id: string;
  username: string;
  email: string;
  // Note: password should never be stored in frontend state
  // It's included here just to match the schema definition
  password?: string; 
  profilePicture?: string;
  createdDate: Date;
}

// Video status type
export type VideoStatus = 'Uploaded' | 'Processing' | 'Ready' | 'Failed';

// Video type definition
export interface Video {
  id: string;
  ownerId: string; // Reference to User
  originalVideoFile: string; // URL or path to the video file
  editedVideoFile?: string; // URL or path to the edited video file
  videoTitle: string;
  videoDescription?: string;
  createdDate: Date;
  status: VideoStatus;
}

// Edit request status type
export type EditRequestStatus = 'In Progress' | 'Completed' | 'Error';

// Edit request type definition
export interface EditRequest {
  id: string;
  videoId: string; // Reference to Video
  userId: string; // Reference to User
  promptText: string;
  responseJSON?: string; // JSON stored as string containing AI editing instructions
  createdDate: Date;
  status: EditRequestStatus;
}

// Mock data service for videos (to be replaced with actual API calls)
export const getMockVideos = (): Video[] => {
  return [
    {
      id: '1',
      ownerId: 'user1',
      originalVideoFile: 'https://i.pravatar.cc/300?img=1',
      editedVideoFile: 'https://i.pravatar.cc/300?img=1',
      videoTitle: 'Beach Sunset',
      videoDescription: 'Beautiful sunset at the beach',
      createdDate: new Date(2023, 6, 15),
      status: 'Ready',
    },
    {
      id: '2',
      ownerId: 'user1',
      originalVideoFile: 'https://i.pravatar.cc/300?img=2',
      videoTitle: 'Mountain Hike',
      createdDate: new Date(2023, 6, 10),
      status: 'Ready',
    },
    {
      id: '3',
      ownerId: 'user1',
      originalVideoFile: 'https://i.pravatar.cc/300?img=3',
      videoTitle: 'City Timelapse',
      createdDate: new Date(2023, 6, 5),
      status: 'Ready',
    },
  ];
};

// Helper function to format duration from seconds
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Helper function to format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
};
