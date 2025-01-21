import axios from 'axios';

interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high: {
        url: string;
        width: number;
        height: number;
      };
    };
  };
  contentDetails?: {
    duration: string;
  };
}

// Replace this with your new API key
const YOUTUBE_API_KEY = 'AIzaSyDp22AMPStEKU8arhEtJ-2T1Mmz_H2qj7Y';

export const searchYoutube = async (query: string) => {
  if (!query.trim()) {
    return [];
  }

  try {
    const searchResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 10,
        q: `${query} music`,
        type: 'video',
        videoCategoryId: '10',
        key: YOUTUBE_API_KEY
      }
    });

    if (!searchResponse.data.items?.length) {
      return [];
    }

    const videoIds = searchResponse.data.items.map((item: YouTubeSearchResult) => item.id.videoId);
    const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'contentDetails',
        id: videoIds.join(','),
        key: YOUTUBE_API_KEY
      }
    });

    return searchResponse.data.items.map((item: YouTubeSearchResult, index: number) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnails: {
        high: {
          url: item.snippet.thumbnails.high.url,
          width: item.snippet.thumbnails.high.width,
          height: item.snippet.thumbnails.high.height
        }
      },
      duration: detailsResponse.data.items[index]?.contentDetails?.duration || '0:00',
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error?.message || 'YouTube search failed';
      throw new Error(message);
    }
    throw new Error('Failed to search YouTube');
  }
};