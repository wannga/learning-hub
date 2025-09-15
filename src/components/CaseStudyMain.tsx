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
  image: string | null;
  tag: string[] | null;
  link: string;
};

export default function CaseStudyMain() {
  const navigate = useNavigate();
  const [caseStudies, setCaseStudies] = useState<CaseStudies[]>([]);
  const [loading, setLoading] = useState(true);
  const storedUserRole = sessionStorage.getItem("userRole") === "true";
  const storedUserId = sessionStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCaseStudySelect = async (casestudyId: number) => {
    sessionStorage.setItem("currentCaseStudyId", JSON.stringify(casestudyId));

    try {
      const response = await fetch(
        `http://localhost:3001/addCaseStudyToHistory/${storedUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ casestudyId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update history: ${response.status}`);
      }

      const data = await response.json();
      console.log("History updated:", data);
    } catch (error) {
      console.error("Error adding to history:", error);
    }
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
    const fetchCaseStudy = async () => {
      try {
        const response = await fetch("http://localhost:3001/getAllCaseStudy");
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

  const searchTags = searchTerm
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((tag) => tag.trim() !== "");

  const filteredCaseStudy = caseStudies.filter((article) => {
    if (searchTags.length === 0) return true;

    const matchesTags =
      article.tag &&
      searchTags.every((st) =>
        article.tag!.some((t) => t.toLowerCase().includes(st))
      );

    const matchesTitle = searchTags.every((st) =>
      article.title.toLowerCase().includes(st)
    );
    const matchesDescription = searchTags.every((st) =>
      article.description.toLowerCase().includes(st)
    );

    return matchesTags || matchesTitle || matchesDescription;
  });

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
                    กรณีศึกษาทั้งหมด
                  </h2>
                  <p className="text-gray-600 mb-2 text-base">
                    เรียนรู้แนวทางการลงทุน สร้างความมั่งคั่งให้กับชีวิตในระยะยาว
                  </p>
                </div>
                {storedUserRole && (
                  <button
                    className="bg-[#0c7b6a] hover:bg-[#218c7c] text-white p-2 rounded-md h-10 w-28"
                    onClick={() => navigate("/caseStudyCreate")}
                  >
                    เพิ่มกรณีศึกษา
                  </button>
                )}
              </div>

              <div className="border-t-[1px] border-gray-700 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCaseStudy.map((caseStudy) => {
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
                          src={
                            caseStudy.image
                              ? `data:image/jpeg;base64,${caseStudy.image}`
                              : "/images/com.jpg"
                          }
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
                          {hasValidTags(caseStudy.tag) && (
                            <div className="flex gap-1">
                              {getDisplayTags(caseStudy.tag).map(
                                (tag, index) => (
                                  <span
                                    key={index}
                                    className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium"
                                  >
                                    {tag}
                                  </span>
                                )
                              )}
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
