import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { getToken } from "@/utils/auth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";

const OpportunityOverviewPageContent = () => {
  const navigate = useNavigate();
  const { isLoading, error, getAll, post, put } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [content, setContent] = useState({
    welcome_message: "",
    page_content: "",
    page_image: null, // File object for upload
  });
  const [existingImageUrl, setExistingImageUrl] = useState(null); // Store existing image URL
  const [imagePreview, setImagePreview] = useState(null); // Preview of selected image
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

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

  // Fetch content when tenantId is set
  useEffect(() => {
    if (tenantId) {
      fetchContent();
    }
  }, [tenantId]);

  const fetchContent = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/opportunity-page`),
        {
          loading: "Fetching content...",
          success: "Content loaded!",
          error: "Failed to load content.",
        }
      );
      if (response && (response.welcome_message || response.page_content || response.page_image_url)) {
        setContent({
          welcome_message: response.welcome_message || "",
          page_content: response.page_content || "",
          page_image: null, // Reset file input
        });
        setExistingImageUrl(response.page_image_url || null);
        setImagePreview(null); // Clear preview on fetch
        setIsEditing(true);
      } else {
        setContent({ welcome_message: "", page_content: "", page_image: null });
        setExistingImageUrl(null);
        setImagePreview(null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error fetching opportunity page content:", err.response?.data || err.message);
      setContent({ welcome_message: "", page_content: "", page_image: null });
      setExistingImageUrl(null);
      setImagePreview(null);
    }
  };

  const validateFile = (file) => {
    if (!file) return true;
    const maxSizeBytes = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSizeBytes) {
      toast.error("Image size exceeds 4MB limit.");
      return false;
    }
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Please upload a JPEG, JPG, or PNG image.");
      return false;
    }
    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setContent({ ...content, page_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview URL
      };
      reader.readAsDataURL(file);
      toast.info("Image selected successfully!");
    }
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      return;
    }

    if (!content.welcome_message.trim()) {
      toast.error("Welcome message is required.");
      return;
    }

    if (!content.page_content.trim()) {
      toast.error("Page content is required.");
      return;
    }

    if (!validateFile(content.page_image)) {
      return;
    }

    const formData = new FormData();
    formData.append("welcome_message", content.welcome_message);
    formData.append("page_content", content.page_content);
    if (content.page_image) {
      formData.append("page_image", content.page_image);
      console.log("Sending page_image:", content.page_image); // Debug log
    }

    setIsSubmitting(true);
    try {
      const existingPage = await getAll(`/tenants/${tenantId}/opportunity-page`);
      if (existingPage && existingPage.id) {
        await toast.promise(
          put(`/tenants/${tenantId}/opportunity-page`, formData, true),
          {
            loading: "Updating content...",
            success: "Content updated successfully!",
            error: (err) => `Failed to update content: ${err.response?.data?.message || err.message}`,
          }
        );
      } else {
        await toast.promise(
          post(`/tenants/${tenantId}/opportunity-page`, formData, true),
          {
            loading: "Creating content...",
            success: "Content created successfully!",
            error: (err) => `Failed to create content: ${err.response?.data?.message || err.message}`,
          }
        );
      }
      await fetchContent(); // Refresh content after save
    } catch (err) {
      console.error("Error saving opportunity page content:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setContent({ welcome_message: "", page_content: "", page_image: null });
    setExistingImageUrl(null);
    setImagePreview(null);
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
    <div className="container mx-auto px-4 py-6">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading content...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg shadow-sm mb-6">
          {error.message || "An error occurred while loading content."}
        </p>
      )}

      {/* Editor Form */}
      {!isLoading && !error && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit Opportunity Page Content" : "Create Opportunity Page Content"}
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Welcome Message <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                value={content.welcome_message}
                onChange={(value) => setContent({ ...content, welcome_message: value })}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter welcome message..."
                readOnly={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Content <span className="text-red-500">*</span>
              </label>
              <ReactQuill
                value={content.page_content}
                onChange={(value) => setContent({ ...content, page_content: value })}
                modules={quillModules}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
                placeholder="Enter page content..."
                readOnly={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Image (JPEG, JPG, PNG, Max 4MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
              />
              {/* Preview of selected image */}
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Selected Preview"
                    className="h-20 w-auto object-cover rounded shadow-sm"
                  />
                </div>
              )}
              {/* Existing image from database */}
              {isEditing && !imagePreview && existingImageUrl && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Current:</p>
                  <img
                    src={existingImageUrl}
                    alt="Current Page Image"
                    className="h-20 w-auto object-cover rounded shadow-sm"
                    onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                  />
                </div>
              )}
              {content.page_image && !imagePreview && (
                <p className="text-xs text-gray-500 mt-2">Selected: {content.page_image.name}</p>
              )}
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

export default OpportunityOverviewPageContent;