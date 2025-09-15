import React, { useEffect, useState } from "react";
import SideBar from "./bar/Sidebar.tsx";
import { Clock, User } from "lucide-react";
import Header from "./bar/Header.tsx";
import { useNavigate } from "@remix-run/react";

type Article = {
  id: number;
  title: string;
  description: string;
  time: string;
  author: string;
  image: string | null;
  tag: string[] | null;
  link: string;
  objective: string;
  target: string;
  level: string;
};

export default function ArticlesHistory() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const storedUserId = sessionStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");

  const handleArticleSelect = async (articleId: number) => {
    sessionStorage.setItem("currentArticleId", JSON.stringify(articleId));
    navigate("/articlePage");
  };

  const hasValidTags = (tag: string[] | null) => {
    if (!tag) return false;
    if (Array.isArray(tag))
      return tag.length > 0 && tag.some((t) => t.trim() !== "");
    if (typeof tag === "object" && Object.keys(tag).length === 0) return false;
    return false;
  };

  const getDisplayTags = (tag: string[] | null) => {
    if (!hasValidTags(tag)) return [];
    return Array.isArray(tag) ? tag.slice(0, 2) : [];
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/getUserArticleHistory/${storedUserId}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        setArticles(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching Articles:", error);
        setError("ไม่สามารถโหลดข้อมูลบทความได้");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    if (storedUserId) {
      fetchArticles();
    } else {
      setLoading(false);
      setError("ไม่พบข้อมูลผู้ใช้");
    }
  }, [storedUserId]);

  if (loading) {
    return (
      <div className="text-center p-8 text-lg">กำลังโหลดข้อมูลบทความ...</div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <main className="flex-1">
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="flex flex-row h-full">
            <SideBar />
            <section className="flex-1 p-8 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="text-center p-8">
                  <div className="text-red-500 text-lg mb-4">{error}</div>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    ลองใหม่อีกครั้ง
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="flex-1">
        {/* Topbar */}
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex flex-row h-full">
          <SideBar />

          {/* Articles Section */}
          <section className="flex-1 p-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-row justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">
                    ประวัติการอ่านบทความทั้งหมด
                  </h2>
                  <p className="text-gray-600 mb-2 text-base">
                    ประวัติการอ่านบทความทั้งหมด
                  </p>
                </div>
              </div>

              <div className="border-t-[1px] border-gray-700 mb-6" />

              {articles.length === 0 ? (
                <div className="text-center p-12">
                  <div className="text-gray-500 text-lg mb-4">
                    ยังไม่มีประวัติการอ่านบทความ
                  </div>
                  <p className="text-gray-400">
                    เมื่อคุณอ่านบทความแล้ว ประวัติจะแสดงที่นี่
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article) => (
                    <a
                      key={article.id}
                      onClick={() => handleArticleSelect(article.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer block"
                    >
                      <div className="relative">
                        <img
                          src={
                            article.image
                              ? `data:image/jpeg;base64,${article.image}`
                              : "/images/com.jpg"
                          }
                          alt={article.title}
                          className="w-full h-48 object-cover overflow-hidden"
                        />
                      </div>

                      <div className="p-6">
                        <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-2 text-sm leading-relaxed line-clamp-3">
                          {article.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm font-normal mb-1">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{article.author}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{article.time}</span>
                          </div>
                          {hasValidTags(article.tag) && (
                            <div className="flex gap-1">
                              {getDisplayTags(article.tag).map((tag, index) => (
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
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}