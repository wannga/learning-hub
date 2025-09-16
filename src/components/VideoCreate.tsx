import React, { useState } from "react";
import Header from "./bar/Header.tsx";
import SideBar from "./bar/Sidebar.tsx";
import { useNavigate } from "@remix-run/react";
import axios from "axios";
import { API_CONFIG } from "./../config/api.js";

function VideoCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    creator: "",
    tag: "",
    link: "",
    objective: "",
    target: "",
    level: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.title || !formData.description || !formData.time || !formData.creator || !formData.link) {
    setError("Please fill in all required fields.");
    return;
  }

  try {
    const processedTags = formData.tag
      ? formData.tag.split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "")
      : [];

    console.log("Processed tags before sending:", processedTags);

    const requestBody = {
      title: formData.title,
      description: formData.description,
      time: formData.time,
      creator: formData.creator,
      tag: processedTags,
      link: formData.link,
      objective: formData.objective
        ? formData.objective.split(',').map((s) => s.trim()).filter(Boolean)
        : null,
      target: formData.target || null,
      level: formData.level || null,
    };

    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const response = await axios.post(`${API_CONFIG.BASE_URL}/createVideo`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201) {
      setSuccess("Video created successfully.");
      setError("");
      setTimeout(() => navigate("/videoMain"), 1500);
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex h-full">
        <div className=" min-h-screen">
            <SideBar />
          </div>

        <div className="w-10/12 mx-auto bg-white p-8 rounded shadow">
          <h1 className="text-2xl font-bold mb-6">เพิ่ม Video</h1>

          {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold">Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Time*</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="e.g. 10 นาที 20 วินาที"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Creator*</label>
              <input
                type="text"
                name="creator"
                value={formData.creator}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Objective</label>
              <input
                type="text"
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="e.g. เพื่อให้ผู้ใช้สามารถวางแผนในการลงทุนได้"
              />
            </div>

            <div>
              <label className="block font-semibold">Target</label>
              <input
                type="text"
                name="target"
                value={formData.target}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="e.g. ผู้ที่สนใจในการลงทุน"
              />
            </div>

            <div>
              <label className="block font-semibold">Level</label>
              <input
                type="text"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="e.g. มือใหม่ (beginner)"
              />
            </div>

            <div>
              <label className="block font-semibold">Tag (comma separated)</label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="e.g. มือใหม่, ลงทุน"
              />
            </div>

            <div>
              <label className="block font-semibold">Embeded Video Link*</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="e.g. https://youtube.com/..."
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#0c7b6a] text-white px-6 py-2 rounded hover:bg-[#2d8f80]"
            >
              Create Video
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VideoCreate;
