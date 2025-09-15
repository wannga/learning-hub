export const logout = async (req, res) => {
try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'ออกจากระบบสำเร็จ' });
  } catch (error) {
    console.error('LogoutController error:', error);
    return res.status(500).json({ message: 'เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์' });
  }
};

export default {
  logout
};
