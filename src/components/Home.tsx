import React, { useEffect, useState } from "react";
import SideBar from "./bar/Sidebar.tsx";
import Header from "./bar/Header.tsx";
import { Clock } from "lucide-react";
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

type CaseStudies = {
  id: number;
  title: string;
  description: string;
  time: string;
  author: string;
  image: string | null;
  tag: string[] | null;
  link: string;
};

type User = {
  id: number;
  username: string;
  quiz_score: number;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudies[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState("");
  const storedUserId = sessionStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const handleVideoSelect = (videoId: number) => {
    sessionStorage.setItem("currentVideoId", JSON.stringify(videoId));
    navigate("/videoPage");
  };

  const handleArticleSelect = async (articleId: number) => {
    sessionStorage.setItem("currentArticleId", JSON.stringify(articleId));

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/addArticleToHistory/${storedUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ articleId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update history: ${response.status}`);
      }

      const data = await response.json();
      console.log("History updated:", data);

      navigate("/articlePage");
    } catch (error) {
      console.error("Error adding to history:", error);
    }
  };

  const handleCaseStudySelect = (caseStudyId: number) => {
    sessionStorage.setItem("currentCaseStudyId", JSON.stringify(caseStudyId));
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/getAllVideos`);
        if (!res.ok) throw new Error("Failed to load videos");
        const data: Video[] = await res.json();

        setVideos(data.slice(0, 3));
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred");
      }
    };

    fetchVideos();

    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/getAllArticlesBasic`
        );
        const data = await response.json();

        setArticles(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching Articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();

    const fetchCaseStudy = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/getAllCaseStudy`);
        const data = await response.json();
        setCaseStudies(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching CaseStudies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();

    const fetchUser = async () => {
      try {
        if (!storedUserId) return;

        const res = await fetch(
          `${API_CONFIG.BASE_URL}/getUserById/${storedUserId}`
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
  }, [storedUserId]); // Added storedUserId to dependency array

  const hasValidTags = (tag: string[] | null) => {
    if (!tag) return false;
    if (Array.isArray(tag))
      return tag.length > 0 && tag.some((t) => t.trim() !== "");
    if (typeof tag === "object" && Object.keys(tag).length === 0) return false;
    return false;
  };

  const processTags = (tag: string[] | null) => {
    if (!hasValidTags(tag)) return [];
    return Array.isArray(tag) ? tag.slice(0, 2) : [];
  };

  const handleQuizClick = () => {
    if (!user) return;
    if (user.quiz_score === 0) {
      navigate("/quizPage");
    } else {
      navigate("/quizResultPage");
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className=" min-h-screen">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50">
          {/* Hero Section */}
          <section className="w-full">
            <div className="w-full overflow-hidden">
              <img
                src="/images/homemd.jpg"
                alt="คุณเป็นนักลงทุนแบบไหน"
                onClick={handleQuizClick}
                className="shadow-md w-full cursor-pointer"
              />
            </div>
          </section>

          {/* Content Container */}
          <div className="px-20">
            {/* Video Cards */}
            <h1 className="my-4 font-bold text-2xl">หลักสูตรวิดีโอ</h1>
            <section className="pb-6 border-b-2 border-black">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {videos.map((video) => {
                  const tags = processTags(video.tag);

                  return (
                    <button
                      key={video.id}
                      onClick={() => handleVideoSelect(video.id)}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer block text-left"
                    >
                      <div className="relative">
                        <iframe
                          className="w-full h-48 object-cover"
                          src={video.link}
                          title={video.title}
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2">
                          {video.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{video.time}</span>
                          </div>
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {tags.map((tag, index) => (
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
                  );
                })}
              </div>
              <div className="text-right mt-4">
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => {
                    navigate("/videoMain");
                  }}
                >
                  ดูวิดีโอทั้งหมด &gt;
                </button>
              </div>
            </section>

            {/* Article Cards */}
            <h1 className="my-4 font-bold text-2xl">หลักสูตรบทความ</h1>
            <section className="pb-6 border-b-2 border-black">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article) => {
                  const tags = processTags(article.tag);

                  return (
                    <button
                      key={article.id}
                      onClick={() => handleArticleSelect(article.id)}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer block text-left"
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

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2">
                          {article.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{article.time}</span>
                          </div>
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {tags.map((tag, index) => (
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
                  );
                })}
              </div>
              <div className="text-right mt-4">
                <button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => {
                    navigate("/articleMain");
                  }}
                >
                  ดูบทความทั้งหมด &gt;
                </button>
              </div>
            </section>

            {/* Case Cards */}
            <h1 className="my-4 font-bold text-2xl">หลักสูตรกรณีศึกษา</h1>
            <section className="pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {caseStudies.map((caseStudy) => {
                  const tags = processTags(caseStudy.tag);

                  return (
                    <button
                      key={caseStudy.id}
                      onClick={() => handleCaseStudySelect(caseStudy.id)}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer block text-left"
                    >
                      <div className="relative">
                        <img
                          src={
                            caseStudy.image
                              ? `data:image/jpeg;base64,${caseStudy.image}`
                              : "/images/com.jpg"
                          }
                          alt={caseStudy.title}
                          className="w-full h-48 object-cover overflow-hidden"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2">
                          {caseStudy.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{caseStudy.time}</span>
                          </div>
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {tags.map((tag, index) => (
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
                  );
                })}
              </div>
              <div className="text-right mt-4">
                <button
                  className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => navigate("/caseStudyMain")}
                >
                  ดูกรณีศึกษาทั้งหมด &gt;
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;