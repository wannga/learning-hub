import React, { useEffect, useState } from "react";
import SideBar from "./bar/Sidebar.tsx";
import { Clock, User } from "lucide-react";
import Header from "./bar/Header.tsx";

type CaseStudies = {
  id: number;
  title: string;
  description: string;
  time: string;
  author: string;
  image: string | null;
  tag: string[] | string | null;
  link: string;
};

export default function CaseStudyHistory() {
  const [caseStudies, setCaseStudies] = useState<CaseStudies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const storedUserId = sessionStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState(""); 

  const handleCaseStudySelect = async (casestudyId: number) => {
    sessionStorage.setItem("currentCaseStudyId", JSON.stringify(casestudyId));
  };

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getUserCaseStudyHistory/${storedUserId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        setCaseStudies(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching CaseStudies:", error);
        setError("ไม่สามารถโหลดข้อมูลกรณีศึกษาได้");
        setCaseStudies([]);
      } finally {
        setLoading(false);
      }
    };

    if (storedUserId) {
      fetchCaseStudy();
    } else {
      setLoading(false);
      setError("ไม่พบข้อมูลผู้ใช้");
    }
  }, [storedUserId]);

  if (loading) {
    return (
      <div className="text-center p-8 text-lg">กำลังโหลดข้อมูลกรณีศึกษา...</div>
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
        {/* Header */}
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />


        <div className="flex flex-row h-full">
          <SideBar />

          {/* Case Study Section */}
          <section className="flex-1 p-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-row justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">
                    ประวัติการดูกรณีศึกษาทั้งหมด
                  </h2>
                  <p className="text-gray-600 mb-2 text-base">
                    ประวัติการดูกรณีศึกษาทั้งหมด
                  </p>
                </div>
              </div>

              <div className="border-t-[1px] border-gray-700 mb-6" />

              {caseStudies.length === 0 ? (
                <div className="text-center p-12">
                  <div className="text-gray-500 text-lg mb-4">
                    ยังไม่มีประวัติการดูกรณีศึกษา
                  </div>
                  <p className="text-gray-400">
                    เมื่อคุณดูกรณีศึกษาแล้ว ประวัติจะแสดงที่นี่
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {caseStudies.map((caseStudy) => {
                    let tags: string[] = [];
                    if (Array.isArray(caseStudy.tag)) {
                      tags = caseStudy.tag.filter(Boolean);
                    } else if (
                      typeof caseStudy.tag === "string" &&
                      caseStudy.tag
                    ) {
                      const rawTag = caseStudy.tag;
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

                    console.log("Full case study object:", caseStudy);
                    console.log(
                      "Case study tags:",
                      caseStudy.tag,
                      "Processed tags:",
                      tags
                    );

                    return (
                      <a
                        key={caseStudy.id}
                        onClick={() => handleCaseStudySelect(caseStudy.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={caseStudy.link}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer block"
                      >
                        <div className="relative">
                          <img
                            src={caseStudy.image ? `data:image/jpeg;base64,${caseStudy.image}` : "/images/com.jpg"}
                            alt={caseStudy.title}
                            className="w-full h-48 object-cover overflow-hidden"
                          />
                        </div>

                        <div className="p-6">
                          <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2">
                            {caseStudy.title}
                          </h3>
                          <p className="text-gray-600 mb-2 text-sm leading-relaxed line-clamp-3">
                            {caseStudy.description}
                          </p>

                          <div className="flex items-center space-x-4 text-sm font-normal mb-1">
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{caseStudy.author}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{caseStudy.time}</span>
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
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}