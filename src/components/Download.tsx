import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download as DownloadIcon, 
  Smartphone, 
  Laptop, 
  Music, 
  Radio, 
  Share2, 
  Shield, 
  Disc,
  Headphones,
  Wifi,
  HardDrive
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface DownloadProps {}

export const Download: React.FC<DownloadProps> = () => {
  const { isDarkMode } = useThemeStore();
  
  const features = [
    {
      icon: HardDrive,
      title: 'Local Storage',
      description: 'Your music stays on your device, just like an iPod - no cloud sync needed'
    },
    {
      icon: Wifi,
      title: 'No Internet Required',
      description: 'Play your music offline, anytime and anywhere'
    },
    {
      icon: Headphones,
      title: 'Advanced Playback',
      description: 'Control speed and pitch, create playlists, and customize your experience'
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share songs with friends via local file transfer'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${
        isDarkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-white text-gray-900'
      }`}
    >
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img 
              src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/xora-music-logo.png"
              alt="XORA Music"
              className="h-24 w-auto mx-auto mb-8"
            />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Your Personal Music Player</h1>
          <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Experience music like it's 2001 - simple, offline, and all yours
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-lg flex items-center space-x-2 ${
                isDarkMode 
                  ? 'bg-white text-gray-900 hover:bg-gray-100' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
              onClick={() => {
                if ('beforeinstallprompt' in window) {
                  window.dispatchEvent(new Event('beforeinstallprompt'));
                }
              }}
            >
              <Smartphone size={24} />
              <span>Install Mobile App</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-lg flex items-center space-x-2 ${
                isDarkMode 
                  ? 'bg-white text-gray-900 hover:bg-gray-100' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
              onClick={() => {
                if ('beforeinstallprompt' in window) {
                  window.dispatchEvent(new Event('beforeinstallprompt'));
                }
              }}
            >
              <Laptop size={24} />
              <span>Install Desktop App</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Music, Your Device</h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              No cloud sync, no subscriptions - just like your old iPod, but better
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                } shadow-lg`}
              >
                <feature.icon size={32} className="mb-4 text-blue-500" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* System Requirements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">System Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <h3 className="text-xl font-semibold mb-4">Mobile</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Smartphone size={20} />
                <span>iOS 13+ or Android 8+</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield size={20} />
                <span>500MB free storage for app and music</span>
              </li>
              <li className="flex items-center space-x-2">
                <Music size={20} />
                <span>Supports MP3, WAV, and M4A files</span>
              </li>
            </ul>
          </div>
          
          <div className={`p-6 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <h3 className="text-xl font-semibold mb-4">Desktop</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Laptop size={20} />
                <span>Modern web browser (Chrome, Firefox, Safari, Edge)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Shield size={20} />
                <span>1GB free storage for music library</span>
              </li>
              <li className="flex items-center space-x-2">
                <Disc size={20} />
                <span>Local file system access for music import</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};