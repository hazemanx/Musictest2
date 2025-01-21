import React, { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Settings, Repeat, Repeat1, Shuffle, Heart, FastForward, Rewind } from 'lucide-react';
import { useMusicStore } from '../store/musicStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

export const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { currentSong, playbackSettings, isPlaying, togglePlayPause, setPlaybackSettings } = useMusicStore();
  const { isDarkMode } = useThemeStore();
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const previousVolume = useRef(playbackSettings.volume);
  const [showPlaybackControls, setShowPlaybackControls] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    if (currentSong) {
      audio.src = currentSong.sourceUrl;
      audio.volume = playbackSettings.volume;
      audio.playbackRate = playbackSettings.speed;
      
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback failed:", error);
          });
        }
      }

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      audio.addEventListener('ended', () => {
        if (playbackSettings.repeat === 'one') {
          audio.currentTime = 0;
          audio.play();
        } else {
          togglePlayPause();
        }
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playbackSettings.volume;
    }
  }, [playbackSettings.volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSettings.speed;
    }
  }, [playbackSettings.speed]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback failed:", error);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setPlaybackSettings({ volume: newVolume });
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setPlaybackSettings({ volume: previousVolume.current });
      setIsMuted(false);
    } else {
      previousVolume.current = playbackSettings.volume;
      setPlaybackSettings({ volume: 0 });
      setIsMuted(true);
    }
  };

  const toggleRepeat = () => {
    const nextRepeat = playbackSettings.repeat === 'none' 
      ? 'all' 
      : playbackSettings.repeat === 'all' 
        ? 'one' 
        : 'none';
    setPlaybackSettings({ repeat: nextRepeat });
  };

  const toggleShuffle = () => {
    setPlaybackSettings({ shuffle: !playbackSettings.shuffle });
  };

  const getRepeatIcon = () => {
    switch (playbackSettings.repeat) {
      case 'one':
        return <Repeat1 size={20} className="text-blue-500" />;
      case 'all':
        return <Repeat size={20} className="text-blue-500" />;
      default:
        return <Repeat size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />;
    }
  };

  const handleSpeedChange = (delta: number) => {
    const newSpeed = Math.max(0.5, Math.min(2, playbackSettings.speed + delta));
    setPlaybackSettings({ speed: newSpeed });
  };

  const handlePitchChange = (delta: number) => {
    const newPitch = Math.max(-12, Math.min(12, playbackSettings.pitch + delta));
    setPlaybackSettings({ pitch: newPitch });
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`fixed bottom-0 w-full ${
        isDarkMode 
          ? 'bg-gray-900/90 backdrop-blur-lg border-gray-800' 
          : 'bg-white/90 backdrop-blur-lg border-gray-200'
      } border-t p-4`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center space-x-4 w-1/4">
            {currentSong?.artwork && (
              <img 
                src={currentSong.artwork} 
                alt={currentSong.title} 
                className="w-14 h-14 rounded-lg shadow-lg"
              />
            )}
            <div>
              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentSong?.title || 'No song selected'}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentSong?.artist || 'Select a song to play'}
              </p>
            </div>
            <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
              <Heart size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center w-1/2">
            <div className="flex items-center space-x-6 mb-4">
              <button 
                onClick={toggleShuffle}
                className={`${playbackSettings.shuffle ? 'text-blue-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                <Shuffle size={20} />
              </button>
              <button className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                <SkipBack size={20} />
              </button>
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-white text-gray-900 hover:bg-gray-200' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
                onClick={togglePlayPause}
                disabled={!currentSong}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                <SkipForward size={20} />
              </button>
              <button 
                onClick={toggleRepeat}
                className="transition-colors duration-200"
              >
                {getRepeatIcon()}
              </button>
            </div>
            <div className="w-full flex items-center space-x-3">
              <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleTimeChange}
                className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${isDarkMode ? '#fff' : '#000'} ${(currentTime / (duration || 1)) * 100}%, #9CA3AF ${(currentTime / (duration || 1)) * 100}%)`
                }}
              />
              <span className="text-sm text-gray-500">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume & Settings */}
          <div className="flex items-center space-x-4 w-1/4 justify-end">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={playbackSettings.volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${isDarkMode ? '#fff' : '#000'} ${playbackSettings.volume * 100}%, #9CA3AF ${playbackSettings.volume * 100}%)`
                }}
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowPlaybackControls(!showPlaybackControls)}
                className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <Settings size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>

              {/* Playback Controls Popup */}
              <AnimatePresence>
                {showPlaybackControls && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute bottom-full right-0 mb-2 p-4 rounded-lg shadow-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="space-y-4 min-w-[200px]">
                      {/* Speed Control */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Speed: {playbackSettings.speed.toFixed(2)}x
                        </label>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSpeedChange(-0.05)}
                            className={`p-1 rounded ${
                              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                          >
                            <Rewind size={16} />
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
                            className={`p-1 rounded ${
                              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                          >
                            <FastForward size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Pitch Control */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Pitch: {playbackSettings.pitch > 0 ? '+' : ''}{playbackSettings.pitch} semitones
                        </label>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePitchChange(-1)}
                            className={`p-1 rounded ${
                              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                          >
                            <Rewind size={16} />
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
                            className={`p-1 rounded ${
                              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                          >
                            <FastForward size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};