import React, { useEffect, useState } from "react";
import SideBar from "./bar/Sidebar.tsx";
import Header from "./bar/Header.tsx";
import { Clock, User } from "lucide-react";
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

type Article = {
  id: number;
  title: string;
  description: string;
  time: string;
  author: string;
  image: Buffer | string | null;
  tag: string[] | string | null;
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
  image: Buffer | string | null; // Can be BLOB from database
  tag: string[] | string | null;
  link: string;
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleVideoSelect = (videoId: number) => {
    sessionStorage.setItem("currentVideoId", JSON.stringify(videoId));
    navigate("/videoPage");
  };

  const handleArticleSelect = (articleId: number) => {
    sessionStorage.setItem("currentArticleId", JSON.stringify(articleId));
    navigate("/articlePage");
  };

  const handleCaseStudySelect = (caseStudyId: number) => {
    sessionStorage.setItem("currentCaseStudyId", JSON.stringify(caseStudyId));
    // navigate("/caseStudyPage");
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('http://localhost:3001/getAllVideos');
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
          "http://localhost:3001/getAllArticlesBasic"
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
        const response = await fetch(
          "http://localhost:3001/getAllCaseStudy"
        );
        const data = await response.json();
        setCaseStudies(data);
      } catch (error) {
        console.error("Error fetching CaseStudies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, []);

  const processTags = (tag: string[] | string | null | undefined): string[] => {
    let tags: string[] = [];
    
    if (Array.isArray(tag)) {
      tags = tag.filter(Boolean);
    } else if (typeof tag === "string" && tag) {
      const rawTag = tag;
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
    
    return tags;
  };

  
  return (
    <div className="flex min-h-screen font-sans">
      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Header */}
        <Header />

        <div className="flex min-h-screen">
          <SideBar />

          <div className="flex flex-col">
            {/* Hero Section */}
            <section className="flex justify-center">
              <div className="w-full overflow-hidden">
                <img
                  src="/images/home.jpg"
                  alt="คุณเหมาะกับหลักสูตรไหน"
                  className="rounded-md shadow-md w-full"
                />
              </div>
            </section>

            {/* Video Cards */}
            <h1 className="ml-20 my-4 font-bold text-2xl">วีดีโอทั้งหมด</h1>
            <div className="flex flex-col items-center justify-center">
            <section className="pb-6 border-b-2 border-black w-[65rem]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {videos.map((video) => {
                  const tags = processTags(video.tag);
                  
                  return (
                    <a
                      key={video.id}
                      target="_blank"
                      onClick={() => handleVideoSelect(video.id)}
                      rel="noopener noreferrer"
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer block"
                    >
                      <div className="relative">
                        <iframe
                          className="w-full h-48 object-cover"
                          src={video.link}
                          title={video.title}
                          // allowFullScreen
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
                    </a>
                  );
                })}
              </div>
              <div className="text-right mt-4">
                <button 
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => {
                    navigate("/videoMain")
                  }}
                >
                  ดูวีดีโอทั้งหมด &gt;
                </button>
              </div>
            </section>
            </div>

            {/* Article Cards */}
            <h1 className="ml-20 my-4 font-bold text-2xl">บทความทั้งหมด</h1>
            <div className="flex flex-col items-center justify-center">
            <section className="pb-6 border-b-2 border-black w-[65rem]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article) => {
                  const tags = processTags(article.tag);
                  
                  return (
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
                              ? `data:image/jpeg;base64,${Buffer.from(
                                  article.image
                                ).toString("base64")}`
                              : "/images/com.jpg"
                          }
                          alt={article.title}
                          className="w-full h-408 object-cover"
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
                    </a>
                  );
                })}
              </div>
              <div className="text-right mt-4">
                <button 
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => {
                    navigate("/articleMain")
                  }}
                >
                  ดูบทความทั้งหมด &gt;
                </button>
              </div>
            </section>
            </div>

            {/* Case Cards */}
            <h1 className="ml-20 my-4 font-bold text-2xl">Case Study</h1>
            <div className="flex flex-col items-center justify-center">
            <section className="pb-6 border-b-2 border-black w-[65rem]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {caseStudies.map((caseStudy) => {
                  const tags = processTags(caseStudy.tag);
                  
                  return (
                    <a
                      key={caseStudy.id}
                      onClick={() => handleCaseStudySelect(caseStudy.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer block"
                    >
                      <div className="relative">
                        <img
                          src={
                            caseStudy.image
                              ? `data:image/jpeg;base64,${Buffer.from(
                                  caseStudy.image
                              ).toString("base64")}`
                              : "/images/com.jpg"
                          }
                          alt={caseStudy.title}
                          className="w-full h-408 object-cover"
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
                    </a>
                  );
                })}
              </div>
                <div className="text-right mt-4">
                  <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => navigate("/caseStudyMain")}>
                    Case study ทั้งหมด &gt;
                  </button>
              </div>
            </section>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 