import React, { useState, useRef } from "react";
import Header from "./bar/Header.tsx";
import SideBar from "./bar/Sidebar.tsx";
import { useNavigate } from "@remix-run/react";
import axios from "axios";
import { API_CONFIG } from "./../config/api.js";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      time: "",
      author: "",
      tag: "",
      link: "",
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || 
        !formData.time.trim() || !formData.author.trim() || !formData.link.trim()) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Validate URL format
    try {
      new URL(formData.link.trim());
    } catch {
      setError("Please enter a valid URL for the case study link.");
      setIsSubmitting(false);
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

      const response = await axios.post(`${API_CONFIG.BASE_URL}/createCaseStudy`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      if (response.status === 201) {
        setSuccess("Case study created successfully.");
        resetForm();
        setTimeout(() => navigate("/caseStudyMain"), 1500);
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else if (err.response?.status === 413) {
        setError("File too large. Please select a smaller image.");
      } else {
        setError("Failed to create case study. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-2xl font-bold mb-6">เพิ่ม Case Study</h1>

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
              <label className="block font-semibold">Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter case study title"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Enter case study description"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Date*</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="DD/MM/YYYY"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Author*</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter author name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Tag (comma separated)</label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. มือใหม่, ลงทุน, การเงิน"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Case Study Link*</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/case-study"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Image (Optional)</label>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
                disabled={isSubmitting}
              />
              {selectedFile && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Maximum file size: 10MB. Supported formats: JPG, PNG, GIF, WebP
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#0c7b6a] text-white px-8 py-3 rounded hover:bg-[#2d8f80] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Creating Case Study...' : 'Create Case Study'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CaseStudyCreate;