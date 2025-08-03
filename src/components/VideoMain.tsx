import React, { useEffect, useState } from "react";
import SideBar from "./bar/Sidebar.tsx";
import { Clock, User } from "lucide-react";
import Header from "./bar/Header.tsx";
import { useNavigate } from "@remix-run/react";

type Video = {
  id: number;
  title: string;
  description: string;
  time: string;
  creator: string;
  tag?: string;
  link: string;
};

export default function VideoMain() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const handleVideoSelect = (videoId: number) => {
    sessionStorage.setItem("currentVideoId", JSON.stringify(videoId));
    navigate("/videoPage");
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:3001/getAllVideos");
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

  if (loading) {
    return (
      <div className="text-center p-8 text-lg">กำลังโหลดข้อมูลวิดีโอ...</div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <main className="flex-1">
        <Header />
        <div className="flex flex-row">
          <SideBar />
          <section className="flex-1 p-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">
                วีดีโอทั้งหมด
              </h2>
              <p className="text-gray-600 mb-2 text-base">
                เรียนรู้แนวทางการลงทุน สร้างความมั่งคั่งให้กับชีวิตในระยะยาว
              </p>
              <div className="border-t-[1px] border-gray-700 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => {
                  let tags: string[] = [];
                  if (Array.isArray(video.tag)) {
                    tags = video.tag.filter(Boolean);
                  } else if (typeof video.tag === "string" && video.tag) {
                    const rawTag = video.tag;
                    if (rawTag.startsWith("{") && rawTag.endsWith("}")) {
                      tags = rawTag
                        .slice(1, -1)
                        .split(",")
                        .map((t) => t.trim().replace(/"/g, ""))
                        .filter(Boolean);
                    } else {
                      tags = rawTag
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                    }
                  }
                  
                  console.log("Full video object:", video);
                  console.log("Video tags:", video.tag, "Processed tags:", tags);

                  return (
                    <a
                      key={video.id}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer block"
                      onClick={() => handleVideoSelect(video.id)}
                    >
                      <div className="relative">
                        <iframe
                          className="w-full h-[14rem]"
                          src={video.link}
                          title={video.title}
                          allowFullScreen
                        />
                      </div>

                      <div className="p-6">
                        <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-gray-600 mb-2 text-sm leading-relaxed line-clamp-3">
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
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {tags.map((t, i) => (
                                <span
                                  key={i}
                                  className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}