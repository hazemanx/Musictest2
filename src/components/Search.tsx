import React, { useState } from 'react';
import { useMusicStore } from '../store/musicStore';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Youtube, AlertCircle } from 'lucide-react';
import { searchYoutube } from '../services/youtube';

export const Search: React.FC = () => {
  const { addToLibrary } = useMusicStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResults([]);
    
    try {
      const searchResults = await searchYoutube(query);
      setResults(searchResults);
      if (searchResults.length === 0) {
        setError('No results found');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToLibrary = (result: any) => {
    try {
      const song = {
        id: Date.now().toString(),
        title: result.title,
        artist: result.channelTitle,
        album: '',
        duration: result.duration,
        artwork: result.thumbnails.high.url,
        source: 'youtube' as const,
        sourceUrl: result.url,
      };
      
      addToLibrary(song);
    } catch (error) {
      setError('Failed to add song to library');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search YouTube</h1>

      <div className="mb-8">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError(null);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for music..."
                className="w-full px-4 py-2 border rounded-md pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Youtube size={20} className="text-gray-400" />
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-500 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {error}
              </p>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="px-4 py-2 bg-gray-900 text-white rounded-md flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SearchIcon size={20} />
            <span>{isLoading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <motion.div
              key={result.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <img
                src={result.thumbnails.high.url}
                alt={result.title}
                className="w-full aspect-video object-cover rounded-md mb-4"
              />
              <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{result.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{result.channelTitle}</p>
              <button
                onClick={() => handleAddToLibrary(result)}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Add to Library
              </button>
            </motion.div>
          ))}
        </div>
      ) : !isLoading && !error && (
        <div className="text-center text-gray-500 py-12">
          <Youtube size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Search YouTube for music to add to your library</p>
        </div>
      )}
    </motion.div>
  );
};