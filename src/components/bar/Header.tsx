import { Search } from "lucide-react";
import React from "react";
import { useNavigate } from "@remix-run/react";
import { MdMenuBook } from "react-icons/md";
import { API_CONFIG } from "../../config/api.js";

type HeaderProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        sessionStorage.clear();
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-[#0c7b6a] shadow-sm">
      <div className="flex items-center gap-6">
        <div className="text-2xl font-bold text-gray-800 flex flex-row">
          <MdMenuBook className="w-8 h-8 text-gray-800 mr-2" />
          Learning Hub</div>
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
          onClick={handleLogout}
        >
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
};

export default Header;
