import { UserTestScores } from "../models/UserTestScores.js";

export const saveTestScore = async (req, res) => {
  const { userId } = req.params;
  const { courseType, courseId, score } = req.body;

  try {
    const existingRecord = await UserTestScores.findOne({
      where: {
        user_id: userId,
        course_type: courseType,
        course_id: courseId,
      }
    });

    let record;
    let created = false;

    if (existingRecord) {
      await existingRecord.update({
        score: score,
        taken_at: new Date(),
      });
      record = existingRecord;
    } else {
      record = await UserTestScores.create({
        user_id: userId,
        course_type: courseType,
        course_id: courseId,
        score: score,
        taken_at: new Date(),
      });
      created = true;
    }

    res.status(200).json({
      message: created ? "Score saved" : "Score updated",
      data: record,
    });
  } catch (error) {
    console.error("Error saving test score:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserTestScore = async (req, res) => {
  const { userId } = req.params;
  const { courseType, courseId } = req.query;

  try {
    if (!userId || !courseType || !courseId) {
      return res.status(400).json({
        message: "Missing required parameters: userId, courseType, and courseId are required"
      });
    }

    const testScore = await UserTestScores.findOne({
      where: {
        user_id: userId,
        course_type: courseType,
        course_id: courseId,
      }
    });

    if (!testScore) {
      return res.status(404).json({
        message: "No test score found for this user and course",
        data: null
      });
    }

    res.status(200).json({
      message: "Test score retrieved successfully",
      data: testScore
    });
  } catch (error) {
    console.error("Error retrieving test score:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  saveTestScore,
  getUserTestScore
};
