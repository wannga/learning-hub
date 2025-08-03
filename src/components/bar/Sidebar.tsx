import React, {useState} from "react";
import { useNavigate } from "@remix-run/react";
import {
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { FaHome } from "react-icons/fa";
import { MdGTranslate } from "react-icons/md";
import CourseDropdown from "./CourseDropDown.tsx";

function SideBar() {
  const navigate = useNavigate();

  return (
    <div className="h-auto w-48 bg-[#cbfff4] shadow-lg flex flex-col py-4">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center px-6 py-3 text-sm font-bold text-gray-700 hover:text-teal-600 transition-colors duration-200"
      >
        <FaHome className="h-5 w-5 mr-3" />
        <span>หน้าแรก</span>
      </button>

        <CourseDropdown />

      <button
        onClick={() => navigate("/about")}
        className="flex items-center px-5 py-3 text-sm font-bold text-gray-700 hover:text-teal-600 transition-colors duration-200"
      >
        <InformationCircleIcon className="h-6 w-6 mr-3" />
        <span>เกี่ยวกับเรา</span>
      </button>

      <button
        onClick={() => navigate("/vocabulary")}
        className="flex items-center px-6 py-3 text-sm font-bold text-gray-700 hover:text-teal-600 transition-colors duration-200"
      >
        <MdGTranslate className="h-5 w-5 mr-3" />
        <span>คำศัพท์</span>
      </button>
    </div>
  );
}

export default SideBar;