import express from 'express';
import cors from 'cors';
import sequelize from './src/config/database.js';
import VideosController from './src/controllers/VideosController.js';
import ArticlesController from './src/controllers/ArticlesController.js';
import CaseStudyController from './src/controllers/CaseStudyController.js';
import VocabularyController from './src/controllers/VocabularyController.js';
import UserController from './src/controllers/UserController.js';
import multer from 'multer';
import LoginController from './src/controllers/LoginController.js';
import SignupController from './src/controllers/SignupController.js';
import QuizController from './src/controllers/QuizController.js';
import LogoutController from './src/controllers/LogoutController.js';
import TestController from './src/controllers/TestController.js';
import UserTestScoresController from './src/controllers/UserTestScoresController.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://learning-hub-14u9.vercel.app'] 
    : "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync();
    }
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
  }
};

initializeDatabase();

// Routes
app.post('/login', LoginController.login);
app.post('/signup', SignupController.signup);
app.get('/getAllVideos', VideosController.getAllVideos);
app.get('/getVideo/:videoId', VideosController.getVideoById);
app.post('/createVideo', VideosController.createVideo);
app.get('/getAllArticles', ArticlesController.getAllArticles);
app.get('/getAllArticlesBasic', ArticlesController.getAllArticlesBasic);
app.get('/getArticle/:articleId', ArticlesController.getArticleById);
app.get('/getArticleSections/:articleId', ArticlesController.getArticleSections);
app.post('/createArticle', ArticlesController.createArticle);
app.get('/getAllVocab', VocabularyController.getAllVocab);
app.post('/createVocab', VocabularyController.createVocab);
app.get('/getUserById/:userId', UserController.getUserById);
app.get('/getUserArticleHistory/:userId', UserController.getUserArticleHistory);
app.get('/getUserCaseStudyHistory/:userId', UserController.getUserCaseStudyHistory);
app.get('/getUserVideoHistory/:userId', UserController.getUserVideoHistory);
app.post('/addArticleToHistory/:userId', UserController.addArticleToHistory);
app.post('/addCaseStudyToHistory/:userId', UserController.addCaseStudyToHistory);
app.post('/addVideoToHistory/:userId', UserController.addVideoToHistory);
app.get('/getTagStat/:userId', UserController.getTagStats);
app.put('/editUserData/:userId', UserController.editUserData);
app.put('/editUserImage/:userId', upload.single('image'), UserController.editUserImage);
app.put('/updateQuizScore/:userId', UserController.updateQuizScore);
app.get('/getQuiz', QuizController.getQuiz);
app.post('/logout', LogoutController.logout);
app.get('/getAllCaseStudy', CaseStudyController.getAllCaseStudy);
app.get('/getCaseStudyById/:caseStudyId', CaseStudyController.getCaseStudyById);
app.post('/createCaseStudy', upload.single('image'), CaseStudyController.createCaseStudy);
app.get('/getTest', TestController.getTest);
app.get('/getTestsForVideo/:videoId', TestController.getTestsForVideo);
app.get('/getTestsForArticle/:articleId', TestController.getTestsForArticle);
app.put('/saveTestScore/:userId', UserTestScoresController.saveTestScore);
app.get('/getUserTestScore/:userId', UserTestScoresController.getUserTestScore);
app.post('/createTest', TestController.createTest);

app.get('/', (req, res) => {
  res.json({ message: 'API is running!', status: 'ok' });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'File too large. Maximum size is 10MB.' });
    }
  }
  console.error('Error:', error);
  return res.status(500).json({ message: 'Server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Express server running on port ${PORT}`);
});

export default app;