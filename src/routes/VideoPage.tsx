import React, { useState } from "react";
import SideBar from "../components/Sidebar.tsx";
import { Search, Menu } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "วิธีลงทุนสำหรับมือใหม่ ในปี 2025 (ดูจบคลิปเริ่มได้เลย!)",
    description:
      "คู่มือการลงทุน101 สำหรับให้มือใหม่ที่ไม่เคยลงทุนมาก่อนให้สามารถเริ่มลงทุนได้ โดยจะรวมทุกสิ่งที่จำเป็นต้องรู้ และสรุปออกมาเป็น 4 Steps สำหรับนักลงทุนมือใหม่ที่อยากเริ่มลงทุน",
    creator: "THE MONEY GAME by Tanin Kunkamedee",
    time: "29:53 นาที",
    link: "https://www.youtube.com/embed/shZfU93PiRc",
    objective: "เพื่อเสริมสร้างความรู้พื้นฐานด้านการลงทุนให้กับผู้เรียน",
    target: "เหมาะสำหรับมือใหม่ที่ไม่มีพื้นฐาน",
    level: "ระดับเริ่มต้น (Beginner)",
  },
];

function VideoPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex h-auto bg-gray-50 min-h-screen">
      <div className="flex-1">
        {/* Header */}
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
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              เข้าสู่ระบบ
            </button>
            <button className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              ลงทะเบียน
            </button>
          </div>
        </header>

        <div className="flex">
          <SideBar />

          {/* Main Content */}
          <main className="p-6 w-11/12 space-y-6 overflow-auto">
            {videos.map((video) => (
              <div key={video.id} className="space-y-6">
                {/* Video Section */}
                <div className="flex space-x-6">
                  <div className="flex-1">
                    <div className="relative pb-[56.25%]">
                      <iframe
                        className="absolute w-full h-full"
                        src={video.link}
                        title={video.title}
                        allowFullScreen
                      />
                    </div>
                  </div>
                  <div className="w-1/3 bg-teal-100 p-4 rounded shadow">
                    <h2 className="text-lg font-semibold">{video.title}</h2>
                    <p className="text-base mt-2">{video.creator}</p>
                    <p className="text-sm mt-4 text-right">ความยาว {video.time}</p>
                  </div>
                </div>

                {/* Description Sections */}
                <ContentSection title="📄 คำอธิบาย">
                  <p>{video.description}</p>
                </ContentSection>

                <ContentSection title="📍 วัตถุประสงค์">
                  <p>{video.objective}</p>
                </ContentSection>

                <ContentSection title="👥 หลักสูตรนี้เหมาะสำหรับ">
                  <p>{video.target}</p>
                </ContentSection>

                <ContentSection title="📘 ระดับเนื้อหา">
                  <p>{video.level}</p>
                </ContentSection>
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">{title}</h2>
      {children}
    </section>
  );
}

export default VideoPage;
