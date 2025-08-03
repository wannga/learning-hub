import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

class LoginController {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async login(body) {
    try {
      const { username, password } = body;

      if (!username || !password) {
        return {
          status: 400,
          body: { message: 'Username and password are required' },
        };
      }

      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: username },
            { phone: username },
          ],
        },
      });

      if (!user) {
        return {
          status: 401,
          body: { message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        };
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        return {
          status: 401,
          body: { message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        };
      }

      // Example: Replace this with real JWT if needed
      const token = `mock-jwt-${Date.now()}`;
      // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return {
        status: 200,
        body: {
          user: {
            id: user.id,
            username: user.username,
          },
          token,
        },
      };
    } catch (error) {
      console.error('LoginController error:', error);

      return {
        status: 500,
        body: { message: 'เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์' },
      };
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

export { LoginController };
