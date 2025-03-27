
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

// AI Edit Request interface for API calls
export interface AIEditRequest {
  prompt: string;
  videoId: string;
  conversationHistory?: Array<{ prompt: string; timestamp: Date }>;
}

// AI Edit Response interface for API responses
export interface AIEditResponse {
  status: 'success' | 'error';
  message?: string;
  editPlan?: {
    // This would contain the structured editing instructions
    effects: Array<{
      type: string;
      startTime?: number;
      endTime?: number;
      parameters?: Record<string, any>;
    }>;
  };
}

// Video Processing Request interface
export interface VideoProcessRequest {
  videoFileUrl: string;
  editPlan: any; // The edit plan from the AI response
}

// Video Processing Response interface
export interface VideoProcessResponse {
  status: 'success' | 'error';
  message?: string;
  editedVideoUrl?: string;
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
