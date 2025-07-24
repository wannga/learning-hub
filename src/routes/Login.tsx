import React, { useState } from "react";
import { useNavigate } from "@remix-run/react";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!username.trim()) {
      setUsernameError("กรุณากรอกชื่อผู้ใช้หรือหมายเลขโทรศัพท์");
      hasError = true;
    } else {
      setUsernameError("");
    }

    if (!password.trim()) {
      setPasswordError("กรุณากรอกรหัสผ่าน");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (!hasError) {
      console.log("Login successful");
    }
  };

  return (
    <div className="min-h-screen items-center bg-[#e7f1fa] rounded-lg shadow-lg flex flex-row w-full">
      <div className="flex items-center justify-center w-7/12">
        <span className="text-4xl font-bold text-gray-400">LOGO</span>
      </div>

      <div className="flex flex-col items-center w-3/12">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">เข้าสู่ระบบ</h2>

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
            {usernameError && (
              <p className="text-red-500 text-sm mt-1">{usernameError}</p>
            )}
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
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-[#015595] text-white py-3 rounded-md hover:bg-[#3883bc] transition"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          ――――เข้าสู่ระบบผ่านบัญชีโซเชียล――――
        </div>

        <div className="mt-4 space-y-2 w-72">
          <button className="w-full flex items-center justify-center bg-white border border-gray-300 py-2 rounded-md hover:bg-gray-100">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
              alt="LINE"
              className="w-6 h-6 mr-2"
            />
            เข้าสู่ระบบผ่าน LINE
          </button>
          <button className="w-full flex items-center justify-center bg-white border border-gray-300 py-2 rounded-md hover:bg-gray-100">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google"
              className="w-6 h-6 mr-2"
            />
            เข้าสู่ระบบผ่าน GOOGLE
          </button>
        </div>

        <div
          className="text-center text-sm text-blue-600 mt-4 hover:underline cursor-pointer"
          onClick={handleSignup}
        >
          ยังไม่ได้สมัคร? ลงทะเบียน
        </div>
      </div>
    </div>
  );
};

export default Login;
