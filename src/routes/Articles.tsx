import React from "react";
import SideBar from "../components/Sidebar.tsx";
import { Clock, User } from "lucide-react";
import Header from "../components/Header.tsx";

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
  {
    id: 4,
    title: "วางแผนมรดกส่งต่อความมั่งคั่ง",
    description:
      "วางแผนมรดกเพื่อความอุ่นใจเพื่อคนที่รัก การวางแผนทางการเงินเพื่ออนาคตที่มั่นคง",
    time: "1 ชม. 30 นาที",
    author: "ดร.เกษรา ธัญลักษณ์ภาคย์",
    image: "/images/WMD1601.jpg",
  },
];

export default function Articles() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Main Content */}
      <main className="flex-1">
        {/* Topbar */}
        <Header/>

        <div className="flex flex-row">
          <SideBar />

          {/* Articles Section */}
          <section className="flex-1 p-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">
                บทความทั้งหมด
              </h2>
              <p className="text-gray-600 mb-2 text-base">
                เรียนรู้แนวทางการลงทุน สร้างความมั่งคั่งให้กับชีวิตในระยะยาว
              </p>

              <div className="border-t-[1px] border-gray-700 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        className="w-full h-408 object-cover"
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
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
