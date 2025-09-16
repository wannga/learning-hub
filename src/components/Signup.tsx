import React, { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { API_CONFIG } from "./../config/api.js";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setGeneralError("");
    setSuccessMessage("");

    let hasError = false;

    if (!username.trim()) {
      setUsernameError("กรุณากรอกชื่อผู้ใช้หรือหมายเลขโทรศัพท์");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("กรุณากรอกรหัสผ่าน");
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("กรุณายืนยันรหัสผ่าน");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("รหัสผ่านไม่ตรงกัน");
      hasError = true;
    }

    if (hasError) return;

    const signup_date = new Date().toISOString();

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          signup_date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(
          data?.message || data?.errors?.[0]?.msg || "เกิดข้อผิดพลาดในการลงทะเบียน"
        );
      } else {
        setSuccessMessage("ลงทะเบียนสำเร็จ! กำลังเปลี่ยนหน้าเข้าสู่ระบบ...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setGeneralError("เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="min-h-screen items-center bg-[#e7f1fa] rounded-lg shadow-lg flex flex-row w-full">
      <div className="flex items-center justify-center w-7/12">
        <span className="text-4xl font-bold text-gray-400">LEARNING HUB</span>
      </div>

      <div className="flex flex-col items-center w-3/12">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">ลงทะเบียน</h2>

        <form className="space-y-4 w-72" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ชื่อผู้ใช้หรือหมายเลขโทรศัพท์"
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                usernameError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน"
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="ยืนยันรหัสผ่าน"
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                confirmPasswordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
            )}
          </div>

          {generalError && (
            <p className="text-red-500 text-sm text-center">{generalError}</p>
          )}

          {successMessage && (
            <p className="text-green-600 text-sm text-center">{successMessage}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full bg-[#015595] text-white py-3 rounded-md hover:bg-[#3883bc] transition"
            >
              ลงทะเบียน
            </button>
          </div>
        </form>

        <div
          className="text-center text-sm text-blue-600 mt-4 hover:underline cursor-pointer"
          onClick={handleLogin}
        >
          เข้าสู่ระบบ
        </div>
      </div>
    </div>
  );
};

export default Signup;
