import React, { useState } from "react";
import Header from "./bar/Header.tsx";
import SideBar from "./bar/Sidebar.tsx";
import { useLocation } from "@remix-run/react";
import axios from "axios";

function TestCreate() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const type = params.get("type") || "video";
  const id = params.get("id") || "";

  const [formData, setFormData] = useState({
    question: "",
    course_type: type,
    course_id: id,
  });

  const [choices, setChoices] = useState([
    { choice_text: "", correct: false },
    { choice_text: "", correct: false },
  ]);

  const [correctChoiceIndex, setCorrectChoiceIndex] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChoiceTextChange = (index: number, value: string) => {
    const updated = [...choices];
    updated[index].choice_text = value;
    setChoices(updated);
  };

  const handleCorrectChoiceChange = (index: number) => {
    const updated = choices.map(choice => ({ ...choice, correct: false }));
    updated[index].correct = true;
    setChoices(updated);
    setCorrectChoiceIndex(index);
  };

  const addChoice = () => {
    setChoices([...choices, { choice_text: "", correct: false }]);
  };

  const removeChoice = (index: number) => {
    if (choices.length <= 2) {
      setError("A test must have at least 2 choices.");
      return;
    }
    
    const updated = choices.filter((_, i) => i !== index);
    setChoices(updated);
    
    if (correctChoiceIndex === index) {
      setCorrectChoiceIndex(null);
      updated.forEach(choice => choice.correct = false);
    } else if (correctChoiceIndex !== null && correctChoiceIndex > index) {
      setCorrectChoiceIndex(correctChoiceIndex - 1);
    }
    
    setError(""); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question || !formData.course_id) {
      setError("Please fill in all required fields.");
      return;
    }

    if (choices.length < 2) {
      setError("Please provide at least 2 choices.");
      return;
    }

    if (choices.some(choice => !choice.choice_text.trim())) {
      setError("Please fill in all choice texts.");
      return;
    }

    if (!choices.some((c) => c.correct)) {
      setError("Please select the correct answer.");
      return;
    }

    try {
      const payload = {
        ...formData,
        course_id: parseInt(formData.course_id, 10),
        choices,
      };

      const response = await axios.post(
        "http://localhost:3001/createTest",
        payload
      );

      if (response.status === 201) {
        setSuccess("Test created successfully.");
        setError("");
        setFormData({
          question: "",
          course_type: type,
          course_id: id,
        });

        setChoices([
          { choice_text: "", correct: false },
          { choice_text: "", correct: false },
        ]);
        setCorrectChoiceIndex(null);
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Server error. Please try again."
        );
      } else {
        setError("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex h-full">
        <div className="min-h-screen">
          <SideBar />
        </div>

        <div className="w-10/12 mx-auto bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-6">เพิ่ม Test Question</h1>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Question*</label>
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="Enter your question here"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Course Type*</label>
              <select
                name="course_type"
                value={formData.course_type}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              >
                <option value="video">Video</option>
                <option value="article">Article</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold">Course ID*</label>
              <input
                type="number"
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="Enter course ID"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Choices* (Select one correct answer)</label>
              {choices.map((choice, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 mb-3 border p-3 rounded bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctChoice"
                      checked={choice.correct}
                      onChange={() => handleCorrectChoiceChange(index)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Correct
                    </span>
                  </div>
                  
                  <input
                    type="text"
                    placeholder={`Choice ${index + 1}`}
                    value={choice.choice_text}
                    onChange={(e) =>
                      handleChoiceTextChange(index, e.target.value)
                    }
                    className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  
                  {choices.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeChoice(index)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      ลบ
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addChoice}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Add Choice
              </button>
              
              {choices.length > 2 && (
                <p className="text-sm text-gray-600 mt-2">
                  * แบบทดสอบต้องมีตัวเลือกอย่างน้อย 2 ข้อ
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="bg-[#0c7b6a] text-white px-8 py-3 rounded hover:bg-[#2d8f80] transition-colors font-medium"
              >
                Create Test
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TestCreate;