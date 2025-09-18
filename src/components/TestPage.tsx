import React, { useEffect, useState } from "react";
import SideBar from "./bar/Sidebar.tsx";
import Header from "./bar/Header.tsx";
import { useNavigate, useLocation } from "@remix-run/react";
import { API_CONFIG } from "./../config/api.js";

type TestChoice = {
  id: number;
  choice_text: string;
  correct: boolean;
};

type TestQuestion = {
  id: number;
  question: string;
  choices: TestChoice[];
  course_type: string;
  course_id: number;
};

const TestPage: React.FC = () => {
  const [testData, setTestData] = useState<TestQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [submitting, setSubmitting] = useState(false);
  const storedUserId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type");
  const id = params.get("id");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let url = "";
        if (type === "video") {
          url = `${API_CONFIG.BASE_URL}/getTestsForVideo/${id}`;
        } else if (type === "article") {
          url = `${API_CONFIG.BASE_URL}/getTestsForArticle/${id}`;
        }

        if (!url) return;
        const res = await fetch(url);
        const data = await res.json();
        setTestData(data.sort((a: any, b: any) => a.id - b.id));
      } catch (err) {
        console.error("Error fetching test questions:", err);
      }
    };

    fetchQuestions();
  }, [type, id]);

  const handleChoiceChange = (questionId: number, choiceId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const handleBackButton = () => {
    if (type === "video") {
      navigate(`/videoMain`);
    } else {
      navigate(`/articleMain`);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      let test_score = 0;
      let totalQuestions = 0;

      for (const [questionIdStr, choiceId] of Object.entries(answers)) {
        const questionId = parseInt(questionIdStr, 10);
        const question = testData.find((q) => q.id === questionId);
        if (!question) continue;

        const selectedChoice = question.choices.find((c) => c.id === choiceId);

        if (selectedChoice) {
          totalQuestions++;
          if (selectedChoice.correct) {
            test_score++;
          }
        }
      }
      const sum_score =
        totalQuestions > 0 ? (test_score / totalQuestions) * 100 : 0;

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/saveTestScore/${storedUserId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseType: type,
            courseId: id,
            score: Math.ceil(sum_score),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update test score");
      }

      navigate(`/testResultPage?type=${type}&id=${id}`);
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("There was a problem submitting your test. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex w-full">
        <div className=" min-h-screen">
          <SideBar />
        </div>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans p-6 w-full">
          <div className=" w-full bg-white shadow-lg rounded-2xl p-6 space-y-8">
            <h1 className="text-3xl font-bold text-center text-gray-800">
              แบบทดสอบความเข้าใจ
            </h1>

            {testData.length === 0 ? (
              <p>ยังไม่มีแบบทดสอบสำหรับบทเรียนนี้</p>
            ) : (
              <div className="space-y-6">
                {testData.map((q, questionIndex) => (
                  <div
                    key={q.id}
                    className="bg-white p-4 rounded-2xl shadow-md border"
                  >
                    <h2 className="font-semibold text-lg mb-3">
                      {questionIndex + 1}. {q.question}
                    </h2>

                    <div className="space-y-4">
                      {q.choices.map((choice) => (
                        <label
                          key={choice.id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={choice.id}
                            checked={answers[q.id] === choice.id}
                            onChange={() => handleChoiceChange(q.id, choice.id)}
                            className="text-blue-500 focus:ring-blue-400"
                          />
                          <span>{choice.choice_text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center">
              {testData.length !== 0 ? (
                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting || Object.keys(answers).length < testData.length
                  }
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl shadow-md font-semibold transition disabled:opacity-50"
                >
                  {submitting ? "กำลังส่งคำตอบ..." : "ส่งคำตอบ"}
                </button>
              ) : (
                <button
                  onClick={handleBackButton}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
                >
                  กลับหน้าบทเรียน
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
