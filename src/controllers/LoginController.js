import bcrypt from 'bcrypt';
import { Users } from '../models/Users.js';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Received username:', username);

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await Users.findOne({ where: { username } });

        if (!user) {
            console.log('User not found for username:', username);
            return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const storedHashedPassword = user.getDataValue('password');
        console.log('Stored username:', user.getDataValue('username'));
       
        const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);
        console.log('Password validation result:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const token = 'mock-real-jwt-token';

        return res.status(200).json({
            user: { 
                id: user.getDataValue('id'), 
                username: user.getDataValue('username'), 
                is_admin: user.getDataValue('is_admin') 
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์' });
    }
};

export default {
  login
};
