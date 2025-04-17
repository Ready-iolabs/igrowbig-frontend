import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Plus } from "lucide-react";

const JoinUsPageContentEditor = () => {
  const navigate = useNavigate();
  const { isLoading, error, data, getAll, post } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [content, setContent] = useState({
    section_content_1: "",
    section_content_2: "",
    section_content_3: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication and tenant ID
  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = localStorage.getItem("token");
    if (!token || !storedTenantId) {
      toast.error("Please log in to continue.");
      navigate("/backoffice-login");
    } else {
      setTenantId(storedTenantId);
    }
  }, [navigate]);

  // Fetch content
  const fetchContent = useCallback(async () => {
    if (!tenantId) return;
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/joinus-page`),
        {
          loading: "Fetching content...",
          success: "Content loaded!",
          error: "Failed to load content.",
        }
      );
      console.log("Fetched content response:", response);
      const newContent = {
        section_content_1: response.section_content_1 || "",
        section_content_2: response.section_content_2 || "",
        section_content_3: response.section_content_3 || "",
      };
      setContent(newContent);
      setIsEditing(!!(newContent.section_content_1 || newContent.section_content_2 || newContent.section_content_3));
    } catch (err) {
      console.error("Fetch content error:", err);
      setContent({ section_content_1: "", section_content_2: "", section_content_3: "" });
      setIsEditing(false);
    }
  }, [tenantId, getAll]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleSave = async () => {
    if (!content.section_content_1.trim() && !content.section_content_2.trim() && !content.section_content_3.trim()) {
      toast.error("At least one section must have content.");
      return;
    }

    const formData = new FormData();
    formData.append("section_content_1", content.section_content_1);
    formData.append("section_content_2", content.section_content_2);
    formData.append("section_content_3", content.section_content_3);

    setIsSubmitting(true);
    try {
      const response = await toast.promise(
        post(`/tenants/${tenantId}/joinus-page`, formData, true),
        {
          loading: isEditing ? "Updating content..." : "Creating content...",
          success: isEditing ? "Content updated!" : "Content created!",
          error: (err) => `Failed to save content: ${err.message || "Unknown error"}`,
        }
      );
      console.log("Save content response:", response);
      await fetchContent();
    } catch (err) {
      console.error("Save content error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setContent({ section_content_1: "", section_content_2: "", section_content_3: "" });
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }, { size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  return (
    <div className="container ">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Join Us Page Content</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black transition-transform hover:scale-105 shadow-md"
            disabled={isSubmitting}
          >
            <Plus size={16} /> Add Content
          </button>
        )}
      </div>

      {/* Error/Loading States */}
      {error && !isLoading && (
        <p className="text-red-500 mb-4 text-center font-medium">{error.message || "An error occurred."}</p>
      )}
      {isLoading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading content...</span>
        </div>
      )}

      {/* No Content State */}
      {!isLoading && !isEditing && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Content Yet</h2>
          <p className="text-gray-600 mb-6">Add engaging content to the Join Us page to get started!</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-6 py-3 rounded-full hover:from-gray-900 hover:to-black transition-transform hover:scale-105 shadow-md"
            disabled={isSubmitting}
          >
            Add Content
          </button>
        </div>
      )}

      {/* Editor Form */}
      {!isLoading && isEditing && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {content.section_content_1 || content.section_content_2 || content.section_content_3
              ? "Update Join Us Page Content"
              : "Add Join Us Page Content"}
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section 1 Content</label>
              <ReactQuill
                value={content.section_content_1}
                onChange={(value) => setContent({ ...content, section_content_1: value })}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter content for Section 1..."
                readOnly={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section 2 Content</label>
              <ReactQuill
                value={content.section_content_2}
                onChange={(value) => setContent({ ...content, section_content_2: value })}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter content for Section 2..."
                readOnly={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section 3 Content</label>
              <ReactQuill
                value={content.section_content_3}
                onChange={(value) => setContent({ ...content, section_content_3: value })}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter content for Section 3..."
                readOnly={isSubmitting}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 transition-transform hover:scale-105 shadow-sm"
              disabled={isSubmitting}
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black transition-transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : content.section_content_1 || content.section_content_2 || content.section_content_3
                ? "Update"
                : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinUsPageContentEditor;