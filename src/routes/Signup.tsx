import React from "react";
import { useNavigate } from "@remix-run/react";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen items-center bg-[#e7f1fa] rounded-lg shadow-lg flex flex-row w-full">
      {/* Left Side - Logo */}
      <div className="flex items-center justify-center w-7/12">
        <span className="text-4xl font-bold text-gray-400">LOGO</span>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex flex-col items-center w-3/12">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">ลงทะเบียน</h2>

        <form className="space-y-4 w-72">
          <div>
            <input
              type="text"
              placeholder="หมายเลขโทรศัพท์หรืออีเมล"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="รหัสผ่าน"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="ยืนยันรหัสผ่าน"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-[#015595] text-white py-3 rounded-md hover:bg-[#3883bc] transition"
            >
              ลงทะเบียน
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
            ――――ลงทะเบียนผ่านบัญชีโซเชียล――――
          </div>

          <div className="mt-4 space-y-2 w-72">
            <button className="w-full flex items-center justify-center bg-white border border-gray-300 py-2 rounded-md hover:bg-gray-100">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
                alt="LINE"
                className="w-6 h-6 mr-2"
              />
              ลงทะเบียนผ่าน LINE
            </button>
            <button className="w-full flex items-center justify-center bg-white border border-gray-300 py-2 rounded-md hover:bg-gray-100">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
                className="w-6 h-6 mr-2"
              />
              ลงทะเบียนผ่าน GOOGLE
            </button>
          </div>

        <div 
          className="text-center text-sm text-blue-600 mt-4 hover:underline cursor-pointer"
          onClick={handleLogin}
        >
          ยังไม่ได้สมัคร? เข้าสู่ระบบ
        </div>
      </div>
    </div>
  );
};

export default Signup;
