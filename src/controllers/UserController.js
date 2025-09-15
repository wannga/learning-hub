import { Users } from "../models/Users.js";
import { Articles } from "../models/Articles.js";
import { CaseStudy } from "../models/CaseStudy.js";
import { Videos } from "../models/Videos.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import multer from "multer";
const upload = multer();

const processImageData = (imageBuffer) => {
  if (!imageBuffer) return null;
  try {
    return Buffer.from(imageBuffer).toString("base64");
  } catch (error) {
    console.error("Error processing image:", error);
    return null;
  }
};

const processArticleData = (article) => {
  if (!article) return null;

  const articleData = article.dataValues || article;
  return {
    ...articleData,
    image: processImageData(articleData.image),
  };
};

const processCaseStudyData = (casestudy) => {
  if (!casestudy) return null;

  const casestudyData = casestudy.dataValues || casestudy;
  return {
    ...casestudyData,
    image: processImageData(casestudyData.image),
  };
};

const processUserData = (user) => {
  if (!user) return null;
  const userData = user.get({ plain: true });
  return {
    ...userData,
    image: processImageData(userData.image),
  };
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const processedUser = processUserData(user);

    if (processedUser.image && Buffer.isBuffer(processedUser.image)) {
      processedUser.image = processedUser.image.toString("base64");
    }
    res.status(200).json(processedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editUserData = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (updates.password && updates.currentPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(
        updates.currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Invalid current password" });
      }
    }

    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    const allowedFields = [
      "username",
      "password",
      "email",
      "career",
      "experience",
    ];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    }

    await user.save();

    const { password, ...userWithoutPassword } = user.toJSON();
    return res.status(200).json(userWithoutPassword);
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editUserImage = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "File must be an image" });
    }

    const maxSize = 10 * 1024 * 1024;
    if (req.file.size > maxSize) {
      return res
        .status(400)
        .json({ message: "Image size must be less than 10MB" });
    }

    user.image = req.file.buffer;
    await user.save();

    console.log("Backend - Stored buffer length:", req.file.buffer.length);

    const { password, ...userWithoutPassword } = user.toJSON();

    userWithoutPassword.image = req.file.buffer.toString("base64");

    console.log(
      "Backend - Base64 response length:",
      userWithoutPassword.image.length
    );
    console.log(
      "Backend - Base64 preview:",
      userWithoutPassword.image.substring(0, 50)
    );

    res.status(200).json({
      message: "Image updated successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Error updating user image:", err);
    res.status(500).json({
      message: "Internal server error while updating image",
      error: err.message,
    });
  }
};

