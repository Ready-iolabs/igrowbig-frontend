import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";

const HomePageIntroduction = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [existingPage, setExistingPage] = useState(null);
  const { data, loading, error, getAll, put } = useTenantApi();

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantId) {
      fetchIntroductionData();
    }
  }, [tenantId]);

  const fetchIntroductionData = async () => {
    try {
      const response = await getAll(`/tenants/${tenantId}/home-page`);
      if (response) {
        setContent(response.introduction_content || "");
        setImage(response.introduction_image_url || null);
        setExistingPage(response);
      } else {
        setContent("");
        setImage(null);
        setExistingPage(null);
      }
    } catch (err) {
      console.error("Error fetching introduction data:", err);
      toast.error("Failed to load introduction content.");
    }
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setSelectedImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token found. Please log in.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("introduction_content", content || "Default introduction");

      if (existingPage) {
        const requiredFields = [
          "welcome_description",
          "about_company_title",
          "about_company_content_1",
          "why_network_marketing_title",
          "why_network_marketing_content",
          "opportunity_video_header_title",
          "support_content",
        ];
        requiredFields.forEach((field) => {
          formData.append(field, existingPage[field] || `Default ${field}`);
        });
        if (existingPage.about_company_content_2) {
          formData.append("about_company_content_2", existingPage.about_company_content_2);
        }
        if (existingPage.opportunity_video_url) {
          formData.append("youtube_link", existingPage.opportunity_video_url);
        }
      }

      if (selectedImageFile) {
        formData.append("introduction_image", selectedImageFile);
      }

      toast.loading("Saving changes...");
      const response = await put(`/tenants/${tenantId}/home-page`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      toast.dismiss();
      toast.success("Introduction updated successfully!");
      if (response.data?.data?.introduction_image_url) {
        setImage(response.data.data.introduction_image_url);
      }
      await fetchIntroductionData();
    } catch (err) {
      console.error("Error saving introduction:", err);
      toast.dismiss();
      toast.error("Failed to save introduction: " + (err.response?.data?.message || err.message));
    }
  };

  const handleStartEditing = () => {
    setContent("Start writing your introduction here...");
    setImage(null);
    setSelectedImageFile(null);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ direction: "rtl" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  return (
    <div className="container">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading introduction data...</span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg shadow-sm mb-6">
          {error.message || "An error occurred while loading data."}
        </p>
      ) : !existingPage && !content && !image ? (
        <div className="p-12 text-center bg-white shadow-lg rounded-xl border border-gray-200">
          <svg
            className="mx-auto h-24 w-24 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Introduction Yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding an introduction for your homepage!
          </p>
          <button
            onClick={handleStartEditing}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            Add Your Introduction
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-lg p-6 flex flex-col gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Edit Introduction</h2>
            <ReactQuill value={content} onChange={handleContentChange} modules={quillModules} theme="snow" />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Upload Image</h3>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="Uploaded preview" className="w-40 h-40 object-cover rounded-lg" />}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Complete Preview</h3>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div dangerouslySetInnerHTML={{ __html: content || "No content yet" }} />
              {image && <img src={image} alt="Introduction" className="w-40 h-40 mt-6 object-cover rounded-lg" />}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded-full transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:scale-105"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePageIntroduction;