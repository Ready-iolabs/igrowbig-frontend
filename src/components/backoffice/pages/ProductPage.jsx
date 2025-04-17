import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "@/hooks/useApi";
import { getToken } from "@/utils/auth";
import toast, { Toaster } from "react-hot-toast";

export default function ProductPage() {
  const { tenantId: paramTenantId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, getAll, post, put } = useApi();

  const [tenantId, setTenantId] = useState(null);
  const [bannerText, setBannerText] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [aboutDescription, setAboutDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [activeSection, setActiveSection] = useState("banner");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedTenantId = localStorage.getItem('tenant_id');
    const token = getToken();
    if (!token) {
      navigate('/backoffice-login');
    } else if (storedTenantId) {
      setTenantId(storedTenantId);
    } else {
      console.error('No tenant_id found in localStorage');
      navigate('/backoffice-login');
    }
  }, [navigate]);

  useEffect(() => {
    if (tenantId) {
      fetchProductPage();
    }
  }, [tenantId]);

  const fetchProductPage = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/product-page`),
        {
          loading: 'Fetching product page...',
          success: 'Product page loaded!',
          error: 'Failed to load product page.',
        }
      );
      if (response) {
        setBannerText(response.banner_content || "Welcome to Our Products");
        setBannerImage(response.banner_image_url || null);
        setAboutDescription(response.about_description || "Discover our amazing products.");
        setYoutubeLink(response.video_section_link || "");
      }
    } catch (err) {
      console.error("Error fetching product page:", err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast.error("Please upload a JPEG, JPG, or PNG image.");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Image size exceeds 4MB limit.");
        return;
      }
      setBannerImage(URL.createObjectURL(file));
      setBannerImageFile(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "video/mp4") {
        toast.error("Please upload an MP4 file only.");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size exceeds 50MB limit.");
        return;
      }
      setVideoFile(URL.createObjectURL(file));
      setYoutubeLink("");
    }
  };

  const handleYoutubeLinkChange = (e) => {
    const link = e.target.value;
    setYoutubeLink(link);
    setVideoFile(null);
    if (link && !link.includes("youtube.com/embed")) {
      toast.error("Please provide a valid YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID).");
    }
  };

  const handleSave = async () => {
    if (!tenantId) return;

    const formData = new FormData();
    formData.append("banner_content", bannerText);
    if (bannerImageFile) formData.append("banner_image", bannerImageFile);
    formData.append("about_description", aboutDescription);
    formData.append("video_section_link", youtubeLink);

    setIsSubmitting(true);
    try {
      const existingPage = await getAll(`/tenants/${tenantId}/product-page`);
      if (existingPage && existingPage.id) {
        await toast.promise(
          put(`/tenants/${tenantId}/product-page`, formData, true),
          {
            loading: 'Updating product page...',
            success: 'Product page updated successfully!',
            error: 'Failed to update product page.',
          }
        );
      } else {
        await toast.promise(
          post(`/tenants/${tenantId}/product-page`, formData, true),
          {
            loading: 'Creating product page...',
            success: 'Product page created successfully!',
            error: 'Failed to create product page.',
          }
        );
      }
      fetchProductPage();
      setBannerImageFile(null);
      setVideoFile(null);
    } catch (err) {
      console.error("Error saving product page:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    fetchProductPage();
    setBannerImageFile(null);
    setVideoFile(null);
  };

  const navItems = [
    { id: "banner", label: "Page Banner" },
    { id: "about", label: "About Products" },
    { id: "video", label: "Video Section" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "banner":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800 uppercase">Product Page Banner</h1>

            {bannerImage ? (
              <img
                src={bannerImage}
                alt="Banner Preview"
                className="w-full h-48 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  console.error(`Banner image failed: ${bannerImage}`);
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg shadow-md">
                <span className="text-gray-500 text-sm font-medium">No Image Uploaded</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image (1349px × 420px, Max 4MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-white hover:file:bg-gray-700 transition-all duration-200 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        );
      case "about":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">About Products</h1>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={aboutDescription}
                onChange={(e) => setAboutDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows="5"
                placeholder="Enter about products description..."
              />
            </div>
          </div>
        );
      case "video":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Video Section</h1>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Video Clip (MP4 only, Max 50MB)
              </label>
              <input
                type="file"
                accept="video/mp4"
                onChange={handleVideoUpload}
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-white hover:file:bg-gray-700 transition-all duration-200 disabled:opacity-50"
              />
              {videoFile && (
                <video
                  src={videoFile}
                  controls
                  className="w-full h-48 object-cover rounded-lg shadow-md mt-3"
                />
              )}
            </div>

            <div className="text-center text-gray-600 text-sm font-medium">OR</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube Embedded Link
              </label>
              <input
                type="text"
                value={youtubeLink}
                onChange={handleYoutubeLinkChange}
                disabled={isSubmitting}
                placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {youtubeLink && (
                <iframe
                  src={youtubeLink}
                  title="YouTube Video"
                  className="w-full h-48 rounded-lg shadow-md mt-3"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              <p className="text-xs text-gray-500 mt-2">
                <strong>How to get YouTube link:</strong> Go to your video on YouTube, click
                "Share," then "Embed," and copy the iframe src URL (e.g.,
                https://www.youtube.com/embed/VIDEO_ID).
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" />

      <aside className="w-56 bg-white shadow-lg p-4 rounded-2xl">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-gray-800 to-black text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center font-medium">{error.message}</p>
          ) : (
            <>
              {renderContent()}
              <div className="mt-6 flex space-x-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-sm disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting || !tenantId}
                  className="px-5 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  )}
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}