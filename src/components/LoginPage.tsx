import React, { useState } from "react";
import { useNavigate } from "@remix-run/react";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setIsLoading(true);

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

    if (hasError) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data?.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      } else if (data?.user && data?.token) {
        sessionStorage.setItem("userId", data.user.id);
        sessionStorage.setItem("username", data.user.username);
        sessionStorage.setItem("userRole", data.user.is_admin);
        sessionStorage.setItem("token", data.token);

        navigate("/home");
      } else {
        setGeneralError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ: ข้อมูลผู้ใช้ไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Login error:", error);
      setGeneralError("เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                usernameError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
              disabled={isLoading}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {generalError && (
            <div className="text-red-600 text-sm text-center">
              {generalError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-md transition ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#015595] hover:bg-[#3883bc]"
              } text-white`}
            >
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          ―――― เข้าสู่ระบบผ่านบัญชีโซเชียล ――――
        </div>

        <div className="mt-4 space-y-2 w-72">
          <button 
            className="w-full flex items-center justify-center bg-white border border-gray-300 py-2 rounded-md hover:bg-gray-100"
            disabled={isLoading}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
              alt="LINE"
              className="w-6 h-6 mr-2"
            />
            เข้าสู่ระบบผ่าน LINE
          </button>
          <button 
            className="w-full flex items-center justify-center bg-white border border-gray-300 py-2 rounded-md hover:bg-gray-100"
            disabled={isLoading}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google"
              className="w-6 h-6 mr-2"
            />
            เข้าสู่ระบบผ่าน GOOGLE
          </button>
        </div>

        <div
          className={`text-center text-sm text-blue-600 mt-4 hover:underline cursor-pointer ${
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
          onClick={handleSignup}
        >
          ยังไม่ได้สมัคร? ลงทะเบียน
        </div>
      </div>
    </div>
  );
};

export default Login;