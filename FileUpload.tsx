import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { FileData } from '../types';

interface FileUploadProps {
  onFileSelect: (fileData: FileData) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);
    
    if (file.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size must be less than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Content = base64String.split(',')[1];
      
      onFileSelect({
        file,
        base64: base64Content,
        mimeType: file.type
      });
    };
    reader.onerror = () => {
      setError("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Upload Medical Report</h2>
        <p className="text-slate-500">We analyze your PDF reports securely and provide translations & advice.</p>
      </div>

      <div
        className={`relative rounded-xl border-2 border-dashed p-12 transition-all duration-200 ease-in-out ${
          isDragging
            ? 'border-teal-500 bg-teal-50'
            : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className={`mb-4 rounded-full p-4 ${isDragging ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">
            Drag and drop your PDF here
          </h3>
          <p className="mb-6 text-sm text-slate-500">
            or click the button below to browse files
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept="application/pdf"
            className="hidden"
          />
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="primary"
          >
            <FileText className="mr-2 h-4 w-4" />
            Select PDF Report
          </Button>

          <p className="mt-4 text-xs text-slate-400">Supported format: PDF (Max 10MB)</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 animate-pulse">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};