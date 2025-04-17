import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Search } from "react-feather";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";

const OpportunityOverviewPageBanner = () => {
  const { tenantId: paramTenantId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, getAll, post, put, del } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [banner, setBanner] = useState(null);
  const [newBanner, setNewBanner] = useState({
    banner_content: "",
    banner_image: null,
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

  // Fetch banner when tenantId is set
  const fetchBanner = useCallback(async () => {
    if (!tenantId) return;
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/opportunity-page`),
        {
          loading: "Fetching banner...",
          success: "Banner loaded!",
          error: "Failed to load banner.",
        }
      );
      if (response?.banner_content) {
        setBanner({
          id: response.id,
          title: response.banner_content,
          image: response.banner_image_url || null,
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

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewBanner({ banner_content: "", banner_image: null });
  };

  const handleEdit = () => {
    setShowForm(true);
    setIsEditing(true);
    setNewBanner({ banner_content: banner.title, banner_image: null });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setNewBanner({ banner_content: "", banner_image: null });
  };

  const validateFile = (file) => {
    if (!file) return true;
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
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
      setNewBanner({ ...newBanner, banner_image: file });
      toast.info("Image selected successfully!");
    }
  };

  const handleSave = async () => {
    if (!newBanner.banner_content.trim()) {
      toast.error("Banner text is required.");
      return;
    }

    if (!validateFile(newBanner.banner_image)) return;

    const formData = new FormData();
    formData.append("banner_content", newBanner.banner_content);
    if (newBanner.banner_image) formData.append("banner_image", newBanner.banner_image);

    setIsSubmitting(true);
    try {
      const endpoint = `/tenants/${tenantId}/opportunity-page`;
      await toast.promise(
        (banner ? put : post)(endpoint, formData, true),
        {
          loading: banner ? "Updating banner..." : "Creating banner...",
          success: banner ? "Banner updated!" : "Banner created!",
          error: (err) => `Failed to save banner: ${err.message || "Unknown error"}`,
        }
      );
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
      await toast.promise(
        del(`/tenants/${tenantId}/opportunity-page`),
        {
          loading: "Deleting banner...",
          success: "Banner deleted!",
          error: (err) => `Failed to delete banner: ${err.message || "Unknown error"}`,
        }
      );
      setBanner(null);
    } catch (err) {
      console.error("Delete banner error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBanner = banner && banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ? banner : null;

  return (
    <div className="container mx-auto px-4 py-6">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black transition-transform hover:scale-105 shadow-md disabled:opacity-50"
            disabled={isSubmitting}
          >
            <Plus size={18} /> {banner ? "Edit Banner" : "Add Banner"}
          </button>
        )}
        {!showForm && banner && (
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search banner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all shadow-sm"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        )}
      </div>

      {/* Error/Loading States */}
      {error && !isLoading && (
        <p className="text-red-500 mb-4 text-center font-medium">{error.message || "An error occurred."}</p>
      )}
      {!tenantId && !isLoading && (
        <p className="text-red-500 mb-4 text-center font-medium">Please log in.</p>
      )}

      {/* Banner Table */}
      {!showForm && (
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 transition-shadow hover:shadow-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Banner Text</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
                    <span className="text-gray-600 mt-2 block">Loading...</span>
                  </td>
                </tr>
              ) : !filteredBanner ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-800">
                    No banner found. Click "Add Banner" to create one!
                  </td>
                </tr>
              ) : (
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">1</td>
                  <td className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">{filteredBanner.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {filteredBanner.image ? (
                      <img
                        src={filteredBanner.image}
                        alt={filteredBanner.title}
                        className="w-10 h-10 object-cover rounded shadow-sm"
                        onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium flex gap-4">
                    <button
                      onClick={handleEdit}
                      disabled={isSubmitting}
                      className="text-gray-600 hover:text-black flex items-center gap-1 disabled:opacity-50"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="text-gray-600 hover:text-red-600 flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-shadow hover:shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit Banner" : "Create Banner"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newBanner.banner_content}
                onChange={(e) => setNewBanner({ ...newBanner, banner_content: e.target.value })}
                disabled={isSubmitting}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter banner text"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image (JPEG/JPG/PNG, Max 4MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                disabled={isSubmitting}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50"
              />
              {newBanner.banner_image && (
                <p className="text-xs text-gray-500 mt-2">Selected: {newBanner.banner_image.name}</p>
              )}
              {isEditing && !newBanner.banner_image && banner?.image && (
                <p className="text-xs text-gray-500 mt-2">
                  Current: <img src={banner.image} alt="Current" className="inline h-8 w-auto object-cover rounded" />
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-5 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 transition-transform hover:scale-105 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black transition-transform hover:scale-105 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>}
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityOverviewPageBanner;