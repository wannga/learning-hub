import React, { useEffect, useState } from "react";
import SideBar from "./bar/Sidebar.tsx";
import { Clock, User } from "lucide-react";
import Header from "./bar/Header.tsx";
import { useNavigate } from "@remix-run/react";

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

export default function CaseStudyMain() {
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState<CaseStudies[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCaseStudySelect = (caseStudyId: number) => {
    sessionStorage.setItem("currentCaseStudyId", JSON.stringify(caseStudyId));
    // navigate("/caseStudyPage");
  };

  useEffect(() => {
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

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="flex-1">
        {/* Topbar */}
        <Header />

        <div className="flex flex-row h-full">
          <SideBar />

          {/* Case Study Section */}
          <section className="flex-1 p-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">
                case study ทั้งหมด
              </h2>
              <p className="text-gray-600 mb-2 text-base">
                เรียนรู้แนวทางการลงทุน สร้างความมั่งคั่งให้กับชีวิตในระยะยาว
              </p>

              <div className="border-t-[1px] border-gray-700 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((caseStudy) => {
                  let tags: string[] = [];
                  if (Array.isArray(caseStudy.tag)) {
                    tags = caseStudy.tag.filter(Boolean);
                  } else if (typeof caseStudy.tag === "string" && caseStudy.tag) {
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
                  console.log("Case study tags:", caseStudy.tag, "Processed tags:", tags);

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
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}