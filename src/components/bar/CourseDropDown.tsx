import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { MdOutlineVideoLibrary } from "react-icons/md";

const CourseDropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#cbfff4]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center w-full px-6 py-3 text-sm font-bold text-gray-700 hover:text-teal-600 transition-colors duration-200"
      >
        <MdOutlineVideoLibrary className="h-5 w-5 mr-3" />
        <span className="flex-1 text-left">หลักสูตร</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-l-2 border-teal-200 font-medium">
          <div
            onClick={() => {
              navigate("/videoMain");
              setOpen(false);
            }}
            className="cursor-pointer px-12 py-2 text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
          >
            video
          </div>
          <div
            onClick={() => {
              navigate("/articleMain");
              setOpen(false);
            }}
            className="cursor-pointer px-12 py-2 text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
          >
            บทความ
          </div>
          <div
            onClick={() => {
              navigate("/caseStudyMain");
              setOpen(false);
            }}
            className="cursor-pointer px-12 py-2 text-sm text-gray-600 hover:text-teal-600 transition-colors duration-200"
          >
            case study
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDropdown;