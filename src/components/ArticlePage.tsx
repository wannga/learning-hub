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
  image: Buffer | string | null; // Can be BLOB from database
  tag: string[] | null;
  link: string;
  objective: string;
  target: string;
  level: string;
  infoBox: string[] | null;
  sections: ArticleSection[];
};

const ArticlePage = ({ articles }) => {
  const navigate = useNavigate();
  const storedArticleId = sessionStorage.getItem("currentArticleId") || "1";
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
        console.log("Fetched article data:", data); 
        console.log("Article sections:", data.sections);
        console.log("Sections length:", data.sections?.length); 
        console.log("Sections type:", typeof data.sections);
        
        if (data.sections && data.sections.length > 0) {
          console.log("First section:", data.sections[0]);
          data.sections.forEach((section, index) => {
            console.log(`Section ${index}:`, {
              id: section.id,
              heading: section.heading,
              content: section.content,
              list: section.list,
              table_headers: section.table_headers,
              table_rows: section.table_rows
            });
          });
        } else {
          console.log("No sections found or sections is empty/null");
        }
        
        setArticle(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [storedArticleId]);

  const getImageSrc = (image: Buffer | string | null | any) => {
    if (!image) return "/images/default-article.jpg";
    
    if (typeof image === "string") {
      return image;
    }
    
    try {
      let uint8Array: Uint8Array;
      
      if (image instanceof Buffer) {
        uint8Array = new Uint8Array(image);
      } else if (image.data && Array.isArray(image.data)) {
        uint8Array = new Uint8Array(image.data);
      } else if (image.data && image.data.buffer) {
        uint8Array = new Uint8Array(image.data.buffer);
      } else {
        return "/images/default-article.jpg";
      }
      
      const base64 = btoa(String.fromCharCode(...uint8Array));
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Error converting image:", error);
      return "/images/default-article.jpg";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <SideBar />
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
              <div className="text-center text-red-500">{error}</div>
              <div className="text-center mt-4">
                <button 
                  onClick={() => navigate("/articles")}
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
        <Header />
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
      <Header />
      <div className="flex h-full">
        <SideBar />
        
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            
            {/* Article Header */}
            <div className="text-center p-8 pb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              
              {article.image && (
                <div className="mb-6">
                  <img
                    src={getImageSrc(article.image)}
                    alt="Article cover"
                    className="mx-auto max-h-80 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Table of Contents */}
            {article.infoBox && article.infoBox.length > 0 && (
              <div className="mx-8 mb-6">
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

            <div className="px-8 pb-8">
              {!article.sections && (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">No sections property found in article data</p>
                </div>
              )}
              
              {article.sections && article.sections.length === 0 && (
                <div className="text-center p-8 bg-gray-100 rounded-lg">
                  <p className="text-gray-600">Article sections array is empty</p>
                </div>
              )}
              
              {article.sections && article.sections.length > 0 ? (
                article.sections.map((section, index) => {
                  console.log(`Rendering section ${index}:`, section);
                  return (
                    <div key={section.id || index} className="mb-8">
                      <h3 className="font-bold text-xl mb-4 text-gray-900 border-b-2 border-gray-200 pb-2">
                        {index + 1}. {section.heading || 'No heading'}
                      </h3>

                      {/* Section Content */}
                      {section.content && section.content.length > 0 && (
                        <div className="mb-4">
                          {section.content.map((paragraph, i) => (
                            <p key={i} className="mb-3 text-gray-700 leading-relaxed">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Section List */}
                      {section.list && section.list.length > 0 && (
                        <ul className="list-disc pl-6 mb-4 space-y-1">
                          {section.list.map((item, i) => (
                            <li key={i} className="text-gray-700">{item}</li>
                          ))}
                        </ul>
                      )}

                      {/* Section Table */}
                      {section.table_headers && section.table_rows && 
                       section.table_headers.length > 0 && section.table_rows.length > 0 && (
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
                                    <td key={j} className="px-4 py-3 text-gray-700">
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
                  <p className="text-gray-600">No sections available to display</p>
                </div>
              )}
            </div>

            {/* Back Button */}
            <div className="text-right pb-8">
              <button 
                onClick={() => navigate("/articles")}
                className="bg-[#16a085] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#138d75] transition-colors shadow-sm"
              >
                &lt; กลับไปหน้าบทความ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;