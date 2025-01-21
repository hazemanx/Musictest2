import create from 'zustand';
import { persist } from 'zustand/middleware';
import { Song, Playlist, EQSettings, PlaybackSettings } from '../types/music';
import { downloadSong, loadOfflineSong, deleteSongFromStorage } from '../services/download';

interface MusicStore {
  library: Song[];
  playlists: Playlist[];
  currentSong: Song | null;
  queue: Song[];
  playbackSettings: PlaybackSettings;
  eqSettings: EQSettings[];
  currentEQ: EQSettings | null;
  isPlaying: boolean;
  
  // Actions
  addToLibrary: (song: Song) => void;
  createPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, song: Song) => void;
  updateSongMetadata: (songId: string, updates: Partial<Song>) => void;
  setPlaybackSettings: (settings: Partial<PlaybackSettings>) => void;
  setCurrentEQ: (eq: EQSettings) => void;
  togglePlayPause: () => void;
  setCurrentSong: (song: Song | null) => void;
  downloadSongToLibrary: (songId: string) => Promise<void>;
  removeSongDownload: (songId: string) => Promise<void>;
  removeFromLibrary: (songId: string) => void;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      library: [],
      playlists: [],
      currentSong: null,
      queue: [],
      playbackSettings: {
        speed: 1,
        pitch: 0,
        volume: 1,
        repeat: 'none',
        shuffle: false,
      },
      eqSettings: [],
      currentEQ: null,
      isPlaying: false,

      addToLibrary: (song) =>
        set((state) => ({ library: [...state.library, song] })),

      createPlaylist: (name) =>
        set((state) => ({
          playlists: [
            ...state.playlists,
            {
              id: Date.now().toString(),
              name,
              songs: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),

      addToPlaylist: (playlistId, song) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? { ...playlist, songs: [...playlist.songs, song] }
              : playlist
          ),
        })),

      updateSongMetadata: (songId, updates) =>
        set((state) => ({
          library: state.library.map((song) =>
            song.id === songId ? { ...song, ...updates } : song
          ),
        })),

      setPlaybackSettings: (settings) =>
        set((state) => ({
          playbackSettings: { ...state.playbackSettings, ...settings },
        })),

      setCurrentEQ: (eq) => set({ currentEQ: eq }),

      togglePlayPause: () =>
        set((state) => ({ isPlaying: !state.isPlaying })),

      setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),

      downloadSongToLibrary: async (songId) => {
        const state = get();
        const song = state.library.find(s => s.id === songId);
        if (!song) return;

        try {
          const offlineUrl = await downloadSong(song);
          set((state) => ({
            library: state.library.map((s) =>
              s.id === songId
                ? { ...s, isDownloaded: true, offlineUrl }
                : s
            ),
          }));
        } catch (error) {
          console.error('Failed to download song:', error);
        }
      },

      removeSongDownload: async (songId) => {
        try {
          await deleteSongFromStorage(songId);
          set((state) => ({
            library: state.library.map((s) =>
              s.id === songId
                ? { ...s, isDownloaded: false, offlineUrl: undefined }
                : s
            ),
          }));
        } catch (error) {
          console.error('Failed to remove song download:', error);
        }
      },

      removeFromLibrary: (songId) =>
        set((state) => ({
          library: state.library.filter((song) => song.id !== songId),
          currentSong: state.currentSong?.id === songId ? null : state.currentSong,
        })),
    }),
    {
      name: 'xora-music-storage',
    }
  )
);