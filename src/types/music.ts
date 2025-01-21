export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  artwork: string;
  source: 'local' | 'youtube' | 'soundcloud';
  sourceUrl: string;
  localPath?: string;
  isDownloaded?: boolean;
  offlineUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EQSettings {
  id: string;
  name: string;
  bands: {
    frequency: number;
    gain: number;
  }[];
}

export interface PlaybackSettings {
  speed: number;
  pitch: number;
  volume: number;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
}