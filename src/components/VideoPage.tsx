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

type UserTestScore = {
  id: number;
  course_type: string;
  course_id: number;
  score: number;
};

function VideoPage() {
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState("");
  const storedVideoId = sessionStorage.getItem("currentVideoId");
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLoading] = useState(true);
  const storedUserId = sessionStorage.getItem("userId");
  const storedUserRole = sessionStorage.getItem("userRole") === "true";
  const [userTestScore, setUserTestScore] = useState<UserTestScore | null>(
    null
  );
  const type = "video";

  useEffect(() => {
    if (!storedVideoId) {
      setError("ไม่พบวิดีโอ");
      return;
    }

    const fetchVideo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getVideo/${storedVideoId}`
        );
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

    const fetchUserTestScore = async () => {
      try {
        if (!storedUserId) {
          console.warn("No userId found in sessionStorage");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getUserTestScore/${storedUserId}?courseType=${type}&courseId=${storedVideoId}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          if (errorData.message?.includes("No test score")) {
            setUserTestScore(null);
            return;
          }
          throw new Error(
            errorData.message || "ไม่สามารถโหลดคะแนนของผู้ใช้ได้"
          );
        }

        const response = await res.json();

        if (response.data) {
          setUserTestScore(response.data);
        } else {
          setUserTestScore(null);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTestScore();
    fetchVideo();
  }, [storedVideoId, storedUserId]);

  const handleUserTest = () => {
    if (!userTestScore) {
      navigate(`/testPage?type=${type}&id=${storedVideoId}`);
    } else {
      navigate(`/testResultPage?type=${type}&id=${storedVideoId}`);
    }
  };

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
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex">
          <div className=" min-h-screen">
            <SideBar />
          </div>

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
                {storedUserRole && (
                  <div className="mb-2">
                    <button
                      className="bg-[#2b4d92] hover:bg-[#3a5b9c] text-white p-2 rounded-md w-36"
                      onClick={() => navigate(`/testCreate?type=${type}&id=${storedVideoId}`)}
                    >
                      เพิ่มแบบทดสอบ
                    </button>
                  </div>
                )}

                <div className="mb-2">
                  <button
                    className="bg-[#1c7d98] hover:bg-[#2d869f] text-white p-2 rounded-md cursor-pointer w-36"
                    onClick={handleUserTest}
                  >
                    ทดสอบความเข้าใจ
                  </button>
                </div>

                <div>
                  <button
                    className="bg-[#0c7b6a] hover:bg-[#218c7c] text-white p-2 rounded-md cursor-pointer w-36"
                    onClick={() => navigate("/videoMain")}
                  >
                    &lt; กลับไปหน้าหลัก
                  </button>
                </div>
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
