import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Library } from './components/Library';
import { Player } from './components/Player';
import { Sidebar } from './components/Sidebar';
import { Settings } from './components/Settings';
import { Search } from './components/Search';
import { Download } from './components/Download';
import { useThemeStore } from './store/themeStore';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const { isDarkMode } = useThemeStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <div className={`flex h-screen ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 text-gray-900'
      }`}>
        {/* Hamburger Menu */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`fixed top-4 left-4 z-50 p-2 rounded-lg ${
            isDarkMode 
              ? 'bg-gray-800 text-white hover:bg-gray-700' 
              : 'bg-white text-gray-900 hover:bg-gray-100'
          } shadow-lg`}
        >
          <Menu size={24} />
        </button>

        {/* Sidebar with animation */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
              className="fixed top-0 left-0 h-full z-40"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay for mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-30"
            />
          )}
        </AnimatePresence>

        {/* Main content with padding adjustment */}
        <main className={`flex-1 overflow-auto pb-24 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'ml-0'
        }`}>
          <div className="p-6 pt-16 md:pt-6">
            <Routes>
              <Route path="/" element={<Library />} />
              <Route path="/search" element={<Search />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/download" element={<Download />} />
            </Routes>
          </div>
        </main>
        <Player />
      </div>
    </Router>
  );
}