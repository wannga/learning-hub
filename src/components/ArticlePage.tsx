import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "@remix-run/react";
import Header from "./bar/Header.tsx";
import SideBar from "./bar/Sidebar.tsx";

type ArticleSection = {
  id: number;
  articleId: number;
  heading: string;
  content: string[] | null;
  list: string[] | null;
  table_headers: string[] | null;
  table_rows: string[][] | null;
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
  infoBox: string[] | null;
  sections: ArticleSection[];
};

type UserTestScore = {
  id: number;
  course_type: string;
  course_id: number;
  score: number;
};

const ArticlePage = () => {
  const navigate = useNavigate();
  const storedArticleId = sessionStorage.getItem("currentArticleId") || "1";
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const storedUserId = sessionStorage.getItem("userId");
  const storedUserRole = sessionStorage.getItem("userRole") === "true";
  const [userTestScore, setUserTestScore] = useState<UserTestScore | null>(
    null
  );
  const type = "article";

  useEffect(() => {
    if (!storedArticleId) {
      setError("ไม่พบบทความ");
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/getArticle/${storedArticleId}`
        );
        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดบทความได้");
        }

        const data: Article = await res.json();

        setArticle(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserTestScore = async () => {
      try {
        if (!storedUserId) {
          console.warn("No userId found in sessionStorage");
          return;
        }

        const res = await fetch(
          `http://localhost:3001/getUserTestScore/${storedUserId}?courseType=${type}&courseId=${storedArticleId}`
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
    fetchArticle();
  }, [storedArticleId, storedUserId, type]);

  const getImageSrc = (image: string | null) => {
    const defaultImage = "/images/com.jpg";

    if (!image) {
      return defaultImage;
    }

    if (typeof image !== "string") {
      return defaultImage;
    }

    if (image.startsWith("data:image/")) {
      return image;
    }

    if (image.length > 0) {
      return `data:image/jpeg;base64,${image}`;
    }

    return defaultImage;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex h-full">
          <SideBar />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
              <div className="text-center">กำลังโหลดบทความ...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleUserTest = () => {
    if (!userTestScore) {
      navigate(`/testPage?type=${type}&id=${storedArticleId}`);
    } else {
      navigate(`/testResultPage?type=${type}&id=${storedArticleId}`);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex">
          <SideBar />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
              <div className="text-center text-red-500">{error}</div>
              <div className="text-center mt-4">
                <button
                  onClick={() => navigate("/articleMain")}
                  className="bg-[#16a085] text-white px-6 py-2 rounded-md hover:bg-[#138d75] transition-colors"
                >
                  กลับไปหน้าบทความ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="flex">
          <SideBar />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
              <div className="text-center">ไม่พบบทความ</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex h-full">
        <div className=" min-h-screen">
          <SideBar />
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Article Header */}
            <div className="text-center p-8 pb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              <div className="mx-auto mb-4">
                {article.image && (
                  <div>
                    <img
                      className="mx-auto"
                      src={getImageSrc(article.image)}
                      alt="Article cover"
                    />
                  </div>
                )}
              </div>

              {/* Article metadata */}
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-600 mb-4">
                <span>โดย: {article.author}</span>
                {article.time && <span>เวลาอ่าน: {article.time}</span>}
                {article.level && <span>ระดับ: {article.level}</span>}
              </div>

              {/* Tags */}
              {article.tag && article.tag.length > 0 && (
                <div className="flex justify-center gap-2 mb-2">
                  {article.tag.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Objectives and Targets */}
            {(article.objective || article.target) && (
              <div className="mx-8 mb-6 grid md:grid-cols-2 gap-4">
                {article.objective && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      วัตถุประสงค์
                    </h3>
                    <p className="text-blue-800 text-sm">{article.objective}</p>
                  </div>
                )}
                {article.target && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">
                      กลุ่มเป้าหมาย
                    </h3>
                    <p className="text-green-800 text-sm">{article.target}</p>
                  </div>
                )}
              </div>
            )}

            {/* Table of Contents */}
            {article.infoBox && article.infoBox.length > 0 && (
              <div className="mx-8 mb-6 bg-zinc-200 p-4 rounded-md">
                <h3 className="font-bold text-lg mb-3 text-gray-800">สารบัญ</h3>
                <ul className="space-y-1">
                  {article.infoBox.map((item, index) => (
                    <li key={index} className="text-gray-700 text-sm">
                      {index + 1}. {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div className="mb-4">
              {article.description && (
                <p className="text-gray-700 leading-relaxed mx-8">
                  {article.description}
                </p>
              )}
            </div>

            <div className="px-8">
              {!article.sections && (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">
                    No sections property found in article data
                  </p>
                </div>
              )}

              {article.sections && article.sections.length === 0 && (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">
                    Article sections array is empty
                  </p>
                </div>
              )}

              {article.sections && article.sections.length > 0 ? (
                [...article.sections]
                  .sort((a, b) => a.id - b.id)
                  .map((section, index) => {
                    return (
                      <div key={section.id || index} className="mb-8">
                        <h3 className="font-bold text-xl mb-4 text-gray-900 border-b-2 border-gray-200 pb-2">
                          {index + 1}. {section.heading || "No heading"}
                        </h3>

                        {/* Section Content */}
                        {section.content && section.content.length > 0 && (
                          <div className="mb-4">
                            {section.content.map((paragraph, i) => (
                              <p
                                key={i}
                                className="mb-3 text-gray-700 leading-relaxed"
                              >
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Section List */}
                        {section.list && section.list.length > 0 && (
                          <ul className="list-disc pl-6 mb-4 space-y-1">
                            {section.list.map((item, i) => (
                              <li key={i} className="text-gray-700">
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Section Table */}
                        {section.table_headers &&
                          section.table_rows &&
                          section.table_headers.length > 0 &&
                          section.table_rows.length > 0 && (
                            <div className="overflow-x-auto mb-4">
                              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                                <thead className="bg-gray-100">
                                  <tr>
                                    {section.table_headers.map((header, i) => (
                                      <th
                                        key={i}
                                        className="border-b border-gray-300 px-4 py-3 text-left font-semibold text-gray-700"
                                      >
                                        {header}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {section.table_rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                      {row.map((cell, j) => (
                                        <td
                                          key={j}
                                          className="px-4 py-3 text-gray-700"
                                        >
                                          {cell}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                      </div>
                    );
                  })
              ) : (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">
                    No sections available to display
                  </p>
                </div>
              )}
            </div>

            {/* External Link */}
            {article.link && (
              <div className="px-8 pb-4">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  อ่านเพิ่มเติม →
                </a>
              </div>
            )}

            {/* Back Button */}
            <div className="text-right pb-8">
              {storedUserRole && (
                <div className="mb-2">
                  <button
                    className="bg-[#2b4d92] hover:bg-[#3a5b9c] text-white p-2 rounded-md w-36"
                    onClick={() =>
                      navigate(`/testCreate?type=${type}&id=${storedArticleId}`)
                    }
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
                  onClick={() => navigate("/articleMain")}
                  className="bg-[#0c7b6a] hover:bg-[#218c7c] text-white p-2 rounded-md cursor-pointer w-36"
                >
                  &lt; กลับไปหน้าหลัก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
