import { TestQuestions, TestChoices } from '../models/associations.js';

export const getTest = async (req, res) => {
  try {
    const testQuestions = await TestQuestions.findAll({
      include: [
        {
          model: TestChoices,
          as: "choices",
          attributes: ["id", "choice_text", "correct"],
        },
      ],
      attributes: ["id", "question"],
    });

    return res.status(200).json(testQuestions);
  } catch (err) {
    console.error("Error fetching test questions:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTestsForVideo = async (req, res) => {
  const { videoId } = req.params;

  try {
    const tests = await TestQuestions.findAll({
      where: {
        course_type: 'video',
        course_id: videoId,
      },
      include: [
        {
          model: TestChoices,
          as: 'choices',
          attributes: ['id', 'choice_text', 'correct'],
        },
      ],
    });

    if (!tests || tests.length === 0) {
      return res.status(404).json({ message: 'No tests found for this video' });
    }

    res.status(200).json(tests);
  } catch (error) {
    console.error('Error fetching tests for video:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getTestsForArticle = async (req, res) => {
  const { articleId } = req.params;

  try {
    const tests = await TestQuestions.findAll({
      where: {
        course_type: 'article',
        course_id: articleId,
      },
      include: [
        {
          model: TestChoices,
          as: 'choices',
          attributes: ['id', 'choice_text', 'correct'],
        },
      ],
    });

    if (!tests || tests.length === 0) {
      return res.status(404).json({ message: 'No tests found for this article' });
    }

    res.status(200).json(tests);
  } catch (error) {
    console.error('Error fetching tests for article:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createTest = async (req, res) => {
  const { question, course_type, course_id, choices } = req.body;

  try {
    if (!question || !course_id || !choices || !Array.isArray(choices)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const newQuestion = await TestQuestions.create({
      question,
      course_type,
      course_id,
    });

    const choiceRecords = choices.map((choice) => ({
      question_id: newQuestion.id,
      choice_text: choice.choice_text,
      correct: choice.correct || false,
    }));

    await TestChoices.bulkCreate(choiceRecords);

    const savedQuestion = await TestQuestions.findByPk(newQuestion.id, {
      include: [
        {
          model: TestChoices,
          as: "choices",
          attributes: ["id", "choice_text", "correct"],
        },
      ],
      attributes: ["id", "question", "course_type", "course_id"],
    });

    return res.status(201).json(savedQuestion);
  } catch (err) {
    console.error("Error creating test question:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getTest,
  getTestsForVideo,
  getTestsForArticle,
  createTest
};