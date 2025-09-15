import { Questions, Choices } from '../models/associations.js';

export const getQuiz = async (req, res) => {
  try {
    const questions = await Questions.findAll({
      include: [
        {
          model: Choices,
          as: "choices",
          attributes: ["id", "choice_text", "score"],
        },
      ],
      attributes: ["id", "question"],
    });

    return res.status(200).json(questions);
  } catch (err) {
    console.error("Error fetching quiz questions:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getQuiz,
};