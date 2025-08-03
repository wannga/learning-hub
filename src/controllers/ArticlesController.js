import { Articles } from '../models/Articles.js';
import { ArticleSections } from '../models/ArticleSections.js';

export const getAllArticles = async (req, res) => {
  try {
    const articles = await Articles.findAll({
      include: [
        {
          model: ArticleSections,
          as: 'sections',
          required: false 
        }
      ],
      order: [
        ['id', 'ASC'], 
        [{ model: ArticleSections, as: 'sections' }, 'id', 'ASC']
      ]
    });
    
    if (articles && articles.length > 0) {
      res.status(200).json(articles);
    } else {
      res.status(404).json({ message: 'No articles found' });
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

export const getArticleById = async (req, res) => {
  const { articleId } = req.params;

  try {
    const article = await Articles.findByPk(articleId, {
      include: [
        {
          model: ArticleSections,
          as: 'sections',
        }
      ]
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//articles without sections (e.g.: ArticlesMain.tsx)
export const getAllArticlesBasic = async (req, res) => {
  try {
    const articles = await Articles.findAll({
      attributes: ['id', 'title', 'description', 'time', 'author', 'image', 'tag', 'link', 'level'],
      order: [['id', 'ASC']]
    });
    
    if (articles && articles.length > 0) {
      res.status(200).json(articles);
    } else {
      res.status(404).json({ message: 'No articles found' });
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// Get only sections for an article from article id
export const getArticleSections = async (req, res) => {
  const { articleId } = req.params;

  try {
    const sections = await ArticleSections.findAll({
      where: { articleId },
      order: [['id', 'ASC']]
    });
    
    if (sections && sections.length > 0) {
      res.status(200).json(sections);
    } else {
      res.status(404).json({ message: 'No sections found for this article' });
    }
  } catch (error) {
    console.error('Error fetching article sections:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {
  getAllArticles,
  getArticleById,
  getAllArticlesBasic,
  getArticleSections,
};