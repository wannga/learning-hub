import React, { useEffect, useState } from "react";
import SideBar from "./bar/Sidebar.tsx";
import { Clock, User } from "lucide-react";
import Header from "./bar/Header.tsx";
import { useNavigate } from "@remix-run/react";
import { API_CONFIG } from "./../config/api.js";

type Video = {
  id: number;
  title: string;
  description: string;
  time: string;
  creator: string;
  tag: string[] | null;
  link: string;
};

export default function VideoMain() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const storedUserRole = sessionStorage.getItem("userRole") === "true";
  const storedUserId = sessionStorage.getItem("userId");

  const handleVideoSelect = async (videoId: number) => {
    sessionStorage.setItem("currentVideoId", JSON.stringify(videoId));

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/addVideoToHistory/${storedUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) throw new Error(`Failed: ${response.status}`);

      navigate("/videoPage");
    } catch (error) {
      console.error("Error adding to history:", error);
    }
  };

  const hasValidTags = (tag: string[] | null) => {
    return Array.isArray(tag) && tag.some((t) => t.trim() !== "");
  };

  const getDisplayTags = (tag: string[] | null) => {
    return hasValidTags(tag) ? tag!.slice(0, 2) : [];
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/getAllVideos`);
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const searchTags = searchTerm
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((tag) => tag.trim() !== "");

  const filteredVideos = videos.filter((video) => {
    if (searchTags.length === 0) return true;

    const matchesTags =
      video.tag &&
      searchTags.every((st) =>
        video.tag?.some((t) => t.toLowerCase().includes(st))
      );

    const matchesTitle = searchTags.every((st) =>
      video.title.toLowerCase().includes(st)
    );

    return matchesTags || matchesTitle;
  });

  if (loading) {
    return (
      <div className="text-center p-8 text-lg">กำลังโหลดข้อมูลวิดีโอ...</div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <main className="flex-1">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex flex-row">
          <div className="min-h-screen">
            <SideBar />
          </div>
          <section className="flex-1 p-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-row justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">
                    วิดีโอทั้งหมด
                  </h2>
                  <p className="text-gray-600 mb-2 text-base">
                    เรียนรู้แนวทางการลงทุน สร้างความมั่งคั่งให้กับชีวิตในระยะยาว
                  </p>
                </div>
                {storedUserRole && (
                  <button
                    className="bg-[#0c7b6a] hover:bg-[#218c7c] text-white p-2 rounded-md h-10 w-28"
                    onClick={() => navigate("/videoCreate")}
                  >
                    เพิ่มวิดีโอ
                  </button>
                )}
              </div>
              <div className="border-t-[1px] border-gray-700 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {filteredVideos.map((video) => (
                  <button
                    key={video.id}
                    className="flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer h-full"
                    onClick={() => handleVideoSelect(video.id)}
                  >
                    <div className="relative aspect-video">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={video.link}
                        title={video.title}
                        allowFullScreen
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2 text-start">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 mb-2 text-sm leading-relaxed line-clamp-3 text-start">
                        {video.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm font-normal mb-1">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{video.creator}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{video.time}</span>
                        </div>
                        {hasValidTags(video.tag) && (
                          <div className="flex gap-1">
                            {getDisplayTags(video.tag).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
