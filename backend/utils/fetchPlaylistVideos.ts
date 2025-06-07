import axios from 'axios';
import { Playlist, Video, Chapter } from '../model/Course';

const API_KEY = process.env.YT_KEY;

// ✅ Fetch a single video by ID
export async function fetchVideo(id: string): Promise<Video> {
  const { data } = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: {
      part: 'snippet',
      id,
      key: API_KEY,
    },
  });

  const videoData = data.items[0]?.snippet;

  if (!videoData) {
    throw new Error(`Video not found for ID: ${id}`);
  }

  const videoMetaData:Video = {
    videoId: id,
    title: videoData.title,
    description: videoData.description,
    publishedAt: videoData.publishedAt,
    chapters: extractChaptersFromDescription(videoData.description),
    thumbnails: {
      low: videoData.thumbnails?.default?.url ?? '',
      high: videoData.thumbnails?.high?.url ?? '',
      max: videoData.thumbnails?.maxres?.url ?? videoData.thumbnails?.standard?.url ?? '',
    },
    position: -1,
  };

  return videoMetaData; 
}

// ✅ Fetch and format all videos in a playlist, plus playlist metadata
export async function fetchFormattedPlaylistVideos(playlistId: string): Promise<Playlist> {
  let nextPageToken = '';
  const videos: Video[] = [];

  // First: fetch the playlist metadata (title, description)
  const playlistRes = await axios.get('https://www.googleapis.com/youtube/v3/playlists', {
    params: {
      part: 'snippet',
      id: playlistId,
      key: API_KEY,
    },
  });

  const playlistSnippet = playlistRes.data.items[0]?.snippet;

  if (!playlistSnippet) {
    throw new Error(`Playlist not found for ID: ${playlistId}`);
  }

  // Loop through paginated videos in the playlist
  do {
    const videoRes = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet',
        playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
        key: API_KEY,
      },
    });

    for (const item of videoRes.data.items) {
      const snippet = item.snippet;

      const video: Video = {
        videoId: snippet.resourceId.videoId,
        title: snippet.title,
        description: snippet.description,
        publishedAt: snippet.publishedAt,
        chapters: extractChaptersFromDescription(snippet.description),
        thumbnails: {
          low: snippet.thumbnails?.default?.url ?? '',
          high: snippet.thumbnails?.high?.url ?? '',
          max: snippet.thumbnails?.maxres?.url ?? snippet.thumbnails?.standard?.url ?? '',
        },
        position: snippet.position ?? 0,
      };

      videos.push(video);
    }

    nextPageToken = videoRes.data.nextPageToken;
  } while (nextPageToken);

  // Construct and return full playlist object
  const playlist: Playlist = {
    title: playlistSnippet.title,
    description: playlistSnippet.description,
    playListId: playlistId,
    tags: [], // YouTube playlists do not have tags
    playlistThumbnail: playlistSnippet.thumbnails?.high?.url ?? '',
    videos,
    orderedId: 0,
  };

  return playlist;
}

// ✅ Extract timestamps as chapters
export function extractChaptersFromDescription(description: string): Chapter[] {
  const lines = description.split(/\r?\n/);
  const chapterRegex = /^(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)/;
  const chapters: Chapter[] = [];

  for (const line of lines) {
    const match = line.match(chapterRegex);
    if (!match) continue;

    const rawTimestamp = match[1];
    const title = match[2];
    const timeParts = rawTimestamp.split(':').map(Number).reverse();

    let startTime = 0;
    if (timeParts.length >= 1) startTime += timeParts[0];         // seconds
    if (timeParts.length >= 2) startTime += timeParts[1] * 60;    // minutes
    if (timeParts.length === 3) startTime += timeParts[2] * 3600; // hours

    chapters.push({ title, startTime, rawTimestamp });
  }

  return chapters;
}