export const getUserArticleHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Users.findByPk(userId, {
      attributes: ["article_history"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.article_history || user.article_history.length === 0) {
      return res.status(200).json({ message: "ยังไม่มีประวัติการอ่านบทความ" });
    }

    const articles = await Articles.findAll({
      where: {
        id: {
          [Op.in]: user.article_history,
        },
      },
    });

    const processedArticles = articles.map(processArticleData);

    res.status(200).json(processedArticles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserCaseStudyHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Users.findByPk(userId, {
      attributes: ["casestudy_history"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.casestudy_history || user.casestudy_history.length === 0) {
      return res.status(200).json({ message: "ยังไม่มีประวัติการดูกรณีศีกษา" });
    }

    const casestudy = await CaseStudy.findAll({
      where: {
        id: {
          [Op.in]: user.casestudy_history,
        },
      },
    });

    const processedCasestudy = casestudy.map(processCaseStudyData);

    res.status(200).json(processedCasestudy);
  } catch (error) {
    console.error("Error fetching casestudy:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserVideoHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Users.findByPk(userId, {
      attributes: ["video_history"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.video_history || user.video_history.length === 0) {
      return res.status(200).json({ message: "ยังไม่มีประวัติการดูวิดีโอ" });
    }

    const videos = await Videos.findAll({
      where: {
        id: {
          [Op.in]: user.video_history,
        },
      },
    });

    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addArticleToHistory = async (req, res) => {
  const { userId } = req.params;
  const { articleId } = req.body;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let history = user.article_history || [];

    const numericArticleId = parseInt(articleId);
    const numericHistory = history.map((id) => parseInt(id));

    if (!numericHistory.includes(numericArticleId)) {
      numericHistory.push(numericArticleId);

      await user.update({
        article_history: numericHistory,
      });

      await user.reload();
    }

    res.status(200).json({
      message: "History updated",
      article_history: user.article_history,
    });
  } catch (error) {
    console.error("Error updating article history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addCaseStudyToHistory = async (req, res) => {
  const { userId } = req.params;
  const { casestudyId } = req.body;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let history = user.casestudy_history || [];

    const numericCasestudyId = parseInt(casestudyId);
    const numericHistory = history.map((id) => parseInt(id));

    if (!numericHistory.includes(numericCasestudyId)) {
      numericHistory.push(numericCasestudyId);

      await user.update({
        casestudy_history: numericHistory,
      });

      await user.reload();
    }

    res.status(200).json({
      message: "History updated",
      casestudy_history: user.casestudy_history,
    });
  } catch (error) {
    console.error("Error updating casestudy history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addVideoToHistory = async (req, res) => {
  const { userId } = req.params;
  const { videoId } = req.body;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let history = user.video_history || [];

    const numericVideoId = parseInt(videoId);
    const numericHistory = history.map((id) => parseInt(id));

    if (!numericHistory.includes(numericVideoId)) {
      numericHistory.push(numericVideoId);

      await user.update({
        video_history: numericHistory,
      });

      await user.reload();
    }

    res.status(200).json({
      message: "History updated",
      video_history: user.video_history,
    });
  } catch (error) {
    console.error("Error updating video history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTagStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const countTags = (contentArray) => {
      const tagCounts = {};
      contentArray.forEach((content) => {
        if (
          content.tag &&
          Array.isArray(content.tag) &&
          content.tag.length > 0
        ) {
          content.tag.forEach((tag) => {
            if (tag && tag.trim() !== "") {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            }
          });
        }
      });
      return tagCounts;
    };

    const mergeTagCounts = (...tagCountObjects) => {
      const merged = {};
      tagCountObjects.forEach((tagCounts) => {
        Object.entries(tagCounts).forEach(([tag, count]) => {
          merged[tag] = (merged[tag] || 0) + count;
        });
      });
      return merged;
    };

    const [allArticles, allCaseStudies, allVideos] = await Promise.all([
      Articles.findAll({ attributes: ["tag"] }),
      CaseStudy.findAll({ attributes: ["tag"] }),
      Videos.findAll({ attributes: ["tag"] }),
    ]);

    const globalTagCounts = mergeTagCounts(
      countTags(allArticles),
      countTags(allCaseStudies),
      countTags(allVideos)
    );

    const globalTags = Object.entries(globalTagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    const user = await Users.findByPk(userId, {
      attributes: ["article_history", "casestudy_history", "video_history"],
    });

    let userTags = [];
    if (user) {
      const promises = [];

      if (user.article_history && user.article_history.length > 0) {
        promises.push(
          Articles.findAll({
            where: { id: { [Op.in]: user.article_history } },
            attributes: ["tag"],
          })
        );
      } else {
        promises.push(Promise.resolve([]));
      }

      if (user.casestudy_history && user.casestudy_history.length > 0) {
        promises.push(
          CaseStudy.findAll({
            where: { id: { [Op.in]: user.casestudy_history } },
            attributes: ["tag"],
          })
        );
      } else {
        promises.push(Promise.resolve([]));
      }

      if (user.video_history && user.video_history.length > 0) {
        promises.push(
          Videos.findAll({
            where: { id: { [Op.in]: user.video_history } },
            attributes: ["tag"],
          })
        );
      } else {
        promises.push(Promise.resolve([]));
      }

      const [userArticles, userCaseStudies, userVideos] = await Promise.all(
        promises
      );

      const userTagCounts = mergeTagCounts(
        countTags(userArticles),
        countTags(userCaseStudies),
        countTags(userVideos)
      );

      userTags = Object.entries(userTagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
    }

    res.json({
      success: true,
      globalTags,
      userTags,
    });
  } catch (err) {
    console.error("Error fetching tag stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateQuizScore = async (req, res) => {
  const { userId } = req.params;
  const { score } = req.body;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.quiz_score = score;

    await user.save();

    return res.status(200).json({
      message: "Quiz score updated successfully",
      quiz_score: user.quiz_score,
    });
  } catch (err) {
    console.error("Error updating quiz score:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getUserById,
  getUserArticleHistory,
  getUserCaseStudyHistory,
  getUserVideoHistory,
  addArticleToHistory,
  addCaseStudyToHistory,
  addVideoToHistory,
  getTagStats,
  editUserData,
  editUserImage,
  updateQuizScore,
};
