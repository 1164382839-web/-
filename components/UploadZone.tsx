import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndPassFile(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const validateAndPassFile = (file: File) => {
    // Simple validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div 
      className="w-full max-w-xl mx-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <label 
        htmlFor="file-upload" 
        className="flex flex-col items-center justify-center w-full h-80 border-2 border-slate-300 border-dashed rounded-3xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors duration-200 group"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-200">
            <Upload className="w-10 h-10 text-slate-500 group-hover:text-blue-600" />
          </div>
          <p className="mb-2 text-xl font-medium text-slate-700 font-hand">
            Drop your photo here to sketch it!
          </p>
          <p className="text-sm text-slate-500">
            Supports JPG, PNG, WEBP (Max 10MB)
          </p>
          <div className="mt-6">
            <span className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-sm group-hover:border-blue-400 group-hover:text-blue-600 transition-colors">
              Browse Files
            </span>
          </div>
        </div>
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileInput}
        />
      </label>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ImageIcon size={20} />
          </div>
          <h3 className="font-semibold text-slate-800 text-sm">High Quality</h3>
          <p className="text-xs text-slate-500 mt-1">Preserves details</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <h3 className="font-semibold text-slate-800 text-sm">Artistic Styles</h3>
          <p className="text-xs text-slate-500 mt-1">Pencil, Ink, Charcoal</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <h3 className="font-semibold text-slate-800 text-sm">Fast Processing</h3>
          <p className="text-xs text-slate-500 mt-1">Powered by Gemini 2.5</p>
        </div>
      </div>
    </div>
  );
};