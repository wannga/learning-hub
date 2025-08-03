import { CaseStudy } from '../models/CaseStudy.js';

export const getAllCaseStudy = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.findAll({
      attributes: ['id', 'title', 'description', 'time', 'author', 'image', 'tag', 'link'],
      order: [['id', 'ASC']]
    });
    
    if (caseStudies && caseStudies.length > 0) {
      res.status(200).json(caseStudies);
    } else {
      res.status(404).json({ message: 'No case study found' });
    }
  } catch (error) {
    console.error('Error fetching caseStudies:', error);
    res.status(500).json({ error: 'Failed to fetch caseStudies' });
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

export default {
  getAllCaseStudy,
  getCaseStudyById,
};