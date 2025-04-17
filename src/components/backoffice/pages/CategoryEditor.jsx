import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "react-feather";
import { useNavigate } from "react-router-dom";
import useApi from "@/hooks/useApi";
import { getToken } from "@/utils/auth";
import toast, { Toaster } from "react-hot-toast";

const CategoryEditor = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, getAll, post, put, request } = useApi();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: null,
    status: "active",
  });
  const [tenantId, setTenantId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = getToken();
    if (!token) {
      navigate("/login");
    } else if (storedTenantId) {
      setTenantId(storedTenantId);
    } else {
      console.error("No tenant_id found in localStorage");
      setCategories([]);
    }
  }, [navigate]);

  useEffect(() => {
    if (tenantId) {
      fetchCategories();
    }
  }, [tenantId]);

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories for tenantId:", tenantId);
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/categories`),
        {
          loading: "Fetching categories...",
          success: "Categories loaded!",
          error: "Failed to load categories.",
        }
      );
      setCategories(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching categories:", err.response?.data || err.message);
      setCategories([]);
    }
  };

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewCategory({ name: "", description: "", image: null, status: "active" });
  };

  const handleEdit = (category) => {
    setShowForm(true);
    setIsEditing(true);
    setEditId(category.id);
    setNewCategory({
      name: category.name,
      description: category.description || "",
      image: null,
      status: category.status || "active",
    });
    console.log("Editing category:", category);
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setNewCategory({ name: "", description: "", image: null, status: "active" });
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

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found. Please log in again.");
      return;
    }

    if (!newCategory.name) {
      toast.error("Category name is required.");
      return;
    }

    if (!validateFile(newCategory.image)) {
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description || "");
    formData.append("status", newCategory.status.toLowerCase());
    if (newCategory.image) formData.append("image", newCategory.image);

    console.log("Saving category with data:", Object.fromEntries(formData));

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await toast.promise(
          put(`/tenants/${tenantId}/categories/${editId}`, formData, true),
          {
            loading: "Updating category...",
            success: "Category updated successfully!",
            error: "Failed to update category.",
          }
        );
      } else {
        await toast.promise(
          post(`/tenants/${tenantId}/categories`, formData, true),
          {
            loading: "Creating category...",
            success: "Category created successfully!",
            error: "Failed to create category.",
          }
        );
      }
      await fetchCategories();
      handleCancel();
    } catch (err) {
      console.error("Error saving category:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setIsSubmitting(true);
      try {
        await toast.promise(
          request("delete", `/tenants/${tenantId}/categories/${categoryId}`),
          {
            loading: "Deleting category...",
            success: "Category deleted successfully!",
            error: "Failed to delete category.",
          }
        );
        await fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err.response?.data || err.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container ">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            <Plus size={18} /> Add Category
          </button>
        )}
        {!showForm && (
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 shadow-sm"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        )}
      </div>

      {error && <p className="text-red-500 mb-4 text-center font-medium">{error.message}</p>}
      {!tenantId && <p className="text-red-500 mb-4 text-center font-medium">No tenant ID found. Please log in.</p>}

      {!showForm && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transition-all duration-300">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Sr.No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Categories Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-800">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {category.description || "No description"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-10 h-10 object-cover rounded shadow-sm"
                          onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.status.toLowerCase() === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(category)}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
                      >
                        <Trash2 size={16} /> Delete
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
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">
            {isEditing ? "Edit Category" : "Create New Category"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, description: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter description"
                  rows="3"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image (JPEG, JPG, PNG, Max 4MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, image: e.target.files[0] })
                  }
                />
                {isEditing && newCategory.image === null && (
                  <p className="text-xs text-gray-500 mt-2">
                    Current: <img
                      src={categories.find((c) => c.id === editId)?.image_url || '/placeholder-image.jpg'}
                      alt="Current"
                      className="inline h-8 w-auto object-cover rounded"
                      onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                    />
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={newCategory.status}
                  onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-5 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tenantId}
              className="px-5 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              )}
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryEditor;