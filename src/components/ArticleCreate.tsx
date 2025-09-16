import React, { useState, useRef } from 'react';
import Header from "./bar/Header.tsx";
import SideBar from "./bar/Sidebar.tsx";
import { useNavigate } from "@remix-run/react";

interface Article {
  title: string;
  description: string;
  time: string;
  author: string;
  image: File | null;
  tag: string[];
  link: string;
  objective: string;
  target: string;
  level: string;
  infoBox: string[];
  sections: ArticleSection[];
}

interface ArticleSection {
  heading: string;
  content: string[];
  list: string[];
  table_headers: string[];
  table_rows: string[][];
}

export default function ArticleCreate() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const [article, setArticle] = useState<Article>({
    title: '',
    description: '',
    time: '',
    author: '',
    image: null,
    tag: [],
    link: '',
    objective: '',
    target: '',
    level: '',
    infoBox: [],
    sections: [],
  });

  const [sections, setSections] = useState([
    {
      heading: '',
      content: [''],
      list: [''],
      table_headers: [''],
      table_rows: [['']]
    }
  ]);

  const [tagInput, setTagInput] = useState('');
  const [infoBoxInput, setInfoBoxInput] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const CONTENT_SEPARATOR = '|||';
  const LIST_SEPARATOR = '###';
  const TABLE_ROW_SEPARATOR = '^^^';
  const TABLE_COL_SEPARATOR = '|||';

  const handleArticleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'image' && files) {
      const file = files[0];
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
        setArticle({ ...article, image: file });
        setError("");
      }
    } else {
      setArticle({ ...article, [name]: value });
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setArticle({ ...article, tag: tags });
  };

  const handleInfoBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInfoBoxInput(value);
    
    const infoBoxItems = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setArticle({ ...article, infoBox: infoBoxItems });
  };

  const handleSectionChange = (index: number, key: string, value: any) => {
    const updatedSections = [...sections];
    (updatedSections[index] as any)[key] = value;
    setSections(updatedSections);
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        heading: '',
        content: [''],
        list: [''],
        table_headers: [''],
        table_rows: [['']]
      }
    ]);
  };

  const compressImage = (
    file: File, 
    maxWidth: number = 800, 
    maxHeight: number = 600, 
    quality: number = 0.8
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      img.onload = () => {
        try {
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!article.title.trim() || !article.description.trim() || !article.author.trim()) {
      setError("Please fill in all required fields (Title, Description, Author).");
      setIsSubmitting(false);
      return;
    }

    try {
      let base64Image: string | null = null;

      if (article.image) {
        
        try {
          const compressedDataUrl = await compressImage(article.image);
          base64Image = compressedDataUrl;
          
          if (compressedDataUrl.length > 5 * 1024 * 1024) {
            setError("Image is too large even after compression. Please use a smaller image.");
            setIsSubmitting(false);
            return;
          }
        } catch (compressionError) {
          console.error('Image compression failed:', compressionError);
          setError("Failed to process image. Please try a different image.");
          setIsSubmitting(false);
          return;
        }
      }

      const cleanedSections = sections
        .filter(section => section.heading.trim() !== '')
        .map(section => ({
          heading: section.heading.trim(),
          content: section.content.filter(item => item.trim() !== ''),
          list: section.list.filter(item => item.trim() !== ''),
          table_headers: section.table_headers.filter(item => item.trim() !== ''),
          table_rows: section.table_rows.filter(row => row.some(cell => cell.trim() !== ''))
        }));

      const cleanedTags = article.tag.filter(tag => tag.trim() !== '');
      const cleanedInfoBox = article.infoBox.filter(item => item.trim() !== '');

      const payload = {
        title: article.title.trim(),
        description: article.description.trim(),
        time: article.time.trim(),
        author: article.author.trim(),
        image: base64Image,
        tag: cleanedTags.length > 0 ? cleanedTags : [],
        link: article.link.trim(),
        objective: article.objective.trim(),
        target: article.target.trim(),
        level: article.level.trim(),
        infoBox: cleanedInfoBox.length > 0 ? cleanedInfoBox : [],
        sections: cleanedSections,
      };

      console.log('Sending payload:', {
        ...payload,
        image: payload.image ? 'BASE64_DATA_PRESENT' : null,
        sections: `${payload.sections.length} sections`
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createArticle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();

      if (response.ok) {
        setSuccess("Article created successfully!");
        setArticle({
          title: '',
          description: '',
          time: '',
          author: '',
          image: null,
          tag: [],
          link: '',
          objective: '',
          target: '',
          level: '',
          infoBox: [],
          sections: [],
        });
        setSections([
          {
            heading: '',
            content: [''],
            list: [''],
            table_headers: [''],
            table_rows: [['']]
          }
        ]);
        setSelectedFile(null);
        setTagInput('');
        setInfoBoxInput('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setSuccess("Case study created successfully.");
        setError("");
        setTimeout(() => navigate("/ArticleMain"), 1500);
      } else {
        setError(result.message || result.details || "Something went wrong.");
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError("Failed to submit article. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-2xl font-bold mb-6">เพิ่ม Article</h1>

          {error && <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded">{success}</div>}

          <div className="space-y-4">
            {/* Basic Article Information */}
            <div>
              <label className="block font-semibold">Title*</label>
              <input
                type="text"
                name="title"
                value={article.title}
                onChange={handleArticleChange}
                className="w-full border px-4 py-2 rounded"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Description*</label>
              <textarea
                name="description"
                value={article.description}
                onChange={handleArticleChange}
                className="w-full border px-4 py-2 rounded"
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Time</label>
              <input
                type="text"
                name="time"
                value={article.time}
                onChange={handleArticleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="e.g. 5 นาที"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Author*</label>
              <input
                type="text"
                name="author"
                value={article.author}
                onChange={handleArticleChange}
                className="w-full border px-4 py-2 rounded"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Image</label>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                onChange={handleArticleChange}
                className="w-full border px-4 py-2 rounded"
                accept="image/*"
                disabled={isSubmitting}
              />
              {selectedFile && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold">Tags (comma separated)</label>
              <input
                type="text"
                value={tagInput}
                onChange={handleTagChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="e.g. มือใหม่, ลงทุน"
                disabled={isSubmitting}
              />
              {article.tag.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Preview: {article.tag.join(', ')}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold">Link</label>
              <input
                type="text"
                name="link"
                value={article.link}
                onChange={handleArticleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="e.g. https://example.com"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Objective</label>
              <textarea
                name="objective"
                value={article.objective}
                onChange={handleArticleChange}
                className="w-full border px-4 py-2 rounded"
                rows={3}
                placeholder="e.g. เพื่อให้ผู้อ่านเข้าใจถึงการลงทุน"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Target</label>
              <textarea
                name="target"
                value={article.target}
                onChange={handleArticleChange}
                className="w-full border px-4 py-2 rounded"
                rows={3}
                placeholder="e.g. ผู้ที่สนใจในการลงทุน"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Level</label>
              <input
                type="text"
                name="level"
                value={article.level}
                onChange={handleArticleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="e.g. มือใหม่ (beginner)"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block font-semibold">Info Box (comma separated)</label>
              <input
                type="text"
                value={infoBoxInput}
                onChange={handleInfoBoxChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="สารบัญ"
                disabled={isSubmitting}
              />
              {article.infoBox.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Preview: {article.infoBox.join(', ')}
                </p>
              )}
            </div>

            {/* Sections */}
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Article Sections</h2>
              
              {sections.map((section, index) => (
                <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">Section {index + 1}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold">Heading</label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                        className="w-full border px-4 py-2 rounded"
                        placeholder="หัวข้อ"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold">Content (separate paragraphs with |||)</label>
                      <textarea
                        value={section.content.join(CONTENT_SEPARATOR)}
                        onChange={(e) => handleSectionChange(index, 'content', e.target.value.split(CONTENT_SEPARATOR).map(item => item.trim()).filter(item => item !== ''))}
                        className="w-full border px-4 py-2 rounded"
                        rows={4}
                        placeholder="ย่อหน้าแรก||| ย่อหน้าที่สอง||| ย่อหน้าที่สาม"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ใช้ ||| เพื่อแบ่งย่อหน้า (เช่น: การลงทุนในหุ้นต้องระวัง||| ควรศึกษาข้อมูลก่อนลงทุน)
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold">List Items (separate with ###)</label>
                      <textarea
                        value={section.list.join(LIST_SEPARATOR)}
                        onChange={(e) => handleSectionChange(index, 'list', e.target.value.split(LIST_SEPARATOR).map(item => item.trim()).filter(item => item !== ''))}
                        className="w-full border px-4 py-2 rounded"
                        rows={3}
                        placeholder="รายการแรก### รายการที่สอง### รายการที่สาม"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ใช้ ### เพื่อแบ่งรายการ (เช่น: ตรวจสอบงบการเงิน### วิเคราะห์แนวโน้มตลาด)
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold">Table Headers (separate with |||)</label>
                      <input
                        type="text"
                        value={section.table_headers.join(TABLE_COL_SEPARATOR)}
                        onChange={(e) => handleSectionChange(index, 'table_headers', e.target.value.split(TABLE_COL_SEPARATOR).map(item => item.trim()).filter(item => item !== ''))}
                        className="w-full border px-4 py-2 rounded"
                        placeholder="หัวข้อที่ 1||| หัวข้อที่ 2||| หัวข้อที่ 3"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ใช้ ||| เพื่อแบ่งหัวข้อคอลัมน์
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold">Table Rows (^^^ separates rows, ||| separates columns)</label>
                      <textarea
                        value={section.table_rows.map(row => row.join(TABLE_COL_SEPARATOR)).join(TABLE_ROW_SEPARATOR)}
                        onChange={(e) => handleSectionChange(index, 'table_rows', e.target.value.split(TABLE_ROW_SEPARATOR).map(row => row.split(TABLE_COL_SEPARATOR).map(cell => cell.trim()).filter(cell => cell !== '')))}
                        className="w-full border px-4 py-2 rounded"
                        rows={3}
                        placeholder="แถว1คอลัมน์1|||แถว1คอลัมน์2^^^แถว2คอลัมน์1|||แถว2คอลัมน์2"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ใช้ ||| แบ่งคอลัมน์ใน 1 แถว และใช้ ^^^ แบ่งแถว
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addSection}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Add Section
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#0c7b6a] text-white px-6 py-2 rounded hover:bg-[#2d8f80] disabled:bg-gray-400 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Article...' : 'Create Article'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}