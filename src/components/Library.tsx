import React, { useMemo, useState } from 'react';
import { Music, Plus, Search, Album, Mic2, Clock } from 'lucide-react';
import { useMusicStore } from '../store/musicStore';
import { motion } from 'framer-motion';
import { Song } from '../types/music';

type ViewMode = 'recent' | 'songs' | 'artists' | 'albums';

export const Library: React.FC = () => {
  const { library } = useMusicStore();
  const [viewMode, setViewMode] = useState<ViewMode>('recent');

  const organizedLibrary = useMemo(() => {
    const artists = new Map<string, Song[]>();
    const albums = new Map<string, Song[]>();
    const songs = [...library].sort((a, b) => a.title.localeCompare(b.title));
    const recent = [...library].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 20);

    library.forEach(song => {
      // Organize by artist
      const artist = song.artist || 'Unknown Artist';
      if (!artists.has(artist)) {
        artists.set(artist, []);
      }
      artists.get(artist)?.push(song);

      // Organize by album
      const album = song.album || 'Unknown Album';
      if (!albums.has(album)) {
        albums.set(album, []);
      }
      albums.get(album)?.push(song);
    });

    // Sort artists and their songs
    const sortedArtists = new Map([...artists.entries()].sort());
    sortedArtists.forEach(songs => songs.sort((a, b) => a.title.localeCompare(b.title)));

    // Sort albums and their songs
    const sortedAlbums = new Map([...albums.entries()].sort());
    sortedAlbums.forEach(songs => songs.sort((a, b) => a.title.localeCompare(b.title)));

    return { artists: sortedArtists, albums: sortedAlbums, songs, recent };
  }, [library]);

  const renderRecent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {organizedLibrary.recent.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </div>
  );

  const renderSongs = () => (
    <div className="space-y-2">
      {organizedLibrary.songs.map((song) => (
        <SongListItem key={song.id} song={song} />
      ))}
    </div>
  );

  const renderArtists = () => (
    <div className="space-y-8">
      {Array.from(organizedLibrary.artists).map(([artist, songs]) => (
        <div key={artist}>
          <h3 className="text-lg font-semibold mb-4">{artist}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAlbums = () => (
    <div className="space-y-8">
      {Array.from(organizedLibrary.albums).map(([album, songs]) => (
        <div key={album}>
          <h3 className="text-lg font-semibold mb-4">{album}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Library</h1>
        <div className="flex space-x-4">
          <button className="p-2 rounded-full bg-gray-100">
            <Search size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-100">
            <Plus size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        <ViewButton
          icon={Clock}
          label="Recent"
          active={viewMode === 'recent'}
          onClick={() => setViewMode('recent')}
        />
        <ViewButton
          icon={Music}
          label="Songs"
          active={viewMode === 'songs'}
          onClick={() => setViewMode('songs')}
        />
        <ViewButton
          icon={Mic2}
          label="Artists"
          active={viewMode === 'artists'}
          onClick={() => setViewMode('artists')}
        />
        <ViewButton
          icon={Album}
          label="Albums"
          active={viewMode === 'albums'}
          onClick={() => setViewMode('albums')}
        />
      </div>

      <div className="mt-6">
        {viewMode === 'recent' && renderRecent()}
        {viewMode === 'songs' && renderSongs()}
        {viewMode === 'artists' && renderArtists()}
        {viewMode === 'albums' && renderAlbums()}
      </div>
    </motion.div>
  );
};

const ViewButton: React.FC<{
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
      active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const SongCard: React.FC<{ song: Song }> = ({ song }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-lg shadow-sm p-4"
  >
    {song.artwork ? (
      <img 
        src={song.artwork} 
        alt={song.title} 
        className="w-full aspect-square object-cover rounded-md mb-4"
      />
    ) : (
      <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-4">
        <Music size={40} className="text-gray-400" />
      </div>
    )}
    <h3 className="font-medium text-gray-900">{song.title}</h3>
    <p className="text-sm text-gray-500">{song.artist}</p>
  </motion.div>
);

const SongListItem: React.FC<{ song: Song }> = ({ song }) => (
  <motion.div
    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
    className="flex items-center space-x-4 p-3 rounded-md"
  >
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
  </motion.div>
);