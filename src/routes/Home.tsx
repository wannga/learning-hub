import React from "react";
import SideBar from "../components/Sidebar.tsx";
import Header from "../components/Header.tsx";
import { Clock, User } from "lucide-react";
import { useNavigate } from "@remix-run/react";

const articles = [
  {
    id: 1,
    title: "วางแผนมรดกส่งต่อความมั่งคั่ง",
    description:
      "วางแผนมรดกเพื่อความอุ่นใจเพื่อคนที่รัก การวางแผนทางการเงินเพื่ออนาคตที่มั่นคง",
    time: "1 ชม. 30 นาที",
    author: "ดร.เกษรา ธัญลักษณ์ภาคย์",
    image: "/images/WMD1601.jpg",
    tag: "มรดก",
    link: "https://elearning.set.or.th/SETGroup/courses/1705/info",
  },
  {
    id: 2,
    title: "วางแผนมรดกส่งต่อความมั่งคั่ง",
    description:
      "วางแผนมรดกเพื่อความอุ่นใจเพื่อคนที่รัก การวางแผนทางการเงินเพื่ออนาคตที่มั่นคง",
    time: "1 ชม. 30 นาที",
    author: "ดร.เกษรา ธัญลักษณ์ภาคย์",
    image: "/images/WMD1601.jpg",
  },
  {
    id: 3,
    title: "วางแผนมรดกส่งต่อความมั่งคั่ง",
    description:
      "วางแผนมรดกเพื่อความอุ่นใจเพื่อคนที่รัก การวางแผนทางการเงินเพื่ออนาคตที่มั่นคง",
    time: "1 ชม. 30 นาที",
    author: "ดร.เกษรา ธัญลักษณ์ภาคย์",
    image: "/images/WMD1601.jpg",
  },
];

const cases = [
  {
    id: 1,
    title: "วางแผนมรดกส่งต่อความมั่งคั่ง",
    description:
      "วางแผนมรดกเพื่อความอุ่นใจเพื่อคนที่รัก การวางแผนทางการเงินเพื่ออนาคตที่มั่นคง",
    time: "1 ชม. 30 นาที",
    author: "ดร.เกษรา ธัญลักษณ์ภาคย์",
    image: "/images/WMD1601.jpg",
    tag: "มรดก",
    link: "https://elearning.set.or.th/SETGroup/courses/1705/info",
  },
  {
    id: 2,
    title: "วางแผนมรดกส่งต่อความมั่งคั่ง",
    description:
      "วางแผนมรดกเพื่อความอุ่นใจเพื่อคนที่รัก การวางแผนทางการเงินเพื่ออนาคตที่มั่นคง",
    time: "1 ชม. 30 นาที",
    author: "ดร.เกษรา ธัญลักษณ์ภาคย์",
    image: "/images/WMD1601.jpg",
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
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

            {/* Article Cards */}
            <h1 className="ml-20 my-4 font-bold text-2xl">บทความทั้งหมด</h1>
            <div className="flex flex-col items-center justify-center">
            <section className="px-6 pb-6 border-b-2 border-black">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article) => (
                  <a
                    key={article.id}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer block"
                  >
                    <div className="relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover"
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
                        {article.tag && (
                          <span className=" bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {article.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="text-right mt-4">
                <button 
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => {
                    navigate("/articles")
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
            <section className="px-6 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cases.map((caseStudy) => (
                  <a
                    key={caseStudy.id}
                    href={caseStudy.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer block"
                  >
                    <div className="relative">
                      <img
                        src={caseStudy.image}
                        alt={caseStudy.title}
                        className="w-full h-48 object-cover"
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
                        {caseStudy.tag && (
                          <span className=" bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                            {caseStudy.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
                <div className="text-right mt-4">
                  <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => navigate("/articles")}>
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
