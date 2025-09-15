import { CaseStudy } from '../models/CaseStudy.js';
import { Buffer } from 'buffer';
import sharp from 'sharp';

export const getAllCaseStudy = async (req, res) => {
  try {
    const allCaseStudies = await CaseStudy.findAll();

    const processed = allCaseStudies.map(cs => ({
      ...cs.dataValues,
      image: cs.image
        ? Buffer.from(cs.image).toString("base64")
        : null,
    }));

    res.json(processed);
  } catch (error) {
    console.error("Error fetching case studies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCaseStudyById = async (req, res) => {
  const { caseStudyId } = req.params;

  try {
    const caseStudy = await CaseStudy.findByPk(caseStudyId);
    if (!caseStudy) {
      return res.status(404).json({ message: 'CaseStudy not found' });
    }
    res.status(200).json(caseStudy);
  } catch (error) {
    console.error('Error fetching caseStudy:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createCaseStudy = async (req, res) => {
  
  try {
    const { title, description, time, author, tag, link } = req.body;

    if (!title || !description || !time || !author || !link) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ 
        message: 'Please fill in all required fields',
        missing: {
          title: !title,
          description: !description,
          time: !time,
          author: !author,
          link: !link
        },
        received: req.body
      });
    }

    if (typeof CaseStudy === 'undefined') {
      console.log('CaseStudy model is not defined!');
      return res.status(500).json({ message: 'Server configuration error - CaseStudy model not found' });
    }

    const existingCaseStudy = await CaseStudy.findOne({ where: { title } });

    if (existingCaseStudy) {
      return res.status(409).json({ message: 'This case study title already exists' });
    }

    let imageBuffer = null;
    if (req.file) {
      try {
        imageBuffer = await sharp(req.file.buffer)
          .resize(800, 600, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .jpeg({ quality: 80 })
          .toBuffer();
      } catch (error) {
        imageBuffer = req.file.buffer;
      }
    }

    const newCaseStudy = await CaseStudy.create({
      title,
      description,
      time,
      author,
      image: imageBuffer,
      tag: tag ? tag.split(',').map(t => t.trim()) : [],
      link
    });

    return res.status(201).json({
      message: 'Case study created successfully',
      user: { id: newCaseStudy.id, title: newCaseStudy.title }
    });
  } catch (error) {
    console.error('Create case study error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์' });
  }
};

export default {
  getAllCaseStudy,
  getCaseStudyById,
  createCaseStudy
};