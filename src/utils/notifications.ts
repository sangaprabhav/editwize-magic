import { toast } from "@/hooks/use-toast";

/**
 * Show a notification for uploading a video
 */
export const showUploadNotification = (title?: string) => {
  toast({
    title: title || "Video uploaded",
    description: "Your video is ready for editing",
  });
};

/**
 * Show a notification for a processing video
 */
export const showProcessingNotification = () => {
  toast({
    title: "Processing video",
    description: "Your video is being processed with AI",
  });
};

/**
 * Show a notification for a completed edit
 */
export const showEditCompleteNotification = () => {
  toast({
    title: "Edit complete",
    description: "Your video has been processed with AI",
  });
};

/**
 * Show a notification for a failed process
 */
export const showErrorNotification = (message?: string) => {
  toast({
    title: "Processing failed",
    description: message || "There was an error processing your video",
    variant: "destructive",
  });
};

/**
 * Show a notification for saved video
 */
export const showSaveNotification = () => {
  toast({
    title: "Video saved",
    description: "Your edited video has been saved to your library",
  });
};

/**
 * Show a notification for shared video
 */
export const showShareNotification = () => {
  toast({
    title: "Video shared",
    description: "Your video link has been copied to clipboard",
  });
};

/**
 * Show a notification for a cancelled process
 */
export const showCancelNotification = () => {
  toast({
    title: "Operation cancelled",
    description: "The current operation was cancelled",
  });
};

/**
 * Show a notification for a pending AI response
 */
export const showPendingNotification = () => {
  toast({
    title: "Waiting for AI",
    description: "The AI is processing your request. This may take a moment.",
  });
};

/**
 * Show a notification for an update
 */
export const showUpdateNotification = (message: string) => {
  toast({
    title: "Update",
    description: message,
  });
};
