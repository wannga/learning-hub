import { Videos } from '../models/Videos.js';

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Videos.findAll();

    if (videos && videos.length > 0) {
      res.status(200).json(videos);
    } else {
      res.status(404).json({ message: 'No videos found' });
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

export const getVideoById = async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Videos.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {
  getAllVideos,
  getVideoById,
};
