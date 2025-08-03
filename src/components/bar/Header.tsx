import { Search, Menu } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "@remix-run/react";

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const handleLogin = () => {
    navigate("/login");
  };
    
    return (
        <header className="flex items-center justify-between py-4 px-6 bg-[#0c7b6a] shadow-sm">
        <div className="flex items-center gap-6">
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="text-2xl font-bold text-gray-800">LOGO</div>
        </div>
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาหลักสูตรที่คุณสนใจ"
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="space-x-2">

          <button 
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            onClick={handleLogin}
          >
            ออกจากระบบ
          </button>
        </div>
      </header>
    );
};

export default Header;
