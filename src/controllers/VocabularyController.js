import { Vocabulary } from '../models/Vocabulary.js';

export const getAllVocab = async (req, res) => {
  try {
    const vocabs = await Vocabulary.findAll();

    if (vocabs && vocabs.length > 0) {
      res.status(200).json(vocabs);
    } else {
      res.status(404).json({ message: 'No vocabs found' });
    }
  } catch (error) {
    console.error('Error fetching vocabs:', error);
    res.status(500).json({ error: 'Failed to fetch vocabs' });
  }
};

export const createVocab = async (req, res) => {
  try {
    const { vocab, thai, definition } = req.body;

    if (!vocab || !thai || !definition) {
      return res.status(400).json({ message: 'Please fill in all info' });
    }

    const existingVocab = await Vocabulary.findOne({ where: { vocab } });

    if (existingVocab) {
      return res.status(409).json({ message: 'This vocabulary already exists' });
    }

    const vocabData = {
      vocab,
      thai,
      definition,
    };

    console.log("Creating vocabulary with data:", JSON.stringify(vocabData, null, 2));

    const newVocab = await Vocabulary.create(vocabData);

    return res.status(201).json({
      message: 'Vocabulary created successfully',
      user: { id: newVocab.id, title: newVocab.title },
    });
  } catch (error) {
    console.error('Create vocab error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์' });
  }
};

export default {
  getAllVocab,
  createVocab
};
