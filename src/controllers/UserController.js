import { body, validationResult } from 'express-validator';
import { Users } from '../models/Users.js';

exports.validateUserRegistration = [
  body('username').isString().isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

exports.checkUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const existingUser = await Users.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).json({ message: 'Username is already taken' });
    }

    res.status(200).json({ message: 'Username is available' });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ error: 'An error occurred while checking the username' });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ message: 'No users found' });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.deleteUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

     await user.destroy();
     return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};