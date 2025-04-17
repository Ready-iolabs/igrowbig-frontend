import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "react-feather";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { getToken } from "@/utils/auth";
import toast, { Toaster } from "react-hot-toast";

const OpportunityOverviewVideoSection = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, getAll, post, put, request } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([]); // Single video record per tenant
  const [newVideo, setNewVideo] = useState({
    header_title: "",
    video_file: null, // File object for upload
    youtube_link: "",
  });
  const [videoPreview, setVideoPreview] = useState(null); // Preview of selected video file

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

  // Fetch video when tenantId is set
  useEffect(() => {
    if (tenantId) {
      fetchVideo();
    }
  }, [tenantId]);

  const fetchVideo = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/opportunity-page`),
        {
          loading: "Fetching video section...",
          success: "Video section loaded!",
          error: "Failed to load video section.",
        }
      );
      if (response && (response.header_title || response.video_section_link)) {
        setVideos([
          {
            id: response.id,
            header_title: response.header_title || "NHT Global Compensation Plan",
            video_section_link: response.video_section_link || null,
            is_youtube: response.video_section_link && response.video_section_link.includes("youtube.com"),
          },
        ]);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error("Error fetching opportunity page video:", err.response?.data || err.message);
      setVideos([]);
    }
  };

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewVideo({ header_title: "", video_file: null, youtube_link: "" });
    setVideoPreview(null);
  };

  const handleEdit = (video) => {
    setShowForm(true);
    setIsEditing(true);
    setNewVideo({
      header_title: video.header_title,
      video_file: null, // Reset file input
      youtube_link: video.is_youtube ? video.video_section_link : "",
    });
    setVideoPreview(video.is_youtube ? null : video.video_section_link); // Show existing video if not YouTube
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setNewVideo({ header_title: "", video_file: null, youtube_link: "" });
    setVideoPreview(null);
  };

  const validateVideoFile = (file) => {
    if (!file) return true;
    if (file.type !== "video/mp4") {
      toast.error("Please upload an MP4 file only.");
      return false;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size exceeds 50MB limit.");
      return false;
    }
    return true;
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateVideoFile(file)) {
      setNewVideo({ ...newVideo, video_file: file, youtube_link: "" });
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result); // Set local preview URL
      };
      reader.readAsDataURL(file);
      toast.info("Video selected successfully!");
    }
  };

  const handleYoutubeLinkChange = (e) => {
    const link = e.target.value;
    setNewVideo({ ...newVideo, youtube_link: link, video_file: null });
    setVideoPreview(link.includes("youtube.com") ? link : null); // Preview YouTube link if valid
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found.");
      return;
    }

    if (!newVideo.header_title.trim()) {
      toast.error("Header title is required.");
      return;
    }

    if (!newVideo.video_file && !newVideo.youtube_link) {
      toast.error("Please upload a video file or provide a YouTube link.");
      return;
    }

    const formData = new FormData();
    formData.append("header_title", newVideo.header_title || "NHT Global Compensation Plan");
    if (newVideo.video_file) {
      formData.append("video_section", newVideo.video_file);
      console.log("Sending video file:", newVideo.video_file); // Debug log
    } else if (newVideo.youtube_link) {
      formData.append("video_section_link", newVideo.youtube_link);
      console.log("Sending YouTube link:", newVideo.youtube_link); // Debug log
    }

    try {
      const existingPage = await getAll(`/tenants/${tenantId}/opportunity-page`);
      if (existingPage && existingPage.id) {
        await toast.promise(
          put(`/tenants/${tenantId}/opportunity-page`, formData, true),
          {
            loading: "Updating video section...",
            success: "Video section updated successfully!",
            error: (err) => `Failed to update video section: ${err.response?.data?.message || err.message}`,
          }
        );
      } else {
        await toast.promise(
          post(`/tenants/${tenantId}/opportunity-page`, formData, true),
          {
            loading: "Creating video section...",
            success: "Video section created successfully!",
            error: (err) => `Failed to create video section: ${err.response?.data?.message || err.message}`,
          }
        );
      }
      fetchVideo();
      handleCancel();
    } catch (err) {
      console.error("Error saving opportunity page video:", err.response?.data || err.message);
    }
  };

  const handleDelete = async () => {
    if (!tenantId || videos.length === 0) return;
    if (window.confirm("Are you sure you want to delete this video section?")) {
      try {
        await toast.promise(
          request("delete", `/tenants/${tenantId}/opportunity-page`),
          {
            loading: "Deleting video section...",
            success: "Video section deleted successfully!",
            error: "Failed to delete video section.",
          }
        );
        setVideos([]);
      } catch (err) {
        console.error("Error deleting opportunity page video:", err.response?.data || err.message);
      }
    }
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.header_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.video_section_link && video.video_section_link.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      
      

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading video section...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <p className="text-red-500 text-center bg-red-50 p-3 rounded-lg shadow-sm mb-6">
          {error.message || "An error occurred while loading the video section."}
        </p>
      )}

      {/* Video Table */}
      {!showForm && !isLoading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Header Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Video Section</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-800">
                    No video found.
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video, index) => (
                  <tr key={video.id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{video.header_title}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {video.video_section_link ? (
                        video.is_youtube ? (
                          <iframe
                            src={video.video_section_link}
                            title="YouTube Video"
                            className="w-32 h-20 rounded"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={video.video_section_link}
                            controls
                            className="w-32 h-20 object-cover rounded"
                            onError={(e) => (e.target.src = "/placeholder-video.mp4")}
                          />
                        )
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(video)}
                        className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={handleDelete}
                        className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Video Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit Video Section" : "Create New Video Section"}
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newVideo.header_title}
                onChange={(e) => setNewVideo({ ...newVideo, header_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50"
                placeholder="Enter header title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opportunity Video Clip (MP4 only, Max 50MB)
              </label>
              <input
                type="file"
                accept="video/mp4"
                onChange={handleVideoUpload}
                disabled={newVideo.youtube_link.length > 0}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
              />
              {videoPreview && !newVideo.youtube_link && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Preview:</p>
                  <video
                    src={videoPreview}
                    controls
                    className="w-48 h-28 object-cover rounded shadow-sm"
                  />
                </div>
              )}
              {isEditing && !newVideo.video_file && !newVideo.youtube_link && videos[0]?.video_section_link && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Current:</p>
                  {videos[0].is_youtube ? (
                    <iframe
                      src={videos[0].video_section_link}
                      title="Current YouTube Video"
                      className="w-48 h-28 rounded"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={videos[0].video_section_link}
                      controls
                      className="w-48 h-28 object-cover rounded shadow-sm"
                      onError={(e) => (e.target.src = "/placeholder-video.mp4")}
                    />
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Embedded Link
              </label>
              <input
                type="text"
                value={newVideo.youtube_link}
                onChange={handleYoutubeLinkChange}
                disabled={newVideo.video_file !== null}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:opacity-50"
                placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
              />
              <p className="text-xs text-gray-500 mt-1">
                <strong>How to get YouTube link:</strong> Go to your video on YouTube, click "Share," then "Embed," and copy the iframe src URL.
              </p>
              {videoPreview && newVideo.youtube_link && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Preview:</p>
                  <iframe
                    src={videoPreview}
                    title="YouTube Preview"
                    className="w-48 h-28 rounded shadow-sm"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              )}
              {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityOverviewVideoSection;