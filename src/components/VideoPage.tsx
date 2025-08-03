import React, { useState, useEffect } from "react";
import SideBar from "./bar/Sidebar.tsx";
import Header from "./bar/Header.tsx";
import { useNavigate } from "@remix-run/react";

type Video = {
  id: number;
  title: string;
  description: string;
  creator: string;
  time: string;
  link: string;
  objective: string;
  target: string;
  level: string;
};

function VideoPage() {
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState("");
  const storedVideoId = sessionStorage.getItem("currentVideoId");

  useEffect(() => {
    if (!storedVideoId) {
      setError("ไม่พบวิดีโอ");
      return;
    }

    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://localhost:3001/getVideo/${storedVideoId}`);
        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดวิดีโอได้");
        }

        const data: Video = await res.json();
        setVideo(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "เกิดข้อผิดพลาด");
      }
    };

    fetchVideo();
  }, [storedVideoId]);

  if (error) {
    return <div className="p-8 text-red-500 font-semibold">{error}</div>;
  }

  if (!video) {
    return <div className="p-8">กำลังโหลดวิดีโอ...</div>;
  }

  return (
    <div className="flex h-auto bg-gray-50 min-h-screen">
      <div className="flex-1">
        {/* Header */}
        <Header />

        <div className="flex">
          <SideBar />

          {/* Main Content */}
          <main className="p-6 w-11/12 space-y-6 overflow-auto">
            <div className="space-y-6">
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
              </div>

              {/* Description Sections */}
              <ContentSection title="📄 คำอธิบาย">
                <p>{video.description}</p>
              </ContentSection>

              <ContentSection title="📍 วัตถุประสงค์">
                <p>{video.objective}</p>
              </ContentSection>

              <div className="grid grid-cols-2 gap-6">
                <ContentSection title="👥 หลักสูตรนี้เหมาะสำหรับ">
                  <p>{video.target}</p>
                </ContentSection>

                <ContentSection title="📘 ระดับเนื้อหา">
                  <p>{video.level}</p>
                </ContentSection>
              </div>

              <div className="w-full text-right">
                <button
                  className="bg-[#0c7b6a] text-white p-2 rounded-md"
                  onClick={() => navigate("/videoMain")}
                >
                  &lt; กลับไปหน้าหลัก
                </button>
              </div>
            </div>
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
