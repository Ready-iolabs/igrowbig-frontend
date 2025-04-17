import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "react-feather";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "@/hooks/useApi";
import { getToken } from "@/utils/auth";

const ContactUsEditor = () => {
  const { tenantId: paramTenantId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, getAll, post, put, request } = useApi();

  const [tenantId, setTenantId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pages, setPages] = useState([]);

  const [newPage, setNewPage] = useState({
    image: null,
    text: "",
  });

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = getToken();
    if (!token) {
      navigate("/backoffice-login");
    } else if (storedTenantId) {
      setTenantId(storedTenantId);
    } else {
      console.error("No tenant_id found in localStorage");
      navigate("/backoffice-login");
    }
  }, [navigate]);

  useEffect(() => {
    if (tenantId) {
      fetchPages();
    }
  }, [tenantId]);

  const fetchPages = async () => {
    try {
      const response = await getAll(`/tenants/${tenantId}/contactus`);
      if (response && Array.isArray(response)) {
        setPages(
          response.map((page) => ({
            id: page.id,
            image: page.contactus_image,
            text: page.contactus_text,
            created_at: page.created_at.split("T")[0],
          }))
        );
      } else {
        setPages([]);
      }
    } catch (err) {
      console.error("Error fetching contact us pages:", err);
      setPages([]);
    }
  };

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewPage({ image: null, text: "" });
  };

  const handleEdit = (page) => {
    setShowForm(true);
    setIsEditing(true);
    setEditId(page.id);
    setNewPage({
      image: null,
      text: page.text,
      currentImage: page.image,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setNewPage({ image: null, text: "" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 4 * 1024 * 1024) {
      alert("Image must be less than 4MB");
      return;
    }
    setNewPage({ ...newPage, image: file });
  };

  const handleSave = async () => {
    if (!tenantId) return;

    const formData = new FormData();
    if (newPage.image) formData.append("contactus_image", newPage.image); // Match backend field
    formData.append("contactus_text", newPage.text); // Match backend field

    try {
      if (isEditing) {
        await put(`/tenants/${tenantId}/contactus/${editId}`, formData, true);
      } else {
        if (!newPage.image) {
          alert("Image is required");
          return;
        }
        await post(`/tenants/${tenantId}/contactus`, formData, true);
      }
      fetchPages();
      handleCancel();
    } catch (err) {
      console.error("Error saving contact us page:", err);
      alert("Failed to save: " + (err.message || "Unknown error"));
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this page?")) {
      try {
        await request("delete", `/tenants/${tenantId}/contactus/${id}`);
        setPages(pages.filter((page) => page.id !== id));
      } catch (err) {
        console.error("Error deleting contact us page:", err);
        alert("Failed to delete: " + (err.message || "Unknown error"));
      }
    }
  };

  const filteredPages = pages.filter((page) =>
    (page.text || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-gray-800 to-black text-white uppercase px-5 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            <Plus size={18} /> Add Contact Us Page
          </button>
        )}
        {!showForm && (
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 shadow-sm"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        )}
      </div>

      {isLoading && <p className="text-gray-600 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error.message}</p>}

      {!showForm && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Text</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Created On</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-800">
                    No pages found.
                  </td>
                </tr>
              ) : (
                filteredPages.map((page, index) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-4 py-3 text-sm text-gray-800">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{page.text}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <img src={page.image} alt="Contact Us" className="w-20 h-10 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{page.created_at}</td>
                    <td className="px-4 py-3 text-sm flex gap-3">
                      <button
                        onClick={() => handleEdit(page)}
                        className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
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

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {isEditing ? "Edit Contact Us Page" : "Create New Contact Us Page"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                <input
                  type="text"
                  value={newPage.text}
                  onChange={(e) => setNewPage({ ...newPage, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50"
                  placeholder="Enter text"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image (Max 4MB)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200"
                />
                {isEditing && newPage.currentImage && !newPage.image && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current: <img src={newPage.currentImage} alt="Current" className="w-20 h-10 object-cover rounded inline-block" />
                  </p>
                )}
              </div>
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
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md disabled:opacity-50"
            >
              {isLoading ? "Saving..." : isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUsEditor;