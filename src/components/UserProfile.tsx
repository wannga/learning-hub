import React, { useEffect, useState, useCallback } from "react";
import SideBar from "./bar/Sidebar.tsx";
import Header from "./bar/Header.tsx";
import { Clock } from "lucide-react";
import { useNavigate } from "@remix-run/react";
import UserTagsProgress from "./bar/UserTagsProgress.tsx";

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
  password: string;
  signup_date: Date;
  is_admin: boolean;
  career: string | null;
  experience: string | null;
  email: string | null;
  image: string | null;
  article_history: number[];
  casestudy_history: number[];
  video_history: number[];
  quiz_score: number;
};

type InvestorType = {
  name: string;
  min_score: number;
  max_score: number;
  description: string;
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudies[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userResult, setUserResult] = useState<InvestorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const storedUserId = sessionStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");

  const investorTypes: InvestorType[] = [
    {
      name: "Defensive",
      min_score: 1,
      max_score: 18,
      description:
        "คุณเป็นนักลงทุนเชิงป้องกัน (Defensive) ที่ให้ความสำคัญกับการรักษาเงินลงทุนปัจจุบันมากกว่าการแสวงหาผลตอบแทนที่สูงขึ้น",
    },
    {
      name: "Conservative",
      min_score: 19,
      max_score: 39,
      description:
        "คุณเป็นนักลงทุนเชิงอนุรักษ์ (Conservative) ที่มุ่งหวังรายได้เป็นหลัก และอาจมีการเติบโตของเงินทุนบ้าง คุณชอบการลงทุนที่มีความผันผวนต่ำ และยอมรับผลตอบแทนที่ต่ำกว่าได้",
    },
    {
      name: "Balanced",
      min_score: 40,
      max_score: 64,
      description:
        "คุณเป็นนักลงทุนสมดุล (Balanced) ที่เข้าใจพฤติกรรมของตลาดการลงทุนบ้าง และชอบความสมดุลระหว่างการเติบโตของเงินทุนและความปลอดภัยของเงินต้น คุณยอมรับความเสี่ยงระยะสั้นบางส่วนเพื่อแลกกับการเติบโตในระยะยาว",
    },
    {
      name: "Assertive",
      min_score: 65,
      max_score: 88,
      description:
        "คุณเป็นนักลงทุนเชิงรุก (Assertive) ที่ให้ความสำคัญกับการเติบโตของเงินทุนระยะยาว และยอมรับความผันผวนและความเสี่ยงที่สูงขึ้นในระยะสั้นเพื่อโอกาสในการสร้างผลตอบแทนที่ดีกว่า",
    },
    {
      name: "Aggressive",
      min_score: 89,
      max_score: 100,
      description:
        "คุณเป็นนักลงทุนเชิงรุกขั้นสูง (Aggressive) ที่มุ่งเน้นผลตอบแทนสูงสุดในระยะยาว คุณเต็มใจรับความเสี่ยงและความผันผวนของมูลค่าการลงทุนในระดับสูงมากเพื่อแลกกับโอกาสสร้างผลตอบแทนที่มากกว่า",
    },
  ];

  const getUserResult = useCallback((score: number): InvestorType | null => {
    return (
      investorTypes.find(
        (type) => score >= type.min_score && score <= type.max_score
      ) || null
    );
  }, []);

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
    navigate("/caseStudyPage");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!storedUserId) {
          setError("No userId found in sessionStorage");
          return;
        }

        const res = await fetch(
          `http://localhost:3001/getUserById/${storedUserId}`
        );
        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดผู้ใช้ได้");
        }

        const data: User = await res.json();
        setUser(data);

        if (data.quiz_score !== undefined && data.quiz_score !== null) {
          const result = getUserResult(data.quiz_score);
          setUserResult(result);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/getUserVideoHistory/${storedUserId}`
        );
        if (!res.ok) throw new Error("Failed to load videos");
        const data = await res.json();
        if (Array.isArray(data)) {
          setVideos(data.slice(0, 3));
        } else {
          setVideos([]);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred");
      }
    };

    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/getUserArticleHistory/${storedUserId}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setArticles(data.slice(0, 3));
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error("Error fetching Articles:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCaseStudy = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/getUserCaseStudyHistory/${storedUserId}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setCaseStudies(data.slice(0, 3));
        } else {
          setCaseStudies([]);
        }
      } catch (error) {
        console.error("Error fetching CaseStudies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchVideos();
    fetchArticles();
    fetchCaseStudy();
  }, [storedUserId, getUserResult]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">กำลังโหลด...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans min-w-full">
      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Header */}
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex min-h-screen min-w-full">
          <div className=" min-h-screen">
            <SideBar />
          </div>

          <div className="flex flex-col min-w-[80rem]">
            {/* User Profile Card */}
            <div className="bg-[#f6f6f6] rounded-lg shadow-md p-6 mt-8 mb-4 mx-20">
              <div className="flex items-center space-x-6">
                {/* Profile Picture */}
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.image && !user.image.includes("[object Object]") ? (
                    <img
                      src={
                        user.image
                          ? `data:image/jpeg;base64,${user.image}`
                          : "/images/profile.jpg"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src="/images/profile.jpg"
                        alt="Default Profile"
                        className="w-full h-full object-cover"
                      />
                    </>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {user?.username || "User"}
                  </h1>
                  <div className="text-black space-y-1">
                    <p>อาชีพ: {user?.career || "-"}</p>
                    <p>ประสบการณ์ลงทุน: {user?.experience || "-"}</p>
                    <p>
                      รูปแบบการลงทุน:{" "}
                      {user?.quiz_score === 0 ? (
                        <button 
                          onClick={()=>navigate('/quizPage')} 
                          className="text-blue-600 underline hover:text-blue-800 bg-none border-none cursor-pointer"
                        >
                          คลิกเพื่อหารูปแบบการลงทุนที่เหมาะกับคุณเลย
                        </button>
                      ) : (
                        userResult?.name || "-"
                      )}
                    </p>
                    <p>{user?.email || "-"}</p>
                    {user?.signup_date && (
                      <p>
                        เข้าร่วมเมื่อ:{" "}
                        {new Date(user.signup_date).toLocaleDateString("th-TH")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/userEdit")}
                  className="bg-[#0c7b6a] hover:bg-[#218c7c] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  แก้ไขโปรไฟล์
                </button>
              </div>
            </div>

            <div className="px-20">
              {/* Video Cards */}
              <h1 className="my-4 font-bold text-2xl">ประวัติการดูวิดีโอ</h1>
              <section className="pb-6 border-b-2 border-black">
                {!videos || videos.length === 0 ? (
                  <p className="text-gray-500 italic">
                    ยังไม่มีประวัติการดูวิดีโอ
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {videos.map((video) => {
                      const tags = processTags(video.tag);
                      return (
                        <button
                          key={video.id}
                          onClick={() => handleVideoSelect(video.id)}
                          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer text-left w-full"
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
                )}
                <div className="text-right mt-4">
                  <button
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => {
                      navigate("/videoHistory");
                    }}
                  >
                    ประวัติการดูวิดีโอทั้งหมด &gt;
                  </button>
                </div>
              </section>

              {/* Article Cards */}
              <h1 className="my-4 font-bold text-2xl">ประวัติการอ่านบทความ</h1>
              <section className="pb-6 border-b-2 border-black">
                {!articles || articles.length === 0 ? (
                  <p className="text-gray-500 italic">
                    ยังไม่มีประวัติการอ่านบทความ
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {articles.map((article) => {
                      const tags = processTags(article.tag);

                      return (
                        <button
                          key={article.id}
                          onClick={() => handleArticleSelect(article.id)}
                          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer text-left w-full"
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
                )}
                <div className="text-right mt-4">
                  <button
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => {
                      navigate("/articleHistory");
                    }}
                  >
                    ประวัติการอ่านบทความทั้งหมด &gt;
                  </button>
                </div>
              </section>

              {/* Case Cards */}
              <h1 className="my-4 font-bold text-2xl">ประวัติการดูกรณีศึกษา</h1>
              <section className="pb-6">
                {!caseStudies || caseStudies.length === 0 ? (
                  <p className="text-gray-500 italic">
                    ยังไม่มีประวัติการดูกรณีศึกษา
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {caseStudies.map((caseStudy) => {
                      const tags = processTags(caseStudy.tag);

                      return (
                        <button
                          key={caseStudy.id}
                          onClick={() => handleCaseStudySelect(caseStudy.id)}
                          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer text-left w-full"
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
                )}
                <div className="text-right mt-4">
                  <button
                    className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => navigate("/caseStudyHistory")}
                  >
                    ประวัติการดูกรณีศึกษาทั้งหมด &gt;
                  </button>
                </div>
              </section>
            </div>

            {/* Progress Section */}
            <UserTagsProgress />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;