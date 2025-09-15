import bcrypt from 'bcrypt';
import { Users } from '../models/Users.js';

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash password before storing it
    const saltRounds = 10; // Number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await Users.create({
      username,
      password: hashedPassword,
      is_admin: false,
      signup_date: new Date(),
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: { 
        id: newUser.id, 
        username: newUser.username, 
        signup_date: newUser.signup_date 
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์' });
  }
};

export default {
  signup
};
