import { Song } from '../types/music';

export const setupMediaSession = (
  song: Song,
  {
    onPlay,
    onPause,
    onPreviousTrack,
    onNextTrack,
  }: {
    onPlay: () => void;
    onPause: () => void;
    onPreviousTrack: () => void;
    onNextTrack: () => void;
  }
) => {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album,
      artwork: song.artwork ? [
        {
          src: song.artwork,
          sizes: '512x512',
          type: 'image/jpeg'
        }
      ] : undefined
    });

    navigator.mediaSession.setActionHandler('play', onPlay);
    navigator.mediaSession.setActionHandler('pause', onPause);
    navigator.mediaSession.setActionHandler('previoustrack', onPreviousTrack);
    navigator.mediaSession.setActionHandler('nexttrack', onNextTrack);
  }
};