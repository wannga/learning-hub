import React, { useState, useRef } from "react";
import Header from "./bar/Header.tsx";
import SideBar from "./bar/Sidebar.tsx";
import { useNavigate } from "@remix-run/react";
import axios from "axios";

function CaseStudyCreate() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    author: "",
    tag: "",
    link: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Image size should be less than 10MB.");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file.");
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.time || !formData.author || !formData.link) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const submitData = new FormData();
      
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('time', formData.time.trim());
      submitData.append('author', formData.author.trim());
      submitData.append('tag', formData.tag.trim());
      submitData.append('link', formData.link.trim());

      if (selectedFile) {
        submitData.append('image', selectedFile);
      }

      let hasData = false;
      for (let [key, value] of submitData.entries()) {
        hasData = true;
        break;
      }
      
      if (!hasData) {
        console.error('FormData is empty!');
        setError('Form data is empty. Please try again.');
        return;
      }

      console.log('Sending request to server...');
      
      const response = await axios.post("http://localhost:3001/createCaseStudy", submitData, {
        headers: {
         
        },
        timeout: 30000,
      });

      if (response.status === 201) {
        setSuccess("Case study created successfully.");
        setError("");
        setTimeout(() => navigate("/caseStudyMain"), 1500);
      }
    } catch (err: any) {
      
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Server error: ${JSON.stringify(err.response.data)}`);
        }
      } else if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
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
          <h1 className="text-2xl font-bold mb-6">เพิ่ม Case Study</h1>

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
                placeholder="DD/MM/YYYY"
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Author*</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
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
              <label className="block font-semibold">Case Study Link*</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="e.g. https://google.com/..."
                required
              />
            </div>

            <div>
              <label className="block font-semibold">Image</label>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full border px-4 py-2 rounded"
                accept="image/*"
              />
              {selectedFile && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#0c7b6a] text-white px-6 py-2 rounded hover:bg-[#2d8f80]"
            >
              Create Case Study
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CaseStudyCreate;