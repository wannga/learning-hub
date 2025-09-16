import React, { useState } from "react";
import Header from "./bar/Header.tsx";
import SideBar from "./bar/Sidebar.tsx";
import { useNavigate } from "@remix-run/react";
import axios from "axios";

function VocabularyCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vocab: "",
    thai: "",
    definition: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.vocab || !formData.thai || !formData.definition) {
    setError("Please fill in all required fields.");
    return;
  }

  try {
    const requestBody = {
      vocab: formData.vocab,
      thai: formData.thai,
      definition: formData.definition,
    };

    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/createVocab`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      setSuccess("Vocab created successfully.");
      setError("");
      setFormData({
        vocab: '',
        thai: '',
        definition: '',
      });
    }
  } catch (err: any) {
    console.error("Submit error:", err);
    if (err.response && err.response.data.message) {
      setError(err.response.data.message);
    } else {
      setError("Server error. Please try again.");
    }
  }
};

  return (
    <div className="flex flex-col min-h-screen h-full bg-gray-100">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex min-h-screen h-full">
        <div className=" min-h-screen">
            <SideBar />
          </div>

        <div className="w-10/12 mx-auto bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-6">เพิ่มคำศัพท์</h1>

          {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Vocabulary*</label>
              <input
                type="text"
                name="vocab"
                value={formData.vocab}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block font-semibold">Thai*</label>
              <input
                type="text"
                name="thai"
                value={formData.thai}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="คำแปล"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Definition*</label>
              <textarea
                name="definition"
                value={formData.definition}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#0c7b6a] text-white px-6 py-2 rounded hover:bg-[#2d8f80]"
            >
              Create Vocabulary
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VocabularyCreate;
