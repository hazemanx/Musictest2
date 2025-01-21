import React, { useRef, useState } from 'react';
import { useMusicStore } from '../store/musicStore';
import { motion } from 'framer-motion';
import { Upload, FileMusic, X } from 'lucide-react';
import { Song } from '../types/music';

interface FileImportProps {
  onClose?: () => void;
}

export const FileImport: React.FC<FileImportProps> = ({ onClose }) => {
  const { addToLibrary } = useMusicStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const processAudioFile = (file: File): Promise<Song> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);
      
      audio.src = objectUrl;
      audio.addEventListener('loadedmetadata', () => {
        const song: Song = {
          id: Date.now().toString(),
          title: file.name.replace(/\.[^/.]+$/, ""),
          artist: 'Unknown Artist',
          album: 'Unknown Album',
          duration: audio.duration,
          artwork: '',
          source: 'local',
          sourceUrl: objectUrl,
          localPath: file.path,
          isDownloaded: true
        };
        
        resolve(song);
      });
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load audio file'));
      });
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsProcessing(true);
    
    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('audio/')) {
          const song = await processAudioFile(file);
          addToLibrary(song);
        }
      }
    } catch (error) {
      console.error('Error importing files:', error);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose?.();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    setIsProcessing(true);
    
    try {
      for (const file of files) {
        if (file.type.startsWith('audio/')) {
          const song = await processAudioFile(file);
          addToLibrary(song);
        }
      }
    } catch (error) {
      console.error('Error importing dropped files:', error);
    } finally {
      setIsProcessing(false);
      onClose?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Import Music</h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="px-4 py-2 bg-gray-900 text-white rounded-md flex items-center space-x-2 disabled:opacity-50"
        >
          <Upload size={20} />
          <span>{isProcessing ? 'Processing...' : 'Import Files'}</span>
        </button>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300'
        }`}
      >
        <FileMusic size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop your music files here
        </p>
        <p className="text-sm text-gray-500">
          Supports MP3, WAV, and M4A files
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </motion.div>
  );
};