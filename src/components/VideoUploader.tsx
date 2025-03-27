
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, Film } from 'lucide-react';

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void;
  className?: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelect, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file');
      return;
    }
    
    setSelectedFile(file);
    onVideoSelect(file);
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Clean up previous preview URL
    return () => URL.revokeObjectURL(objectUrl);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {!selectedFile ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[200px]",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-secondary/50",
            className
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Film className="w-10 h-10 mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Upload your video</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Drag and drop your video here, or click to browse
          </p>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full flex items-center gap-2 button-hover"
          >
            <Upload size={18} />
            <span>Browse Files</span>
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="border rounded-2xl overflow-hidden transition-all">
          <div className="relative">
            <video
              src={previewUrl || undefined}
              controls
              className="w-full rounded-t-2xl"
            />
            <button
              onClick={clearFile}
              className="absolute top-3 right-3 bg-foreground/80 hover:bg-foreground text-background rounded-full p-1 transition-colors"
              aria-label="Remove video"
            >
              <X size={16} />
            </button>
          </div>
          <div className="p-4 bg-secondary/50">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
