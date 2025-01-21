import React from 'react';
import { NavLink } from 'react-router-dom';
import { Library, ListMusic, Search, Settings, Moon, Sun, Plus, Download as DownloadIcon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { FileImport } from './FileImport';

export const Sidebar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [showImport, setShowImport] = React.useState(false);

  return (
    <div className={`w-64 h-full ${
      isDarkMode 
        ? 'bg-gray-900 text-white border-gray-800' 
        : 'bg-white text-gray-900 border-gray-200'
    } border-r shadow-xl`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <img 
            src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/xora-music-logo.png" 
            alt="XORA Music" 
            className="h-8 w-auto"
          />
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 px-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 ${
              isDarkMode 
                ? `hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300'}`
                : `hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-medium' : 'text-gray-700'}`
            }`
          }
        >
          <Library size={20} />
          <span>Library</span>
        </NavLink>

        <NavLink
          to="/playlists"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 ${
              isDarkMode 
                ? `hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300'}`
                : `hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-medium' : 'text-gray-700'}`
            }`
          }
        >
          <ListMusic size={20} />
          <span>Playlists</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 ${
              isDarkMode 
                ? `hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300'}`
                : `hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-medium' : 'text-gray-700'}`
            }`
          }
        >
          <Search size={20} />
          <span>Search</span>
        </NavLink>

        <NavLink
          to="/download"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 ${
              isDarkMode 
                ? `hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300'}`
                : `hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-medium' : 'text-gray-700'}`
            }`
          }
        >
          <DownloadIcon size={20} />
          <span>Download App</span>
        </NavLink>

        <button
          onClick={() => setShowImport(true)}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 ${
            isDarkMode 
              ? 'text-gray-300 hover:bg-gray-800'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Plus size={20} />
          <span>Import Music</span>
        </button>
      </nav>

      <div className={`p-6 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg ${
              isDarkMode 
                ? `hover:bg-gray-800 ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300'}`
                : `hover:bg-gray-100 ${isActive ? 'bg-gray-100 font-medium' : 'text-gray-700'}`
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>

      {/* Import Dialog */}
      {showImport && (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50`}>
          <div className={`${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          } rounded-lg shadow-xl max-w-2xl w-full mx-4`}>
            <div className="p-6">
              <FileImport onClose={() => setShowImport(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};