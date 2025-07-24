import React, { useState } from "react";
import { Search, Menu } from "lucide-react";
import SideBar from "../components/Sidebar.tsx";

const vocabularyData = {
  A: [
    {
      term: "Asset",
      thai: "สินทรัพย์",
      definition: "ทรัพย์สินที่มีมูลค่าและสามารถสร้างรายได้ในอนาคต",
    },
    {
      term: "Arbitrage",
      thai: "การเก็งกำไรโดยใช้ความแตกต่างราคา",
      definition: "การซื้อขายหลักทรัพย์เพื่อหาผลกำไรจากความแตกต่างของราคา",
    },
    {
      term: "Appreciation",
      thai: "การเพิ่มมูลค่า",
      definition: "การเพิ่มขึ้นของมูลค่าสินทรัพย์เมื่อเวลาผ่านไป",
    },
  ],
  B: [
    {
      term: "Bear Market",
      thai: "ตลาดหมี",
      definition: "สภาวะตลาดที่ราคาหลักทรัพย์ลดลงอย่างต่อเนื่อง",
    },
    {
      term: "Bond",
      thai: "พันธบัตร",
      definition: "หลักทรัพย์แสดงสิทธิเรียกร้องหนี้ที่ออกโดยรัฐบาลหรือเอกชน",
    },
    {
      term: "Bull Market",
      thai: "ตลาดวัว",
      definition: "สภาวะตลาดที่ราคาหลักทรัพย์เพิ่มขึ้นอย่างต่อเนื่อง",
    },
  ],
  C: [
    {
      term: "Capital Gain",
      thai: "กำไรจากการขาย",
      definition: "ผลกำไรที่ได้จากการขายสินทรัพย์ในราคาสูงกว่าราคาที่ซื้อ",
    },
    {
      term: "Commission",
      thai: "ค่าคอมมิชชั่น",
      definition: "ค่าธรรมเนียมที่จ่ายให้นายหน้าสำหรับการซื้อขายหลักทรัพย์",
    },
  ],
};

const alphabetLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function VocabularyPage() {
  const [vocabSearchTerm, setVocabSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("A");

  const filteredVocabulary = vocabularyData[selectedLetter] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <header className="flex items-center justify-between py-4 px-6 bg-[#0c7b6a] shadow-sm">
        <div className="flex items-center gap-6">
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="text-2xl font-bold text-gray-800">LOGO</div>
        </div>
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาหลักสูตรที่คุณสนใจ"
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="space-x-2">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            เข้าสู่ระบบ
          </button>
          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            ลงทะเบียน
          </button>
        </div>
      </header>
      
      <div className="flex flex-row min-h-screen">
        <SideBar />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="relative mb-8 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-green-600 p-12 text-white">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative z-10">
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ค้นหาคำศัพท์"
                      className="pl-12 pr-4 py-4 w-full rounded-xl border-0 text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-white"
                      value={vocabSearchTerm}
                      onChange={(e) => setVocabSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alphabet Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-1 mb-6">
              {alphabetLetters.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-10 h-10 rounded-full font-semibold transition-all duration-200 ${
                    selectedLetter === letter
                      ? "bg-teal-600 text-white shadow-lg"
                      : vocabularyData[letter]
                      ? "bg-white text-teal-600 hover:bg-teal-50 border border-teal-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!vocabularyData[letter]}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Vocabulary Section */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              {selectedLetter}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVocabulary.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.term}
                  </h3>
                  <p className="text-teal-600 font-medium mb-3">{item.thai}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>

            {filteredVocabulary.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">
                  ยังไม่มีคำศัพท์สำหรับตัวอักษร {selectedLetter}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
