import React, { useEffect, useState } from "react";
import SideBar from "./bar/Sidebar.tsx";
import Header from "./bar/Header.tsx";
import { Pencil } from "lucide-react";
import { API_CONFIG } from "./../config/api.js";

type User = {
  id: number;
  username: string;
  password: string;
  signup_date: Date;
  is_admin: boolean;
  career: string | null;
  experience: string | null;
  email: string | null;
  image: string | null;
  article_history: number[];
  casestudy_history: number[];
  video_history: number[];
  quiz_score: number;
};

const UserEdit: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const storedUserId = sessionStorage.getItem("userId");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageMessage, setImageMessage] = useState("");
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    career: "",
    experience: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getProfileImageUrl = (imageData: string | null | undefined): string => {
    if (typeof imageData !== "string" || imageData.trim() === "") {
      return "/images/profile.jpg";
    }

    try {
      console.log("UserEdit - Image data type:", typeof imageData);
      console.log("UserEdit - Image data preview:", imageData.substring(0, 50));

      if (imageData.startsWith("data:image/")) {
        return imageData;
      }

      let mimeType = "image/jpeg";
      if (imageData.startsWith("iVBORw0KGgo")) mimeType = "image/png";
      else if (imageData.startsWith("/9j/")) mimeType = "image/jpeg";
      else if (imageData.startsWith("R0lGODlh")) mimeType = "image/gif";
      else if (imageData.startsWith("UklGR")) mimeType = "image/webp";

      const dataUrl = `data:${mimeType};base64,${imageData}`;
      return dataUrl;
    } catch (err) {
      console.error("Error processing imageData:", err, imageData);
      return "/images/profile.jpg";
    }
  };

  const handleEditImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageLoading(true);
    setImageMessage("");

    try {
      const maxSize = 10 * 1024 * 1024; 
      if (file.size > maxSize) {
        setImageMessage("Image size should be less than 10MB.");
        setImageLoading(false);
        return;
      }

      if (!file.type.startsWith("image/")) {
        setImageMessage("Please select an image file.");
        setImageLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/editUserImage/${storedUserId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const result = await response.json();
      console.log("Upload result:", result);

      if (result.user) {
        setUser(result.user);
        console.log("Updated user:", result.user);
      }

      setImageMessage("อัปเดตรูปโปรไฟล์สำเร็จ!");
      setTimeout(() => setImageMessage(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setImageMessage("เกิดข้อผิดพลาดในการอัปโหลดรูป");
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!storedUserId) {
          setError("No userId found in sessionStorage");
          return;
        }

        const res = await fetch(
          `${API_CONFIG.BASE_URL}/getUserById/${storedUserId}`
        );
        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดผู้ใช้ได้");
        }

        const data: User = await res.json();
        console.log("Fetched user data:", data);
        setUser(data);

        setProfileForm({
          username: data.username || "",
          email: data.email || "",
          career: data.career || "",
          experience: data.experience || "",
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [storedUserId]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage("");

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/editUserData/${storedUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: profileForm.username,
            email: profileForm.email,
            career: profileForm.career,
            experience: profileForm.experience,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setProfileMessage("อัปเดตโปรไฟล์สำเร็จ!");

      setTimeout(() => setProfileMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileMessage("เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage("รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน");
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/editUserData/${storedUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: passwordForm.newPassword,
            currentPassword: passwordForm.currentPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      setPasswordMessage("เปลี่ยนรหัสผ่านสำเร็จ!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (error: any) {
      console.error("Error updating password:", error);
      setPasswordMessage(
        error.message === "Invalid current password"
          ? "รหัสผ่านปัจจุบันไม่ถูกต้อง"
          : "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleProfileInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-lg">กำลังโหลดข้อมูลผู้ใช้...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans min-w-full">
      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Header */}
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex min-h-screen min-w-full">
          <div className=" min-h-screen">
            <SideBar />
          </div>

          <div className="space-y-4 w-full mx-20 mb-4">
            <h1 className="text-3xl font-bold mt-6 text-gray-900">
              การตั้งค่าบัญชี
            </h1>

            {/* Profile card */}
            <section className="bg-[#eeeeee] rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-4">โปรไฟล์</h2>
              <form onSubmit={handleProfileSubmit}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={getProfileImageUrl(user?.image)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:");
                        e.currentTarget.src = "/images/profile.jpg";
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleEditImageClick}
                      className="absolute bottom-2 right-3 bg-white p-1 rounded-full shadow hover:bg-gray-50"
                      disabled={imageLoading}
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {imageLoading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                        <div className="text-white text-xs">อัปโหลด...</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">ชื่อ</label>
                      <input
                        type="text"
                        name="username"
                        value={profileForm.username}
                        onChange={handleProfileInputChange}
                        className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0c7b6a] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">อีเมล</label>
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileInputChange}
                        className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0c7b6a] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">อาชีพ</label>
                  <input
                    type="text"
                    name="career"
                    value={profileForm.career}
                    onChange={handleProfileInputChange}
                    placeholder="กรอกอาชีพของคุณ"
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0c7b6a] focus:border-transparent"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium">
                    ประสบการณ์การลงทุน
                  </label>
                  <textarea
                    name="experience"
                    value={profileForm.experience}
                    onChange={handleProfileInputChange}
                    placeholder="บอกเล่าประสบการณ์การลงทุนของคุณแบบสั้นๆ"
                    className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0c7b6a] focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Profile Message */}
                {profileMessage && (
                  <div
                    className={`mb-4 p-3 rounded-md ${
                      profileMessage.includes("สำเร็จ")
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {profileMessage}
                  </div>
                )}

                {imageMessage && (
                  <div
                    className={`mt-2 text-sm ${
                      imageMessage.includes("สำเร็จ")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {imageMessage}
                  </div>
                )}

                <div className="text-right">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="bg-[#0c7b6a] text-white px-4 py-2 rounded-md hover:bg-[#218c7c] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileLoading ? "กำลังอัปเดต..." : "อัปเดตโปรไฟล์"}
                  </button>
                </div>
              </form>
            </section>

            {/* Password card */}
            <section className="bg-[#eeeeee] rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-4">รหัสผ่าน</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className="flex flex-col">
                  <div className="pr-4 mb-2">
                    <label className="block text-sm font-medium">
                      รหัสผ่านปัจจุบัน
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="mt-1 w-1/2 border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0c7b6a] focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium">
                        รหัสผ่านใหม่
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordInputChange}
                        className="mt-1 border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-[#0c7b6a] focus:border-transparent"
                        minLength={6}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        ยืนยันรหัสผ่านใหม่
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0c7b6a] focus:border-transparent"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Message */}
                {passwordMessage && (
                  <div
                    className={`mb-4 p-3 rounded-md ${
                      passwordMessage.includes("สำเร็จ")
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {passwordMessage}
                  </div>
                )}

                <div className="text-right">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-[#0c7b6a] text-white px-4 py-2 rounded-md hover:bg-[#218c7c] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordLoading ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
