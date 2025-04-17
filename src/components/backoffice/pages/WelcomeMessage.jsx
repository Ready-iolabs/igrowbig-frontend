import React, { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor"; // Adjust path as needed
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";

const WelcomeMessage = () => {
  const [content, setContent] = useState("");
  const [tenantId, setTenantId] = useState(null);
  const { data, loading, error, getAll, post, put } = useTenantApi();

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
      console.log("Tenant ID set to:", storedTenantId);
    }
  }, [tenantId]);

  useEffect(() => {
    if (tenantId) {
      fetchWelcomeMessage();
    }
  }, [tenantId]);

  const fetchWelcomeMessage = async () => {
    try {
      const response = await getAll(`/tenants/${tenantId}/home-page`);
      console.log("Fetched data from API:", response);
      if (response && response.welcome_description) {
        setContent(response.welcome_description);
        console.log("Content set from API:", response.welcome_description);
      } else {
        setContent("");
        console.log("No welcome_description found, content set to empty");
      }
    } catch (err) {
      console.error("Error fetching welcome message:", err);
      toast.error("Failed to load welcome message.");
    }
  };

  const handleContentChange = (newContent) => {
    console.log("handleContentChange received from RichTextEditor:", newContent);
    setContent(newContent);
    console.log("Content state updated to:", newContent);
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      return;
    }

    if (!content.trim()) {
      toast.error("Welcome message content is required.");
      return;
    }

    console.log("Saving with current content:", content);

    try {
      const existingPage = await getAll(`/tenants/${tenantId}/home-page`);
      console.log("Existing page data:", existingPage);

      const updatedData = {
        welcome_description: content,
        introduction_content: existingPage?.introduction_content || "Default introduction",
        about_company_title: existingPage?.about_company_title || "About Us",
        about_company_content_1: existingPage?.about_company_content_1 || "Default content 1",
        about_company_content_2: existingPage?.about_company_content_2 || null,
        why_network_marketing_content: existingPage?.why_network_marketing_content || "Default why content",
        opportunity_video_header_title: existingPage?.opportunity_video_header_title || "Opportunity Video",
        opportunity_video_url: existingPage?.opportunity_video_url || null,
        support_content: existingPage?.support_content || "Default support content",
      };

      console.log("Sending data to API:", updatedData);

      if (existingPage) {
        const response = await put(`/tenants/${tenantId}/home-page`, updatedData);
        console.log("PUT response:", response);
        toast.success("Welcome message updated successfully!");
      } else {
        updatedData.tenant_id = tenantId;
        const response = await post(`/tenants/${tenantId}/home-page`, updatedData);
        console.log("POST response:", response);
        toast.success("Welcome message saved successfully!");
      }

      await fetchWelcomeMessage();
    } catch (err) {
      console.error("Error saving welcome message:", err);
      toast.error("Failed to save welcome message: " + (err.response?.data?.message || err.message));
    }
  };

  const handleStartEditing = () => {
    setContent("Start writing your welcome message here...");
  };

  return (
    <div className="container p-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading welcome message...</span>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg shadow-sm mb-6">
          {error.message || "An error occurred while loading welcome message."}
        </p>
      ) : !content ? (
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Welcome Message Yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by adding a welcome message for your homepage!
          </p>
          <button
            onClick={handleStartEditing}
            className="bg-black text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            Add Welcome Message
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Welcome Message</h2>
          <RichTextEditor
            value={content}
            onChange={handleContentChange}
            placeholder="Enter welcome message here..."
            height="300px"
          />
          <div className="mt-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700">Preview:</h3>
            <div
              className="border p-4 rounded-lg bg-gray-50 shadow-inner"
              dangerouslySetInnerHTML={{ __html: content || "No content yet" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeMessage;