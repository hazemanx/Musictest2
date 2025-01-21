import React, { useState } from 'react';
import { useMusicStore } from '../store/musicStore';
import { motion } from 'framer-motion';
import { Edit2, Save, X } from 'lucide-react';
import type { Song } from '../types/music';

export const MetadataEditor: React.FC<{ song: Song }> = ({ song }) => {
  const { updateSongMetadata } = useMusicStore();
  const [isEditing, setIsEditing] = useState(false);
  const [metadata, setMetadata] = useState({
    title: song.title,
    artist: song.artist,
    album: song.album,
    artwork: song.artwork
  });

  const handleSave = () => {
    updateSongMetadata(song.id, metadata);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-lg shadow-sm"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold">Song Details</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-full bg-gray-100"
          >
            <Edit2 size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <p className="mt-1 text-gray-900">{metadata.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Artist</label>
            <p className="mt-1 text-gray-900">{metadata.artist}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Album</label>
            <p className="mt-1 text-gray-900">{metadata.album}</p>
          </div>
          {metadata.artwork && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Artwork</label>
              <img 
                src={metadata.artwork} 
                alt="Album artwork" 
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-lg shadow-sm"
    >
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-bold">Edit Song Details</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="p-2 rounded-full bg-gray-900 text-white"
          >
            <Save size={20} />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 rounded-full bg-gray-100"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Artist</label>
          <input
            type="text"
            value={metadata.artist}
            onChange={(e) => setMetadata({ ...metadata, artist: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Album</label>
          <input
            type="text"
            value={metadata.album}
            onChange={(e) => setMetadata({ ...metadata, album: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Artwork URL</label>
          <input
            type="text"
            value={metadata.artwork}
            onChange={(e) => setMetadata({ ...metadata, artwork: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {metadata.artwork && (
            <img 
              src={metadata.artwork} 
              alt="Album artwork preview" 
              className="mt-2 w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};