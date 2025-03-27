
import { 
  AIEditRequest, 
  AIEditResponse, 
  VideoProcessRequest, 
  VideoProcessResponse,
  EditRequest
} from '@/types';
import { 
  showProcessingNotification,
  showEditCompleteNotification,
  showErrorNotification 
} from '@/utils/notifications';

// Base API URL - would be set from environment in a real app
const API_BASE_URL = '/api';

/**
 * Send a request to the OpenAI GPT-4o model for video editing suggestions
 */
export const requestAIEdit = async (request: AIEditRequest): Promise<AIEditResponse> => {
  console.log('Sending AI edit request to GPT-4o:', request);
  
  try {
    // We're making a POST request to our backend API which will call OpenAI
    const response = await fetch(`${API_BASE_URL}/video/aiEdit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        model: 'gpt-4o', // Specify we want to use GPT-4o
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('AI edit request to GPT-4o failed:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Process a video using the edit plan provided by GPT-4o
 */
export const processVideoEdit = async (request: VideoProcessRequest): Promise<VideoProcessResponse> => {
  console.log('Processing video edit with GPT-4o plan:', request);
  
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
    console.error('Video processing with GPT-4o plan failed:', error);
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Complete workflow to handle an edit request from start to finish using GPT-4o
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
    // Display processing notification
    showProcessingNotification();
    
    // 2. Send request to GPT-4o
    const aiResponse = await requestAIEdit({
      prompt: editRequest.promptText,
      videoId: editRequest.videoId,
      conversationHistory
    });
    
    if (aiResponse.status === 'error' || !aiResponse.editPlan) {
      throw new Error(aiResponse.message || 'GPT-4o processing failed');
    }
    
    // 3. Update edit request with GPT-4o response
    newEditRequest.responseJSON = JSON.stringify(aiResponse.editPlan);
    
    // 4. Process the video with the edit plan from GPT-4o
    const processResponse = await processVideoEdit({
      videoFileUrl: videoUrl,
      editPlan: aiResponse.editPlan
    });
    
    if (processResponse.status === 'error' || !processResponse.editedVideoUrl) {
      throw new Error(processResponse.message || 'Video processing with GPT-4o edit plan failed');
    }
    
    // 5. Mark the edit request as completed
    newEditRequest.status = 'Completed';
    
    // Show completion notification
    showEditCompleteNotification();
    
    // 6. Return the updated edit request and the processed video URL
    return {
      editRequest: newEditRequest,
      processedVideoUrl: processResponse.editedVideoUrl
    };
  } catch (error) {
    // Handle errors
    newEditRequest.status = 'Error';
    console.error('Edit request processing with GPT-4o failed:', error);
    
    // Show error notification
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    showErrorNotification(errorMessage);
    
    return {
      editRequest: newEditRequest
    };
  }
};
