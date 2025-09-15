import React, { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { FaHome } from "react-icons/fa";
import { MdGTranslate } from "react-icons/md";
import CourseDropdown from "./CourseDropDown.tsx";
import { FaRegUserCircle } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";

type User = {
  id: number;
  username: string;
  quiz_score: number;
};

function SideBar() {
  const navigate = useNavigate();
  const storedUserId = sessionStorage.getItem("userId");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!storedUserId) return;

        const res = await fetch(
          `http://localhost:3001/getUserById/${storedUserId}`
        );
        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดผู้ใช้ได้");
        }

        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [storedUserId]);

  const handleQuizClick = () => {
    if (!user) return;
    if (user.quiz_score === 0) {
      navigate("/quizPage");
    } else {
      navigate("/quizResultPage");
    }
  };

  return (
    <div className="h-full w-48 bg-[#cbfff4] shadow-lg flex flex-col py-4 min-h-screen">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center px-6 py-3 text-sm font-bold text-gray-700 hover:text-teal-600 transition-colors duration-200"
      >
        <FaHome className="h-5 w-5 mr-3" />
        <span>หน้าแรก</span>
      </button>

      <CourseDropdown />

      <button
        onClick={handleQuizClick}
        className="flex items-center px-6 py-3 text-sm font-bold text-gray-700 hover:text-teal-600 transition-colors duration-200"
      >
        <MdQuiz className="h-5 w-5 mr-3" />
        <span>รูปแบบการลงทุน</span>
      </button>

      <button
        onClick={() => navigate("/vocabulary")}
        className="flex items-center px-6 py-3 text-sm font-bold text-gray-700 hover:text-teal-600 transition-colors duration-200"
      >
        <MdGTranslate className="h-5 w-5 mr-3" />
        <span>คำศัพท์</span>
      </button>

      <button
        onClick={() => navigate("/userProfile")}
        className="flex items-center px-6 py-3 text-sm font-bold text-gray-700 hover:text-teal-600 transition-colors duration-200"
      >
        <FaRegUserCircle className="h-5 w-5 mr-3" />
        <span>บัญชี</span>
      </button>
    </div>
  );
}

export default SideBar;
