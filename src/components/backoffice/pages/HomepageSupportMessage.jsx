import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "@/hooks/useApi";
import { getToken } from "@/utils/auth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";

const HomepageSupportMessage = () => {
  const navigate = useNavigate();
  const { isLoading, error, getAll, put } = useApi();

  const [tenantId, setTenantId] = useState(null);
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (tenantId) {
      fetchSupportContent();
    }
  }, [tenantId]);

  const fetchSupportContent = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/home-page`),
        {
          loading: "Fetching support content...",
          success: "Support content loaded successfully!",
          error: "Failed to load support content.",
        }
      );
      if (response) {
        setContent(response.support_content || "");
        setIsEditing(!!response.support_content);
      } else {
        setContent("");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error fetching support content:", err.response?.data || err.message);
    }
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      return;
    }

    if (!content.trim()) {
      toast.error("Support content is required.");
      return;
    }

    const formData = new FormData();
    formData.append("support_content", content);

    const existingPage = await getAll(`/tenants/${tenantId}/home-page`);
    if (existingPage) {
      formData.append("welcome_description", existingPage.welcome_description || "Default welcome");
      formData.append("introduction_content", existingPage.introduction_content || "Default introduction");
      formData.append("about_company_title", existingPage.about_company_title || "About Us");
      formData.append("about_company_content_1", existingPage.about_company_content_1 || "Default content 1");
      formData.append("about_company_content_2", existingPage.about_company_content_2 || null);
      formData.append("why_network_marketing_title", existingPage.why_network_marketing_title || "Why Network Marketing");
      formData.append("why_network_marketing_content", existingPage.why_network_marketing_content || "Default why content");
      formData.append("opportunity_video_header_title", existingPage.opportunity_video_header_title || "Opportunity Video");
      formData.append("opportunity_video_url", existingPage.opportunity_video_url || null);
    }

    setIsSubmitting(true);
    try {
      await toast.promise(
        put(`/tenants/${tenantId}/home-page`, formData, true),
        {
          loading: "Saving support content...",
          success: "Support content updated successfully!",
          error: (err) => `Failed to save: ${err.response?.data?.message || err.message}`,
        }
      );
      await fetchSupportContent();
    } catch (err) {
      console.error("Error saving support message:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setContent("");
    setIsEditing(false);
    toast.success("Form reset successfully!");
  };

  const handleStartEditing = () => {
    setContent("Start writing your support message here...");
    setIsEditing(true);
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

      {isLoading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading support content...</span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg shadow-sm mb-6">
          {error.message || "An error occurred while loading support content."}
        </p>
      ) : !isEditing && !content ? (
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Support Message Yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding a support message for your homepage!
          </p>
          <button
            onClick={handleStartEditing}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            Add Support Message
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit Support Message" : "Create Support Message"}
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Content <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter support message content..."
                readOnly={isSubmitting}
              />
            </div>

            <div>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Preview</h4>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-inner">
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: content || "No content yet" }}
                />
              </div>
            </div>
          </div>

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

export default HomepageSupportMessage;