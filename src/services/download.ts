import { Song } from '../types/music';

export const downloadSong = async (song: Song): Promise<string> => {
  try {
    const response = await fetch(song.sourceUrl);
    const blob = await response.blob();
    
    // Store in IndexedDB
    const db = await openDB();
    const objectStore = db
      .transaction(['songs'], 'readwrite')
      .objectStore('songs');
    
    await objectStore.put({
      id: song.id,
      blob,
      timestamp: Date.now()
    });

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error downloading song:', error);
    throw error;
  }
};

export const loadOfflineSong = async (songId: string): Promise<string | null> => {
  try {
    const db = await openDB();
    const objectStore = db
      .transaction(['songs'], 'readonly')
      .objectStore('songs');
    
    const result = await objectStore.get(songId);
    if (!result) return null;
    
    return URL.createObjectURL(result.blob);
  } catch (error) {
    console.error('Error loading offline song:', error);
    return null;
  }
};

export const deleteSongFromStorage = async (songId: string): Promise<void> => {
  try {
    const db = await openDB();
    const objectStore = db
      .transaction(['songs'], 'readwrite')
      .objectStore('songs');
    
    await objectStore.delete(songId);
  } catch (error) {
    console.error('Error deleting offline song:', error);
    throw error;
  }
};

// IndexedDB setup
const openDB = async () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('xora-music', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('songs')) {
        db.createObjectStore('songs', { keyPath: 'id' });
      }
    };
  });
};