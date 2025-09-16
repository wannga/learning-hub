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

export const createVideo = async (req, res) => {
  try {
    const { title, description, time, creator, tag, link, objective, target, level } = req.body;

    if (!title || !description || !time || !creator || !link) {
      return res.status(400).json({ message: 'Please fill in all info' });
    }

    const existingVideo = await Videos.findOne({ where: { title } });

    if (existingVideo) {
      return res.status(409).json({ message: 'This video title already exists' });
    }

    let formattedTag = null;
    
    if (tag) {
      if (Array.isArray(tag)) {
        formattedTag = tag
          .filter(t => t && typeof t === 'string' && t.trim() !== '')
          .map(t => String(t).trim());
      } else if (typeof tag === 'string' && tag.trim() !== '') {
        formattedTag = tag.split(',')
          .map(t => String(t).trim())
          .filter(t => t !== '');
      }
    }

    if (!formattedTag || formattedTag.length === 0) {
      formattedTag = [];
    }

    const videoData = {
      title,
      description,
      time,
      creator,
      link,
      objective,
      target,
      level,
    };

    if (formattedTag.length > 0) {
      videoData.tag = formattedTag;
    }

    const newVideo = await Videos.create(videoData);

    return res.status(201).json({
      message: 'Video created successfully',
      user: { id: newVideo.id, title: newVideo.title },
    });
  } catch (error) {
    console.error('Create video error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์' });
  }
};

export default {
  getAllVideos,
  getVideoById,
  createVideo
};
