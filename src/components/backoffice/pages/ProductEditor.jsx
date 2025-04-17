import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "react-feather";
import { useNavigate } from "react-router-dom";
import useApi from "@/hooks/useApi";
import { getToken } from "@/utils/auth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";

const ProductEditor = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, getAll, post, put, request } = useApi();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tenantId, setTenantId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newProduct, setNewProduct] = useState({
    category_id: "",
    name: "",
    title: "",
    price: "",
    price_description: "",
    availability: "in_stock",
    status: "active",
    image: null,
    banner_image: null,
    guide_pdf: null,
    video: null,
    youtube_link: "",
    instructions: "",
    description: "",
  });

  // Quill toolbar configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  // Authentication and tenant setup
  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = getToken();
    if (!token) {
      toast.error("Please log in to continue.");
      navigate("/backoffice-login");
    } else if (storedTenantId) {
      setTenantId(storedTenantId);
    } else {
      toast.error("No tenant ID found. Please log in.");
      setProducts([]);
    }
  }, [navigate]);

  // Fetch data when tenantId is available
  useEffect(() => {
    if (tenantId) {
      fetchProducts();
      fetchCategories();
    }
  }, [tenantId]);

  const fetchProducts = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/products`),
        {
          loading: "Fetching products...",
          success: "Products loaded!",
          error: "Failed to load products.",
        }
      );
      setProducts(response || []);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/categories`),
        {
          loading: "Fetching categories...",
          success: "Categories loaded!",
          error: "Failed to load categories.",
        }
      );
      setCategories(response || []);
    } catch (err) {
      console.error("Error fetching categories:", err.response?.data || err.message);
      setCategories([]);
    }
  };

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewProduct({
      category_id: "",
      name: "",
      title: "",
      price: "",
      price_description: "",
      availability: "in_stock",
      status: "active",
      image: null,
      banner_image: null,
      guide_pdf: null,
      video: null,
      youtube_link: "",
      instructions: "",
      description: "",
    });
  };

  const handleEdit = (product) => {
    setShowForm(true);
    setIsEditing(true);
    setEditId(product.id);
    setNewProduct({
      category_id: product.category_id || "",
      name: product.name || "",
      title: product.title || "",
      price: product.price || "",
      price_description: product.price_description || "",
      availability: product.availability || "in_stock",
      status: product.status || "active",
      image: null,
      banner_image: null,
      guide_pdf: null,
      video: null,
      youtube_link: product.video_url || "",
      instructions: product.instructions || "",
      description: product.description || "",
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setNewProduct({
      category_id: "",
      name: "",
      title: "",
      price: "",
      price_description: "",
      availability: "in_stock",
      status: "active",
      image: null,
      banner_image: null,
      guide_pdf: null,
      video: null,
      youtube_link: "",
      instructions: "",
      description: "",
    });
  };

  const validateFile = (file, type, maxSizeMB) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (!file) return true;
    if (file.size > maxSizeBytes) {
      toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} size exceeds ${maxSizeMB}MB limit.`);
      return false;
    }
    if (type === "image" && !["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      toast.error("Please upload a JPEG, JPG, or PNG image.");
      return false;
    }
    if (type === "pdf" && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return false;
    }
    if (type === "video" && file.type !== "video/mp4") {
      toast.error("Please upload an MP4 video.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!newProduct.category_id || !newProduct.name || !newProduct.title || !newProduct.price) {
      toast.error("Please fill in all required fields (Category, Name, Title, Price).");
      return;
    }

    if (newProduct.youtube_link && !newProduct.youtube_link.includes("youtube.com/embed")) {
      toast.error("Please provide a valid YouTube embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID).");
      return;
    }

    if (
      !validateFile(newProduct.image, "image", 4) ||
      !validateFile(newProduct.banner_image, "image", 4) ||
      !validateFile(newProduct.guide_pdf, "pdf", 4) ||
      !validateFile(newProduct.video, "video", 50)
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("category_id", newProduct.category_id);
    formData.append("name", newProduct.name);
    formData.append("title", newProduct.title);
    formData.append("price", newProduct.price);
    formData.append("price_description", newProduct.price_description);
    formData.append("availability", newProduct.availability);
    formData.append("status", newProduct.status);
    if (newProduct.image) formData.append("image", newProduct.image);
    if (newProduct.banner_image) formData.append("banner_image", newProduct.banner_image);
    if (newProduct.guide_pdf) formData.append("guide_pdf", newProduct.guide_pdf);
    if (newProduct.video) formData.append("video", newProduct.video);
    formData.append("youtube_link", newProduct.youtube_link);
    formData.append("instructions", newProduct.instructions);
    formData.append("description", newProduct.description);

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await toast.promise(
          put(`/tenants/${tenantId}/products/${editId}`, formData, true),
          {
            loading: "Updating product...",
            success: "Product updated successfully!",
            error: "Failed to update product.",
          }
        );
      } else {
        await toast.promise(
          post(`/tenants/${tenantId}/products`, formData, true),
          {
            loading: "Creating product...",
            success: "Product created successfully!",
            error: "Failed to create product.",
          }
        );
      }
      fetchProducts();
      handleCancel();
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    setIsSubmitting(true);
    try {
      await toast.promise(
        request("delete", `/tenants/${tenantId}/products/${productId}`),
        {
          loading: "Deleting product...",
          success: "Product deleted successfully!",
          error: "Failed to delete product.",
        }
      );
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container ">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-300 shadow-md"
          >
            <Plus size={20} /> Add Product
          </button>
        )}
        {!showForm && (
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 shadow-sm"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-center bg-red-50 p-3 rounded-md mb-6">{error.message}</p>
      )}
      {!tenantId && (
        <p className="text-red-500 text-center bg-red-50 p-3 rounded-md mb-6">No tenant ID found. Please log in.</p>
      )}

      {!showForm && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gray-900 mx-auto"></div>
                    <span className="text-gray-500 text-sm mt-2 block">Loading products...</span>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-600">No products found.</td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{product.category_name || "Uncategorized"}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md shadow-sm hover:scale-105 transition-transform duration-200"
                          onError={(e) => (e.target.src = "https://via.placeholder.com/50x50?text=No+Image")}
                        />
                      ) : (
                        <span className="text-gray-500 italic">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(product)}
                        disabled={isSubmitting}
                        className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {isEditing ? "Edit Product" : "Create New Product"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={newProduct.category_id}
                  onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter product title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  value={newProduct.availability}
                  onChange={(e) => setNewProduct({ ...newProduct, availability: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="pre_order">Pre-Order</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newProduct.status}
                  onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Description</label>
                <textarea
                  value={newProduct.price_description}
                  onChange={(e) => setNewProduct({ ...newProduct, price_description: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter price description"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Image (JPEG, JPG, PNG, Max 4MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                />
                {isEditing && newProduct.image === null && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current:{" "}
                    <img
                      src={products.find((p) => p.id === editId)?.image_url || "https://via.placeholder.com/50x50?text=No+Image"}
                      alt="Current"
                      className="inline h-8 w-auto object-cover rounded-md"
                    />
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Banner Image (JPEG, JPG, PNG, Max 4MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                  onChange={(e) => setNewProduct({ ...newProduct, banner_image: e.target.files[0] })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Guide PDF (Max 4MB)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                  onChange={(e) => setNewProduct({ ...newProduct, guide_pdf: e.target.files[0] })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Video Clip (MP4, Max 50MB)
                </label>
                <input
                  type="file"
                  accept="video/mp4"
                  disabled={isSubmitting}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                  onChange={(e) => setNewProduct({ ...newProduct, video: e.target.files[0] })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OR Enter YouTube Embedded Link
                </label>
                <input
                  type="text"
                  value={newProduct.youtube_link}
                  onChange={(e) => setNewProduct({ ...newProduct, youtube_link: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How to get link: Click Share → Embed → Copy iframe src
                </p>
                {newProduct.youtube_link && (
                  <iframe
                    src={newProduct.youtube_link}
                    title="YouTube Preview"
                    className="w-full h-32 rounded-md mt-2 shadow-sm"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Instructions (if any)
              </label>
              <ReactQuill
                value={newProduct.instructions}
                onChange={(value) => setNewProduct({ ...newProduct, instructions: value })}
                modules={quillModules}
                className="bg-white rounded-md shadow-sm border border-gray-200"
                placeholder="Enter product instructions here..."
                readOnly={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
              <ReactQuill
                value={newProduct.description}
                onChange={(value) => setNewProduct({ ...newProduct, description: value })}
                modules={quillModules}
                className="bg-white rounded-md shadow-sm border border-gray-200"
                placeholder="Enter product description here..."
                readOnly={isSubmitting}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tenantId}
              className="px-6 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-300 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ProductEditor;