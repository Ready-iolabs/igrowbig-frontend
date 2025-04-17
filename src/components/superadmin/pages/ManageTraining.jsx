import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "react-feather";
import useTenantApi from "@/hooks/useTenantApi";
import toast, { Toaster } from "react-hot-toast";

const ManageTraining = () => {
  const { data, loading: isLoading, error, getAll, post, put, del } = useTenantApi();
  const [trainings, setTrainings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [isEditingTraining, setIsEditingTraining] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editTrainingId, setEditTrainingId] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newTraining, setNewTraining] = useState({
    title: "",
    category_id: "",
    training_url: "",
    document: null,
    status: "ACTIVE",
  });

  const [newCategory, setNewCategory] = useState({ name: "" });

  useEffect(() => {
    fetchTrainings();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (data?.trainings) setTrainings(data.trainings);
    if (data?.categories) setCategories(data.categories);
  }, [data]);

  const fetchTrainings = async () => {
    try {
      await toast.promise(getAll("/admin/training"), {
        loading: "Fetching trainings...",
        success: (res) => res.message || "Trainings retrieved successfully",
        error: (err) => err.response?.data?.message || "Failed to retrieve trainings",
      });
    } catch (err) {
      console.error("Error fetching trainings:", err.response?.data || err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      await toast.promise(getAll("/admin/training/categories"), {
        loading: "Fetching categories...",
        success: (res) => res.message || "Categories retrieved successfully",
        error: (err) => err.response?.data?.message || "Failed to retrieve categories",
      });
    } catch (err) {
      console.error("Error fetching categories:", err.response?.data || err.message);
    }
  };

  // Training Handlers
  const handleAddNewTraining = () => {
    setShowTrainingForm(true);
    setIsEditingTraining(false);
    setNewTraining({ title: "", category_id: "", training_url: "", document: null, status: "ACTIVE" });
  };

  const handleEditTraining = (training) => {
    setShowTrainingForm(true);
    setIsEditingTraining(true);
    setEditTrainingId(training.id);
    setNewTraining({
      title: training.title,
      category_id: training.category_id,
      training_url: training.training_url || "",
      document: null,
      status: training.status,
    });
  };

  const handleSaveTraining = async () => {
    if (!newTraining.title.trim()) {
      toast.error("Training title is required.");
      return;
    }
    if (!newTraining.category_id) {
      toast.error("Valid category ID is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newTraining.title);
    formData.append("category_id", newTraining.category_id);
    if (newTraining.training_url) formData.append("training_url", newTraining.training_url);
    if (newTraining.document) formData.append("document", newTraining.document);
    formData.append("status", newTraining.status);

    setIsSubmitting(true);
    try {
      await toast.promise(
        isEditingTraining ? put(`/admin/training/${editTrainingId}`, formData, true) : post("/admin/training", formData, true),
        {
          loading: "Saving training...",
          success: (res) => res.message || "Training saved successfully",
          error: (err) => err.response?.data?.message || "Failed to save training",
        }
      );
      await fetchTrainings();
      handleCancel();
    } catch (err) {
      console.error("Error saving training:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTraining = async (id) => {
    if (!confirm("Are you sure you want to delete this training?")) return;
    setIsSubmitting(true);
    try {
      await toast.promise(del(`/admin/training/${id}`), {
        loading: "Deleting training...",
        success: (res) => res.message || "Training deleted successfully",
        error: (err) => err.response?.data?.message || "Failed to delete training",
      });
      await fetchTrainings();
    } catch (err) {
      console.error("Error deleting training:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Document must be less than 4MB.");
        return;
      }
      setNewTraining({ ...newTraining, document: file });
      toast.success("Document selected successfully!");
    }
  };

  // Category Handlers
  const handleAddNewCategory = () => {
    setShowCategoryForm(true);
    setIsEditingCategory(false);
    setNewCategory({ name: "" });
  };

  const handleEditCategory = (category) => {
    setShowCategoryForm(true);
    setIsEditingCategory(true);
    setEditCategoryId(category.id);
    setNewCategory({ name: category.name });
  };

  const handleSaveCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await toast.promise(
        isEditingCategory
          ? put(`/admin/training/categories/${editCategoryId}`, { name: newCategory.name })
          : post("/admin/training/categories", { name: newCategory.name }),
        {
          loading: isEditingCategory ? "Updating category..." : "Creating category...",
          success: (res) => res.message || "Category saved successfully",
          error: (err) => err.response?.data?.message || "Failed to save category",
        }
      );
      await fetchCategories();
      handleCancel();
    } catch (err) {
      console.error("Error saving category:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category? Related trainings will have their category set to null.")) return;
    setIsSubmitting(true);
    try {
      await toast.promise(del(`/admin/training/categories/${id}`), {
        loading: "Deleting category...",
        success: (res) => res.message || "Category deleted successfully",
        error: (err) => err.response?.data?.message || "Failed to delete category",
      });
      await fetchCategories();
      await fetchTrainings();
    } catch (err) {
      console.error("Error deleting category:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowTrainingForm(false);
    setShowCategoryForm(false);
    setIsEditingTraining(false);
    setIsEditingCategory(false);
    setEditTrainingId(null);
    setEditCategoryId(null);
    setNewTraining({ title: "", category_id: "", training_url: "", document: null, status: "ACTIVE" });
    setNewCategory({ name: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#000", color: "#fff", borderRadius: "8px", padding: "12px" },
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        {!showTrainingForm && !showCategoryForm && (
          <div className="flex gap-4 ">
            <button
              onClick={handleAddNewTraining}
              className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg font-medium"
              disabled={isSubmitting}
            >
              <Plus size={18} /> Add Training
            </button>
            <button
              onClick={handleAddNewCategory}
              className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg font-medium"
              disabled={isSubmitting}
            >
              <Plus size={18} /> Add Category
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black mx-auto"></div>
          <span className="text-gray-700 text-lg mt-4 block animate-pulse font-medium">Loading data...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-white text-center bg-black p-4 rounded-lg shadow-md mb-10 animate-fade-in">
          {error.message || "An error occurred while loading data."}
        </div>
      )}

      {/* Training List */}
      {!isLoading && !error && !showTrainingForm && !showCategoryForm && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-black mb-6">Training List</h2>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Created On</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trainings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-center text-gray-500 font-medium">
                      No trainings found. Click "Add Training" to create one!
                    </td>
                  </tr>
                ) : (
                  trainings.map((training, index) => (
                    <tr key={training.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{training.category_name || "None"}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{training.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {new Date(training.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${training.status === "ACTIVE"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                            }`}
                        >
                          {training.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 flex items-center gap-4">
                        <button
                          onClick={() => handleEditTraining(training)}
                          className="text-gray-600 hover:text-black hover:scale-110 transition-all duration-200"
                          title="Edit Training"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTraining(training.id)}
                          className="text-gray-600 hover:text-black hover:scale-110 transition-all duration-200"
                          title="Delete Training"
                        >
                          <Trash2 size={18} color="red" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category List */}
      {!isLoading && !error && !showTrainingForm && !showCategoryForm && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-black mb-6">Category List</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-gray-500 font-medium">
                      No categories found. Click "Add Category" to create one!
                    </td>
                  </tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{category.name}</td>
                      <td className="px-6 py-4 flex items-center gap-4">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-gray-600 hover:text-black hover:scale-110 transition-all duration-200"
                          title="Edit Category"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-gray-600 hover:text-black hover:scale-110 transition-all duration-200"
                          title="Delete Category"
                        >
                          <Trash2 size={18} color="red" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Training Form */}
      {showTrainingForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-black">
              {isEditingTraining ? "Edit Training" : "Create New Training"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-black hover:scale-105 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Training Title <span className="text-black">*</span>
              </label>
              <input
                type="text"
                value={newTraining.title}
                onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all duration-200 disabled:opacity-50 bg-white"
                placeholder="Enter training title"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Section <span className="text-black">*</span>
              </label>
              <select
                value={newTraining.category_id}
                onChange={(e) => setNewTraining({ ...newTraining, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all duration-200 disabled:opacity-50 bg-white"
                disabled={isSubmitting}
              >
                <option value="">Select a section</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Training URL</label>
              <input
                type="text"
                value={newTraining.training_url}
                onChange={(e) => setNewTraining({ ...newTraining, training_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all duration-200 disabled:opacity-50 bg-white"
                placeholder="e.g., https://youtube.com/..."
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Document (Max 4MB)</label>
              <input
                type="file"
                onChange={handleDocumentUpload}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-black hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                disabled={isSubmitting}
              />
              {newTraining.document && (
                <div className="mt-3 relative">
                  <span className="text-sm text-gray-600">{newTraining.document.name}</span>
                  <button
                    onClick={() => setNewTraining({ ...newTraining, document: null })}
                    className="absolute top-1 right-1 bg-black text-white p-1 rounded-full hover:bg-gray-800 transition-all duration-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Status</label>
              <select
                value={newTraining.status}
                onChange={(e) => setNewTraining({ ...newTraining, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all duration-200 disabled:opacity-50 bg-white"
                disabled={isSubmitting}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-sm font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTraining}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-200 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditingTraining ? "Update Training" : "Save Training"}
            </button>
          </div>
        </div>
      )}

      {/* Category Form */}
      {showCategoryForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-black">
              {isEditingCategory ? "Edit Category" : "Create New Category"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-black hover:scale-105 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Category Name <span className="text-black">*</span>
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all duration-200 disabled:opacity-50 bg-white"
                placeholder="Enter category name"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-sm font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCategory}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-200 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditingCategory ? "Update Category" : "Save Category"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTraining;