import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = "http://localhost:3001/api"; // API base URL

// Custom useTenantApi Hook
const useTenantApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const apiRequest = async (method, endpoint, payload = null, isFormData = false) => {
    setLoading(true);
    setError(null);

    const token = getToken();
    if (!token && !["/users/signup", "/users/login", "/admin/login"].includes(endpoint)) {
      setError({ message: "No authentication token found" });
      setLoading(false);
      return null;
    }

    try {
      const headers = {
        Authorization: token ? `Bearer ${token}` : undefined,
      };
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const config = {
        method,
        url: `${BASE_URL}${endpoint}`,
        headers,
        data: isFormData ? payload : payload ? JSON.stringify(payload) : undefined,
      };

      console.log(`API Request: ${method} ${endpoint}`, payload);
      const response = await axios(config);
      console.log(`API Response: ${method} ${endpoint}`, response.data);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorData = err.response?.data || { message: "API request failed", details: err.message };
      console.error(`API Error: ${method} ${endpoint}`, errorData);
      setError(errorData);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAll = (endpoint) => apiRequest("get", endpoint);
  const post = (endpoint, data, isFormData = false) => apiRequest("post", endpoint, data, isFormData);
  const put = (endpoint, data, isFormData = false) => apiRequest("put", endpoint, data, isFormData);
  const del = (endpoint) => apiRequest("delete", endpoint);

  return { data, loading, error, getAll, post, put, request: apiRequest, del };
};

// SocialMediaEditor Component
const SocialMediaEditor = () => {
  const navigate = useNavigate();
  const { data, loading: isLoading, error, getAll, post, put, del } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPlatform, setEditPlatform] = useState(null); // Track which platform is being edited
  const [searchTerm, setSearchTerm] = useState("");
  const [socialLinks, setSocialLinks] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newSocial, setNewSocial] = useState({
    facebook_url: "",
    twitter_url: "",
    youtube_url: "",
  });

  // Dummy data for display when no real data exists
  const dummyData = [
    ["Facebook", "Add Facebook URL"],
    ["Twitter", "Add Twitter URL"],
    ["YouTube", "Add YouTube URL"],
  ];

  // Authentication and tenant setup
  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = localStorage.getItem("token");
    if (!token || !storedTenantId) {
      toast.error("Please log in to continue.");
      navigate("/backoffice-login");
    } else {
      setTenantId(storedTenantId);
      fetchSocialLinks(storedTenantId);
    }
  }, [navigate]);

  const fetchSocialLinks = async (tenant) => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenant}/footer/social-links`),
        {
          loading: "Fetching social links...",
          success: "Social links loaded successfully!",
          error: "Failed to load social links.",
        }
      );
      if (response && Object.keys(response).length > 0) {
        setSocialLinks(response);
      } else {
        setSocialLinks({});
      }
    } catch (err) {
      console.error("Error fetching social links:", err.response?.data || err.message);
      setSocialLinks({});
    }
  };

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setEditPlatform(null);
    setNewSocial({ facebook_url: "", twitter_url: "", youtube_url: "" });
  };

  const handleEdit = (platform) => {
    setShowForm(true);
    setIsEditing(true);
    setEditPlatform(platform);
    setNewSocial({
      facebook_url: platform === "Facebook" ? socialLinks.facebook_url || "" : "",
      twitter_url: platform === "Twitter" ? socialLinks.twitter_url || "" : "",
      youtube_url: platform === "YouTube" ? socialLinks.youtube_url || "" : "",
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditPlatform(null);
    setNewSocial({ facebook_url: "", twitter_url: "", youtube_url: "" });
    setIsSubmitting(false);
  };

  const validateUrl = (url, platform) => {
    if (!url) return true; // Allow empty URLs
    const regex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/;
    if (!regex.test(url)) {
      toast.error(`Please enter a valid ${platform} URL (e.g., https://${platform.toLowerCase()}.com/example).`);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found.");
      return;
    }

    const { facebook_url, twitter_url, youtube_url } = newSocial;

    if (isEditing && editPlatform) {
      // Editing a specific platform
      const url = editPlatform === "Facebook" ? facebook_url : editPlatform === "Twitter" ? twitter_url : youtube_url;
      if (!validateUrl(url, editPlatform)) return;

      if (!url) {
        toast.error(`Please provide a ${editPlatform} URL.`);
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          facebook_url: editPlatform === "Facebook" ? facebook_url : socialLinks.facebook_url || null,
          twitter_url: editPlatform === "Twitter" ? twitter_url : socialLinks.twitter_url || null,
          youtube_url: editPlatform === "YouTube" ? youtube_url : socialLinks.youtube_url || null,
        };
        await toast.promise(
          put(`/tenants/${tenantId}/footer/social-links`, payload),
          {
            loading: `Updating ${editPlatform} link...`,
            success: `${editPlatform} link updated successfully!`,
            error: (err) => `Failed to update: ${err.response?.data?.message || err.message}`,
          }
        );
        await fetchSocialLinks(tenantId);
        handleCancel();
      } catch (err) {
        console.error(`Error updating ${editPlatform} link:`, err.response?.data || err.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Adding new social links
      if (
        !validateUrl(facebook_url, "Facebook") ||
        !validateUrl(twitter_url, "Twitter") ||
        !validateUrl(youtube_url, "YouTube")
      ) {
        return;
      }

      if (!facebook_url && !twitter_url && !youtube_url) {
        toast.error("Please provide at least one social media URL.");
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          facebook_url: facebook_url || null,
          twitter_url: twitter_url || null,
          youtube_url: youtube_url || null,
        };
        await toast.promise(
          post(`/tenants/${tenantId}/footer/social-links`, payload),
          {
            loading: "Saving social links...",
            success: "Social links saved successfully!",
            error: (err) => `Failed to save: ${err.response?.data?.message || err.message}`,
          }
        );
        await fetchSocialLinks(tenantId);
        handleCancel();
      } catch (err) {
        console.error("Error saving social links:", err.response?.data || err.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete all social links?")) return;
    if (!tenantId) {
      toast.error("Tenant ID not found.");
      return;
    }

    setIsSubmitting(true);
    try {
      await toast.promise(
        del(`/tenants/${tenantId}/footer/social-links`),
        {
          loading: "Deleting social links...",
          success: "Social links deleted successfully!",
          error: (err) => `Failed to delete: ${err.response?.data?.message || err.message}`,
        }
      );
      setSocialLinks({});
    } catch (err) {
      console.error("Error deleting social links:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLinks = Object.entries(socialLinks).filter(
    ([key, value]) =>
      key.includes("url") &&
      value &&
      value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container ">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {!showForm && (
          <div className="flex gap-4">
            <button
              onClick={handleAddNew}
              className="bg-black text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:from-blue-700 hover:to-blue-900 hover:scale-105 transition-all duration-300 shadow-lg"
              disabled={isSubmitting}
            >
              <Plus size={18} /> Add Social Links
            </button>
          </div>
        )}
        {!showForm && (
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search social links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto"></div>
          <span className="text-gray-600 text-lg mt-4 block animate-pulse">Loading social links...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-red-600 text-center bg-red-100 p-4 rounded-lg shadow-md mb-8 animate-fade-in">
          {error.message || "An error occurred while loading social links."}
        </div>
      )}

      {/* Social Links Table */}
      {!isLoading && !error && !showForm && (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Platform</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">URL</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.keys(socialLinks).length === 0
                ? dummyData.map(([platform, url], index) => (
                    <tr key={platform} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{platform}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 italic">{url}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                        <button
                          onClick={handleAddNew}
                          className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200"
                          title={`Add ${platform} Link`}
                        >
                          <Plus size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                : [
                    ["Facebook", socialLinks.facebook_url],
                    ["Twitter", socialLinks.twitter_url],
                    ["YouTube", socialLinks.youtube_url],
                  ]
                    .filter(([_, url]) => url && url.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(([platform, url], index) => (
                      <tr key={platform} className="hover:bg-gray-50 transition-all duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{platform}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 break-all">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {url}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                          <button
                            onClick={() => handleEdit(platform)}
                            className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200"
                            title={`Edit ${platform} Link`}
                          >
                            <Edit size={18} />
                          </button>
                          {index === 0 && (
                            <button
                              onClick={handleDelete}
                              className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200"
                              title="Delete All Social Links"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Social Media Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEditing ? `Edit ${editPlatform} Link` : "Add Social Media Links"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-200"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6">
            {(!isEditing || editPlatform === "Facebook") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                <input
                  type="text"
                  value={newSocial.facebook_url}
                  onChange={(e) => setNewSocial({ ...newSocial, facebook_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
                  placeholder="e.g., https://facebook.com/example"
                  disabled={isSubmitting}
                />
              </div>
            )}
            {(!isEditing || editPlatform === "Twitter") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                <input
                  type="text"
                  value={newSocial.twitter_url}
                  onChange={(e) => setNewSocial({ ...newSocial, twitter_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
                  placeholder="e.g., https://twitter.com/example"
                  disabled={isSubmitting}
                />
              </div>
            )}
            {(!isEditing || editPlatform === "YouTube") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                <input
                  type="text"
                  value={newSocial.youtube_url}
                  onChange={(e) => setNewSocial({ ...newSocial, youtube_url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
                  placeholder="e.g., https://youtube.com/@example"
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-sm disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full hover:from-blue-700 hover:to-blue-900 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditing ? `Update ${editPlatform} Link` : "Save Links"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaEditor;