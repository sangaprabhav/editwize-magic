
import { 
  AIEditRequest, 
  AIEditResponse, 
  VideoProcessRequest, 
  VideoProcessResponse,
  EditRequest
} from '@/types';

// Base API URL - would be set from environment in a real app
const API_BASE_URL = '/api';

/**
 * Send a request to the AI agent for video editing suggestions
 */
export const requestAIEdit = async (request: AIEditRequest): Promise<AIEditResponse> => {
  // For development/demo purposes, this function returns a mock response
  // In production, this would make an actual API call
  
  console.log('Sending AI edit request:', request);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock successful response
  return {
    status: 'success',
    editPlan: {
      effects: [
        {
          type: 'text',
          startTime: 0,
          endTime: 5,
          parameters: {
            text: 'Added caption based on prompt: ' + request.prompt,
            position: 'bottom',
            fontSize: 24,
            color: '#ffffff'
          }
        },
        {
          type: 'filter',
          parameters: {
            name: 'brightness',
            value: 1.2
          }
        }
      ]
    }
  };
  
  // In production, use this code instead:
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/video/aiEdit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('AI edit request failed:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
  */
};

/**
 * Process a video using the edit plan provided by the AI
 */
export const processVideoEdit = async (request: VideoProcessRequest): Promise<VideoProcessResponse> => {
  // For development/demo purposes, this function returns a mock response
  // In production, this would make an actual API call
  
  console.log('Processing video edit:', request);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock successful response - returns the same video URL for demo
  return {
    status: 'success',
    editedVideoUrl: request.videoFileUrl
  };
  
  // In production, use this code instead:
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/video/processEdits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Video processing failed:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
  */
};

/**
 * Complete workflow to handle an edit request from start to finish
 */
export const handleEditRequest = async (
  editRequest: Omit<EditRequest, 'id' | 'createdDate' | 'status' | 'responseJSON'>,
  videoUrl: string,
  conversationHistory?: Array<{ prompt: string; timestamp: Date }>
): Promise<{
  editRequest: EditRequest,
  processedVideoUrl?: string
}> => {
  // 1. Create a new edit request object
  const newEditRequest: EditRequest = {
    id: `edit_${Date.now()}`,
    videoId: editRequest.videoId,
    userId: editRequest.userId,
    promptText: editRequest.promptText,
    createdDate: new Date(),
    status: 'In Progress',
  };
  
  try {
    // 2. Send request to AI agent
    const aiResponse = await requestAIEdit({
      prompt: editRequest.promptText,
      videoId: editRequest.videoId,
      conversationHistory
    });
    
    if (aiResponse.status === 'error' || !aiResponse.editPlan) {
      throw new Error(aiResponse.message || 'AI processing failed');
    }
    
    // 3. Update edit request with AI response
    newEditRequest.responseJSON = JSON.stringify(aiResponse.editPlan);
    
    // 4. Process the video with the edit plan
    const processResponse = await processVideoEdit({
      videoFileUrl: videoUrl,
      editPlan: aiResponse.editPlan
    });
    
    if (processResponse.status === 'error' || !processResponse.editedVideoUrl) {
      throw new Error(processResponse.message || 'Video processing failed');
    }
    
    // 5. Mark the edit request as completed
    newEditRequest.status = 'Completed';
    
    // 6. Return the updated edit request and the processed video URL
    return {
      editRequest: newEditRequest,
      processedVideoUrl: processResponse.editedVideoUrl
    };
  } catch (error) {
    // Handle errors
    newEditRequest.status = 'Error';
    console.error('Edit request processing failed:', error);
    
    return {
      editRequest: newEditRequest
    };
  }
};
