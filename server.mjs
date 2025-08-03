import express from 'express';
import cors from 'cors';
import { Users } from './src/models/Users.js';
import sequelize from './src/config/database.js';
import VideosController from './src/controllers/VideosController.js';
import ArticlesController from './src/controllers/ArticlesController.js';
import CaseStudyController from './src/controllers/CaseStudyController.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Received username:', username);
        console.log('Received password:', password); 

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await Users.findOne({ where: { username } });

        if (!user) {
            console.log('User not found for username:', username);
            return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const storedPassword = user.getDataValue('password');
        console.log('Stored username:', user.getDataValue('username'));
        console.log('Stored password:', storedPassword); 
        console.log('Comparison result:', storedPassword === password);

        if (storedPassword !== password) {
            return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const token = 'mock-real-jwt-token';

        return res.status(200).json({
            user: { id: user.getDataValue('id'), username: user.getDataValue('username') },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์' });
    }
});

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    console.log(`✅ Express server running at http://localhost:${port}`);
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = await Users.create({
      username,
      password, // hash with bcrypt later
      is_admin: false,
      signup_date: new Date(),
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: { id: newUser.id, username: newUser.username, signup_date: newUser.signup_date }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์' });
  }
});

app.post('/logout', async (req, res) => {

});

app.get('/getAllVideos', VideosController.getAllVideos);
app.get('/getVideo/:videoId', VideosController.getVideoById);
app.get('/getAllArticles', ArticlesController.getAllArticles);
app.get('/getAllArticlesBasic', ArticlesController.getAllArticlesBasic);
app.get('/getArticle/:articleId', ArticlesController.getArticleById);
app.get('/getArticleSections/:articleId', ArticlesController.getArticleSections);
app.get('/getAllCaseStudy', CaseStudyController.getAllCaseStudy);
app.get('/getCaseStudyById/:caseStudyId', CaseStudyController.getCaseStudyById);

//Run: node server.mjs