import React, { useEffect, useState } from "react";
import SideBar from "./bar/Sidebar.tsx";
import Header from "./bar/Header.tsx";
import { useNavigate } from "@remix-run/react";

type Choice = {
  id: number;
  choice_text: string;
  score: number;
};

type Question = {
  id: number;
  question: string;
  choices: Choice[];
};

const QuizPage: React.FC = () => {
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [submitting, setSubmitting] = useState(false);
  const storedUserId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/getQuiz`);
        const data = await res.json();
        console.log("Fetched quiz data:", data);
        const sortedData = data.sort((a: Question, b: Question) => a.id - b.id);
        setQuizData(sortedData);
      } catch (err) {
        console.error("Error fetching quiz questions:", err);
      }
    };

    fetchQuestions();
  }, []);

  const handleChoiceChange = (questionId: number, choiceId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    let totalScore = 0;
    for (const q of quizData) {
      const chosenChoiceId = answers[q.id];
      if (chosenChoiceId !== null && chosenChoiceId !== undefined) {
        const selectedChoice = q.choices.find(
          (choice) => choice.id === chosenChoiceId
        );
        if (selectedChoice) {
          totalScore += selectedChoice.score;
        }
      }
    }

    console.log("Calculated score:", totalScore);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/updateQuizScore/${storedUserId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: totalScore }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update quiz score");
      }

      navigate("/quizResultPage");
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("There was a problem submitting your quiz. Try again.");
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
              คุณเป็นนักลงทุนแบบไหน
            </h1>

            {quizData.length === 0 ? (
              <p>Loading questions...</p>
            ) : (
              <div className="space-y-6">
                {quizData.map((q, questionIndex) => (
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
              <button
                onClick={handleSubmit}
                disabled={
                  submitting || Object.keys(answers).length < quizData.length
                }
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl shadow-md font-semibold transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Answers"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
