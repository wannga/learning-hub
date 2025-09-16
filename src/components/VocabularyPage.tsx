"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import SideBar from "./bar/Sidebar.tsx";
import Header from "./bar/Header.tsx";
import { useNavigate } from "@remix-run/react";
import { API_CONFIG } from "./../config/api.js";

const alphabetLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function VocabularyPage() {
  const navigate = useNavigate();
  const storedUserRole = sessionStorage.getItem("userRole") === "true";
  const [vocabSearchTerm, setVocabSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [vocabularyData, setVocabularyData] = useState<Record<string, any[]>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVocab = async () => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/getAllVocab`);
        if (!res.ok) throw new Error("Failed to fetch vocabulary");
        const data = await res.json();

        const grouped: Record<string, any[]> = {};
        data.forEach((item: any) => {
          const firstLetter = item.vocab[0].toUpperCase();
          if (!grouped[firstLetter]) grouped[firstLetter] = [];
          grouped[firstLetter].push(item);
        });

        Object.keys(grouped).forEach((letter) => {
          grouped[letter] = grouped[letter].sort(
            (a, b) => a.vocab.localeCompare(b.vocab)
          );
        });

        setVocabularyData(grouped);
      } catch (err) {
        console.error("Error fetching vocabs:", err);
      }
    };

    fetchVocab();
  }, []);

  const filteredVocabulary =
    vocabularyData[selectedLetter]?.filter((item) =>
      item.vocab.toLowerCase().includes(vocabSearchTerm.toLowerCase()) || item.thai.includes(vocabSearchTerm)
    ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Header */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="flex flex-row">
        <div className="min-h-screen">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="w-full mx-20 px-6 py-8">
          <div className="text-end mb-4">
            {storedUserRole && (
              <button
                className="bg-[#0c7b6a] text-white p-2 rounded-md h-10 w-28"
                onClick={() => navigate("/vocabularyCreate")}
              >
                เพิ่มคำศัพท์
              </button>
            )}
          </div>

          {/* Hero Section */}
          <div className="relative mb-8 rounded-2xl overflow-hidden w-full">
            <div className="bg-gradient-to-r from-teal-600 to-green-600 p-12 text-white">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative z-10">
                <div className="max-w-md mx-auto ">
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
                    {item.vocab}
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
