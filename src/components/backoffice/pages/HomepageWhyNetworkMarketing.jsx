import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "@/hooks/useApi"; // Assuming useTenantApi was a typo; adjust if needed
import { getToken } from "@/utils/auth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";

const HomepageWhyNetworkMarketing = () => {
  const navigate = useNavigate();
  const { isLoading, error, getAll, put } = useApi();

  const [tenantId, setTenantId] = useState(null);
  const [title, setTitle] = useState(""); // why_network_marketing_title
  const [content, setContent] = useState(""); // why_network_marketing_content
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication and tenant ID on mount
  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = getToken();
    if (!token || !storedTenantId) {
      toast.error("Please log in to continue.");
      navigate("/backoffice-login");
    } else {
      setTenantId(storedTenantId);
    }
  }, [navigate]);

  // Fetch existing data when tenantId is available
  useEffect(() => {
    if (tenantId) {
      fetchWhyNetworkMarketingData();
    }
  }, [tenantId]);

  const fetchWhyNetworkMarketingData = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/home-page`),
        {
          loading: "Fetching data...",
          success: "Data loaded successfully!",
          error: "Failed to load data.",
        }
      );
      if (response) {
        setTitle(response.why_network_marketing_title || "Why Network Marketing");
        setContent(response.why_network_marketing_content || "");
        setIsEditing(!!response.why_network_marketing_title); // Set editing mode if data exists
      }
    } catch (err) {
      console.error("Error fetching why network marketing data:", err.response?.data || err.message);
      setTitle("Why Network Marketing");
      setContent("");
      setIsEditing(false);
    }
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      return;
    }

    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required.");
      return;
    }

    const formData = new FormData();
    formData.append("why_network_marketing_title", title);
    formData.append("why_network_marketing_content", content);

    // Fetch existing page to preserve other fields
    const existingPage = await getAll(`/tenants/${tenantId}/home-page`);
    if (existingPage) {
      formData.append("welcome_description", existingPage.welcome_description || "Default welcome");
      formData.append("introduction_content", existingPage.introduction_content || "Default introduction");
      formData.append("about_company_title", existingPage.about_company_title || "About Us");
      formData.append("about_company_content_1", existingPage.about_company_content_1 || "Default content 1");
      formData.append("about_company_content_2", existingPage.about_company_content_2 || null);
      formData.append("opportunity_video_header_title", existingPage.opportunity_video_header_title || "Opportunity Video");
      formData.append("opportunity_video_url", existingPage.opportunity_video_url || null);
      formData.append("support_content", existingPage.support_content || "Default support content");
    }

    setIsSubmitting(true);
    try {
      await toast.promise(
        put(`/tenants/${tenantId}/home-page`, formData, true),
        {
          loading: "Saving data...",
          success: "Why Network Marketing updated successfully!",
          error: (err) => `Failed to save: ${err.response?.data?.message || err.message}`,
        }
      );
      await fetchWhyNetworkMarketingData(); // Refresh data after save
    } catch (err) {
      console.error("Error saving why network marketing:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle("Why Network Marketing");
    setContent("");
    setIsEditing(false);
    toast.success("Form reset successfully!");
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

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading data...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg shadow-sm mb-6">
          {error.message || "An error occurred while loading data."}
        </p>
      )}

      {/* Editor Form */}
      {!isLoading && !error && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit Why Network Marketing" : "Create Why Network Marketing"}
          </h3>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 text-xl font-semibold text-gray-800 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:opacity-50"
                placeholder="Enter title"
                disabled={isSubmitting}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter content for Why Network Marketing..."
                readOnly={isSubmitting}
              />
            </div>

            {/* Preview */}
            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Preview</h4>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-inner">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{title || "No title yet"}</h1>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: content || "No content yet" }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tenantId}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageWhyNetworkMarketing;