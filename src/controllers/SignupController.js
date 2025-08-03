import bcrypt from 'bcrypt';

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if username is taken
    const existingUser = await Users.findOne({ where: { username } });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await Users.create({
      username,
      password: hashedPassword,
      is_admin: false,
      signup_date: new Date()
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
