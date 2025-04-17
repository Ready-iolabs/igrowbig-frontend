import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "react-feather";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";

const PageBannerEditor = () => {
  const { tenantId: paramTenantId } = useParams();
  const navigate = useNavigate();
  const { isLoading, error, data, getAll, post, del } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [banner, setBanner] = useState(null);
  const [newBanner, setNewBanner] = useState({
    image_banner_content: "",
    joinus_image_banner: null,
  });
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

  // Fetch banner
  const fetchBanner = useCallback(async () => {
    if (!tenantId) return;
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/joinus-page`),
        {
          loading: "Fetching banner...",
          success: "Banner loaded!",
          error: "Failed to load banner.",
        }
      );
      console.log("Fetched banner response:", response);
      if (response && (response.image_banner_content || response.joinus_image_banner_url)) {
        setBanner({
          id: response.id,
          image_banner_content: response.image_banner_content || "",
          joinus_image_banner_url: response.joinus_image_banner_url || null,
          created_at: response.created_at || new Date().toISOString(),
        });
      } else {
        setBanner(null);
      }
    } catch (err) {
      console.error("Fetch banner error:", err);
      setBanner(null);
    }
  }, [tenantId, getAll]);

  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  const handleAddOrEdit = () => {
    setShowForm(true);
    setNewBanner({
      image_banner_content: banner?.image_banner_content || "",
      joinus_image_banner: null,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setNewBanner({ image_banner_content: "", joinus_image_banner: null });
  };

  const validateFile = (file) => {
    if (!file) return true;
    if (!/image\/(jpeg|jpg|png)/.test(file.type)) {
      toast.error("Please upload a JPEG/JPG/PNG file.");
      return false;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("File size exceeds 4MB limit.");
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setNewBanner({
        ...newBanner,
        joinus_image_banner: file,
      });
      toast.info("Image selected successfully!");
    }
  };

  const handleSave = async () => {
    if (!newBanner.image_banner_content.trim()) {
      toast.error("Banner text is required.");
      return;
    }
    if (!validateFile(newBanner.joinus_image_banner)) return;

    const formData = new FormData();
    formData.append("image_banner_content", newBanner.image_banner_content);
    if (newBanner.joinus_image_banner) {
      formData.append("joinus_image_banner", newBanner.joinus_image_banner);
    }

    setIsSubmitting(true);
    try {
      const response = await toast.promise(
        post(`/tenants/${tenantId}/joinus-page`, formData, true),
        {
          loading: banner ? "Updating banner..." : "Creating banner...",
          success: banner ? "Banner updated!" : "Banner created!",
          error: (err) => `Failed to save banner: ${err.message || "Unknown error"}`,
        }
      );
      console.log("Save banner response:", response);
      await fetchBanner();
      handleCancel();
    } catch (err) {
      console.error("Save banner error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!banner) {
      toast.error("No banner to delete.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await toast.promise(
        del(`/tenants/${tenantId}/joinus-page`),
        {
          loading: "Deleting banner...",
          success: "Banner deleted!",
          error: (err) => `Failed to delete banner: ${err.message || "Unknown error"}`,
        }
      );
      console.log("Delete banner response:", response);
      setBanner(null);
    } catch (err) {
      console.error("Delete banner error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container ">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Join Us Page Banner</h2>
        {!showForm && (
          <button
            onClick={handleAddOrEdit}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black transition-transform hover:scale-105 shadow-md disabled:opacity-50"
            disabled={isSubmitting}
          >
            <Plus size={16} /> {banner ? "Update Banner" : "Add Banner"}
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
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading banner...</span>
        </div>
      )}

      {/* No Banner State */}
      {!isLoading && !showForm && !banner && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Banner Yet</h2>
          <p className="text-gray-600 mb-6">Add a banner to make the Join Us page stand out!</p>
          <button
            onClick={handleAddOrEdit}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-6 py-3 rounded-full hover:from-gray-900 hover:to-black transition-transform hover:scale-105 shadow-md"
            disabled={isSubmitting}
          >
            Add Banner
          </button>
        </div>
      )}

      {/* Banner Display */}
      {!isLoading && !showForm && banner && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Banner Text</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Created At</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 text-sm text-gray-800">1</td>
                <td className="px-4 py-2 text-sm text-gray-800">{banner.image_banner_content || "N/A"}</td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {banner.joinus_image_banner_url ? (
                    <img src={banner.joinus_image_banner_url} alt="Banner" className="h-10 w-auto rounded" />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {new Date(banner.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm flex gap-2">
                  <button
                    onClick={handleAddOrEdit}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    disabled={isSubmitting}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Banner Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {banner ? "Update Banner" : "Add Banner"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newBanner.image_banner_content}
                onChange={(e) => setNewBanner({ ...newBanner, image_banner_content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                placeholder="Enter banner text"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image (1349px x 420px, Max 4MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                disabled={isSubmitting}
              />
              {(newBanner.joinus_image_banner || (banner?.joinus_image_banner_url && !newBanner.joinus_image_banner)) && (
                <img
                  src={
                    newBanner.joinus_image_banner
                      ? URL.createObjectURL(newBanner.joinus_image_banner)
                      : banner.joinus_image_banner_url
                  }
                  alt="Preview"
                  className="mt-2 h-20 w-auto rounded shadow-sm"
                />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-transform hover:scale-105"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !newBanner.image_banner_content}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-lg hover:from-gray-900 hover:to-black transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : banner ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageBannerEditor;