import React from 'react';
import { useMusicStore } from '../store/musicStore';
import { motion } from 'framer-motion';
import { FastForward, Rewind } from 'lucide-react';

export const PlaybackControl: React.FC = () => {
  const { playbackSettings, setPlaybackSettings } = useMusicStore();

  const handleSpeedChange = (delta: number) => {
    setPlaybackSettings({
      speed: Math.max(0.5, Math.min(2, playbackSettings.speed + delta))
    });
  };

  const handlePitchChange = (delta: number) => {
    setPlaybackSettings({
      pitch: Math.max(-12, Math.min(12, playbackSettings.pitch + delta))
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white rounded-lg shadow-sm"
    >
      <h2 className="text-xl font-bold mb-6">Playback Control</h2>

      <div className="space-y-6">
        {/* Speed Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Speed: {playbackSettings.speed.toFixed(2)}x
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleSpeedChange(-0.05)}
              className="p-2 rounded-full bg-gray-100"
            >
              <Rewind size={20} className="text-gray-600" />
            </button>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={playbackSettings.speed}
              onChange={(e) => setPlaybackSettings({ speed: parseFloat(e.target.value) })}
              className="flex-1"
            />
            <button
              onClick={() => handleSpeedChange(0.05)}
              className="p-2 rounded-full bg-gray-100"
            >
              <FastForward size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Pitch Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pitch: {playbackSettings.pitch > 0 ? '+' : ''}{playbackSettings.pitch} semitones
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handlePitchChange(-1)}
              className="p-2 rounded-full bg-gray-100"
            >
              <Rewind size={20} className="text-gray-600" />
            </button>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={playbackSettings.pitch}
              onChange={(e) => setPlaybackSettings({ pitch: parseInt(e.target.value) })}
              className="flex-1"
            />
            <button
              onClick={() => handlePitchChange(1)}
              className="p-2 rounded-full bg-gray-100"
            >
              <FastForward size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};