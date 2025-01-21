import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  MoreVertical, 
  PlayCircle, 
  PauseCircle, 
  PlusCircle, 
  Download, 
  Trash2, 
  Check, 
  Heart,
  Share,
  Radio,
  ListMusic
} from 'lucide-react';
import { Song } from '../types/music';
import { useMusicStore } from '../store/musicStore';

export const SongCard: React.FC<{ song: Song; variant?: 'grid' | 'list' }> = ({ 
  song, 
  variant = 'grid' 
}) => {
  const { 
    downloadSongToLibrary, 
    removeSongDownload, 
    setCurrentSong, 
    currentSong, 
    isPlaying, 
    togglePlayPause, 
    playlists, 
    addToPlaylist,
    toggleLike,
    addToQueue
  } = useMusicStore();
  
  const [showMenu, setShowMenu] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isCurrentSong = currentSong?.id === song.id;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentSong) {
      togglePlayPause();
    } else {
      setCurrentSong(song);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song.isDownloaded) {
      await removeSongDownload(song.id);
    } else {
      await downloadSongToLibrary(song.id);
    }
  };

  const handleAddToPlaylist = (e: React.MouseEvent, playlistId: string) => {
    e.stopPropagation();
    addToPlaylist(playlistId, song);
    setShowPlaylists(false);
    setShowMenu(false);
  };

  if (variant === 'list') {
    return (
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowMenu(false);
        }}
        className={`group flex items-center p-3 rounded-lg hover:bg-gray-50 ${
          isCurrentSong ? 'bg-blue-50' : ''
        }`}
      >
        <div className="relative flex-shrink-0 w-12 h-12">
          {song.artwork ? (
            <img 
              src={song.artwork} 
              alt={song.title} 
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
              <Music size={20} className="text-gray-400" />
            </div>
          )}
          
          <AnimatePresence>
            {(isHovered || isCurrentSong) && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md"
              >
                {isCurrentSong && isPlaying ? (
                  <PauseCircle size={24} className="text-white" />
                ) : (
                  <PlayCircle size={24} className="text-white" />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 min-w-0 ml-4">
          <h3 className="font-medium text-gray-900 truncate">{song.title}</h3>
          <p className="text-sm text-gray-500 truncate">{song.artist}</p>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <button
                onClick={() => toggleLike(song.id)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Heart 
                  size={20} 
                  className={song.isLiked ? 'text-red-500 fill-current' : 'text-gray-400'} 
                />
              </button>
              <button
                onClick={() => addToQueue(song)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ListMusic size={20} className="text-gray-400" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="relative p-2 rounded-full hover:bg-gray-100"
              >
                <MoreVertical size={20} className="text-gray-400" />
                {showMenu && (
                  <ContextMenu 
                    song={song}
                    onClose={() => setShowMenu(false)}
                    onAddToPlaylist={handleAddToPlaylist}
                    onDownload={handleDownload}
                    playlists={playlists}
                  />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
      className="bg-white rounded-lg shadow-sm overflow-hidden group"
      whileHover={{ y: -2 }}
      transition={{ type: "tween" }}
    >
      {/* Artwork Section */}
      <div className="relative aspect-square">
        {song.artwork ? (
          <img 
            src={song.artwork} 
            alt={song.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Music size={40} className="text-gray-400" />
          </div>
        )}
        
        {/* Hover Overlay */}
        <AnimatePresence>
          {(isHovered || isCurrentSong) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleLike(song.id)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <Heart 
                    size={24} 
                    className={song.isLiked ? 'text-red-500 fill-current' : 'text-white'} 
                  />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="transform hover:scale-110 transition-transform"
                >
                  {isCurrentSong && isPlaying ? (
                    <PauseCircle size={54} className="text-white" />
                  ) : (
                    <PlayCircle size={54} className="text-white" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <MoreVertical size={24} className="text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate hover:text-blue-600 cursor-pointer">
          {song.title}
        </h3>
        <p className="text-sm text-gray-500 truncate hover:text-gray-700 cursor-pointer">
          {song.artist}
        </p>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {showMenu && (
          <ContextMenu 
            song={song}
            onClose={() => setShowMenu(false)}
            onAddToPlaylist={handleAddToPlaylist}
            onDownload={handleDownload}
            playlists={playlists}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ContextMenu: React.FC<{
  song: Song;
  onClose: () => void;
  onAddToPlaylist: (e: React.MouseEvent, playlistId: string) => void;
  onDownload: (e: React.MouseEvent) => void;
  playlists: Array<{ id: string; name: string; }>;
}> = ({ song, onClose, onAddToPlaylist, onDownload, playlists }) => {
  const [showPlaylists, setShowPlaylists] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2 space-y-1">
        <MenuItem
          icon={ListMusic}
          label="Add to Queue"
          onClick={() => {
            // Add to queue logic
            onClose();
          }}
        />
        <MenuItem
          icon={PlusCircle}
          label="Add to Playlist"
          onClick={() => setShowPlaylists(true)}
        />
        <MenuItem
          icon={Radio}
          label="Create Station"
          onClick={() => {
            // Create station logic
            onClose();
          }}
        />
        <MenuItem
          icon={Share}
          label="Share Song"
          onClick={() => {
            // Share logic
            onClose();
          }}
        />
        <MenuItem
          icon={song.isDownloaded ? Check : Download}
          label={song.isDownloaded ? "Downloaded" : "Download"}
          onClick={onDownload}
        />
        <div className="border-t border-gray-200 my-1" />
        <MenuItem
          icon={Trash2}
          label="Remove from Library"
          className="text-red-600 hover:bg-red-50"
          onClick={() => {
            // Remove logic
            onClose();
          }}
        />
      </div>

      {/* Playlists Submenu */}
      <AnimatePresence>
        {showPlaylists && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute right-full top-0 w-56 bg-white rounded-lg shadow-xl -mr-2"
          >
            <div className="p-2 space-y-1">
              {playlists.map(playlist => (
                <MenuItem
                  key={playlist.id}
                  icon={ListMusic}
                  label={playlist.name}
                  onClick={(e) => onAddToPlaylist(e, playlist.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MenuItem: React.FC<{
  icon: React.ElementType;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}> = ({ icon: Icon, label, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`w-full px-3 py-2 text-sm flex items-center space-x-3 rounded-md hover:bg-gray-100 ${className}`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);