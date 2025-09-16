import { Articles } from "../models/Articles.js";
import { ArticleSections } from "../models/ArticleSections.js";

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
    image: processImageData(articleData.image)
  };
};

export const getAllArticles = async (req, res) => {
  try {
    const articles = await Articles.findAll({
      include: [
        {
          model: ArticleSections,
          as: "sections",
          required: false,
        },
      ],
      order: [
        ["id", "ASC"],
        [{ model: ArticleSections, as: "sections" }, "id", "ASC"],
      ],
    });

    if (articles && articles.length > 0) {
      const processedArticles = articles.map(article => {
        const articleData = processArticleData(article);
        
        if (articleData.sections && Array.isArray(articleData.sections)) {
          articleData.sections = articleData.sections.map(section => {
            const sectionData = section.dataValues || section;
            return {
              ...sectionData,
              image: processImageData(sectionData.image)
            };
          });
        }
        
        return articleData;
      });
      
      res.status(200).json(processedArticles);
    } else {
      res.status(404).json({ message: "No articles found" });
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

export const getArticleById = async (req, res) => {
  const { articleId } = req.params;

  try {
    const article = await Articles.findByPk(articleId, {
      include: [
        {
          model: ArticleSections,
          as: "sections",
        },
      ],
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const processedArticle = processArticleData(article);
    
    if (processedArticle.sections && Array.isArray(processedArticle.sections)) {
      processedArticle.sections = processedArticle.sections.map(section => {
        const sectionData = section.dataValues || section;
        return {
          ...sectionData,
          image: processImageData(sectionData.image)
        };
      });
    }

    res.status(200).json(processedArticle);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllArticlesBasic = async (req, res) => {
  try {
    const articles = await Articles.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "time",
        "author",
        "image",
        "tag",
        "link",
        "level",
      ],
      order: [["id", "ASC"]],
    });

    if (!articles || articles.length === 0) {
      return res.status(404).json({ message: "No articles found" });
    }

    const processed = articles.map(article => processArticleData(article));

    return res.status(200).json(processed);
    
  } catch (error) {
    console.error("Error fetching articles:", error);
    return res.status(500).json({ error: "Failed to fetch articles" });
  }
};

export const getArticleSections = async (req, res) => {
  const { articleId } = req.params;

  try {
    const sections = await ArticleSections.findAll({
      where: { articleId },
      order: [["id", "ASC"]],
    });

    if (sections && sections.length > 0) {
      res.status(200).json(sections);
    } else {
      res.status(404).json({ message: "No sections found for this article" });
    }
  } catch (error) {
    console.error("Error fetching article sections:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createArticle = async (req, res) => {
 
  try {
    const {
      title,
      description,
      time,
      author,
      image,
      tag,
      link,
      objective,
      target,
      level,
      infoBox,
      sections,
    } = req.body;

    if (!title || !description || !author) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const existingArticle = await Articles.findOne({ where: { title: title.trim() } });
    if (existingArticle) {
      return res.status(400).json({ 
        message: 'An article with this title already exists. Please choose a different title.' 
      });
    }

    let imageBuffer = null;
    let imageError = null;
    
    if (image && typeof image === 'string') {
      try {
        let base64Data = image;
        let mimeType = 'image/jpeg'; //default

        const dataUrlMatch = image.match(/^data:(.+);base64,(.+)$/);
        if (dataUrlMatch) {
          mimeType = dataUrlMatch[1];
          base64Data = dataUrlMatch[2];
        }

        if (!mimeType.startsWith('image/')) {
          imageError = 'Invalid image format. Please upload a valid image file.';
        } else {
          imageBuffer = Buffer.from(base64Data, 'base64');
        }

        const maxBufferSize = 10 * 1024 * 1024; // 10MB
        if (imageBuffer.length > maxBufferSize) {
          imageError = 'Image file too large after processing. Please use a smaller image.';
          imageBuffer = null;
        }
      } catch (err) {
        console.error('Image processing error:', err);
        imageError = 'Failed to process image. Please try a different image.';
        imageBuffer = null;
      }
    }
    
    if (imageError) {
      return res.status(400).json({ message: imageError });
    }

    let formattedTag = [];
    if (Array.isArray(tag)) {
      formattedTag = tag.filter(Boolean);
    } else if (typeof tag === 'string' && tag.trim()) {
      formattedTag = tag.split(',').map((t) => t.trim()).filter(Boolean);
    }

    let formattedInfoBox = [];
    if (Array.isArray(infoBox)) {
      formattedInfoBox = infoBox.filter(Boolean);
    } else if (typeof infoBox === 'string' && infoBox.trim()) {
      formattedInfoBox = infoBox.split(',').map((i) => i.trim()).filter(Boolean);
    }

    let articleData = {
      title: title.trim(),
      description: description.trim(),
      time: time || '',
      author: author.trim(),
      tag: formattedTag,
      link: link || '',
      objective: objective || '',
      target: target || '',
      level: level || '',
      infoBox: formattedInfoBox,
    };

    if (imageBuffer) {
      articleData.image = imageBuffer;
    }

    const newArticle = await Articles.create(articleData);

    if (Array.isArray(sections) && sections.length > 0 && typeof ArticleSections !== 'undefined') {
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section.heading && section.heading.trim()) {
          try {
            await ArticleSections.create({
              article_id: newArticle.id,
              heading: section.heading.trim(),
              content: Array.isArray(section.content) ? section.content.filter(Boolean) : [],
              list: Array.isArray(section.list) ? section.list.filter(Boolean) : [],
              table_headers: Array.isArray(section.table_headers) ? section.table_headers.filter(Boolean) : [],
              table_rows: Array.isArray(section.table_rows) ? section.table_rows.filter(row => Array.isArray(row) && row.some(Boolean)) : [],
            });
          } catch (sectionError) {
            console.error(`Error creating section ${i + 1}:`, sectionError);
          }
        }
      }
    }

    return res.status(201).json({
      message: 'Article created successfully',
      articleId: newArticle.id,
    });

  } catch (err) {
    console.error('Create Article Error:', err);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: err.errors.map(e => e.message) 
      });
    }
    
    if (err.name === 'SequelizeUniqueConstraintError') {
      const field = err.errors?.[0]?.path || 'unknown field';
      const fieldDisplayName = {
        title: 'title',
        author: 'author',
        link: 'link'
      }[field] || field;
      
      return res.status(400).json({ 
        message: `An article with this ${fieldDisplayName} already exists. Please choose a different ${fieldDisplayName}.`
      });
    }
    
    if (err.name === 'SequelizeDatabaseError') {
      if (err.message.includes('Data too long') || err.message.includes('too large')) {
        return res.status(400).json({ 
          message: 'Image data too large for database. Please use a smaller image.' 
        });
      }
      return res.status(500).json({ 
        message: 'Database error', 
        details: process.env.NODE_ENV === 'development' ? err.message : 'Database operation failed' 
      });
    }

    return res.status(500).json({ 
      message: 'Server error while creating article',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

export default {
  getAllArticles,
  getArticleById,
  getAllArticlesBasic,
  getArticleSections,
  createArticle,
};
