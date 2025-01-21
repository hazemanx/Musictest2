import React from 'react';
import { motion } from 'framer-motion';
import { Music, Download, Trash2, Check } from 'lucide-react';
import { Song } from '../types/music';
import { useMusicStore } from '../store/musicStore';

export const SongListItem: React.FC<{ song: Song }> = ({ song }) => {
  const { downloadSongToLibrary, removeSongDownload } = useMusicStore();

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song.isDownloaded) {
      await removeSongDownload(song.id);
    } else {
      await downloadSongToLibrary(song.id);
    }
  };

  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
      className="flex items-center justify-between p-3 rounded-md group"
    >
      <div className="flex items-center space-x-4">
        {song.artwork ? (
          <img 
            src={song.artwork} 
            alt={song.title} 
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
            <Music size={20} className="text-gray-400" />
          </div>
        )}
        <div>
          <h3 className="font-medium text-gray-900">{song.title}</h3>
          <p className="text-sm text-gray-500">{song.artist}</p>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className={`p-2 rounded-full 
          ${song.isDownloaded 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-900 text-white'} 
          opacity-0 group-hover:opacity-100 transition-opacity`}
      >
        {song.isDownloaded ? <Check size={20} /> : <Download size={20} />}
      </button>
    </motion.div>
  );
};