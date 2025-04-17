import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, MessageSquare, X } from "react-feather";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useTenantApi from "@/hooks/useTenantApi";

// BlogEditor Component
const BlogEditor = () => {
  
  const navigate = useNavigate();
  const { data, loading: isLoading, error, getAll, post, put, request, del } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);
  const [editBannerId, setEditBannerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");

  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);

  const [newBlog, setNewBlog] = useState({ title: "", content: "", image: null, is_visible: true });
  const [newBanner, setNewBanner] = useState({ image: null, image_content: "", currentImage: null });

  // Authentication and tenant setup
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

  // Fetch blogs and banners
  useEffect(() => {
    if (tenantId) {
      fetchBlogs();
    }
  }, [tenantId]);

  const fetchBlogs = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/blogs`),
        {
          loading: "Fetching blogs...",
          success: "Blogs loaded successfully!",
          error: "Failed to load blogs.",
        }
      );
      if (response && Array.isArray(response)) {
        setBlogs(
          response.map((blog) => ({
            id: blog.id,
            title: blog.title,
            content: blog.content,
            image_url: blog.image_url || null,
            is_visible: blog.is_visible,
            created_at: blog.created_at.split("T")[0],
            banners: blog.banners || [],
          }))
        );
      } else {
        setBlogs([]);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err.response?.data || err.message);
      setBlogs([]);
    }
  };

  // Blog Handlers
  const handleAddNewBlog = () => {
    setShowBlogForm(true);
    setIsEditingBlog(false);
    setNewBlog({ title: "", content: "", image: null, is_visible: true });
  };

  const handleEditBlog = (blog) => {
    setShowBlogForm(true);
    setIsEditingBlog(true);
    setEditBlogId(blog.id);
    setNewBlog({ title: blog.title, content: blog.content, image: null, is_visible: blog.is_visible });
  };

  // Banner Handlers
  const handleAddNewBanner = (blogId = null) => {
    if (!blogId && blogs.length === 0) {
      toast.error("Please create a blog first to add a banner.");
      return;
    }
    setShowBannerForm(true);
    setIsEditingBanner(false);
    setEditBlogId(blogId || blogs[0]?.id); // Default to first blog if no specific blogId
    setNewBanner({ image: null, image_content: "", currentImage: null });
  };

  const handleEditBanner = (banner, blogId) => {
    setShowBannerForm(true);
    setIsEditingBanner(true);
    setEditBannerId(banner.id);
    setEditBlogId(blogId);
    setNewBanner({ image: null, image_content: banner.image_content, currentImage: banner.image_url });
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Image must be less than 4MB.");
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast.error("Only JPEG/JPG/PNG images are allowed.");
        return;
      }
      if (type === "blog") {
        setNewBlog({ ...newBlog, image: file });
      } else {
        setNewBanner({ ...newBanner, image: file });
      }
      toast.success("Image selected successfully!");
    }
  };

  const handleSaveBlog = async () => {
    if (!tenantId) {
      toast.error("Tenant ID not found.");
      return;
    }
    if (!newBlog.title.trim()) {
      toast.error("Blog title is required.");
      return;
    }
    if (!newBlog.content.trim()) {
      toast.error("Blog content is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("content", newBlog.content);
    if (newBlog.image) formData.append("image", newBlog.image);
    formData.append("is_visible", newBlog.is_visible);

    setIsSubmitting(true);
    try {
      await toast.promise(
        isEditingBlog
          ? put(`/tenants/${tenantId}/blogs/${editBlogId}`, formData, true)
          : post(`/tenants/${tenantId}/blogs`, formData, true),
        {
          loading: "Saving blog...",
          success: "Blog saved successfully!",
          error: (err) => `Failed to save blog: ${err.response?.data?.message || err.message}`,
        }
      );
      await fetchBlogs();
      handleCancel();
    } catch (err) {
      console.error("Error saving blog:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveBanner = async () => {
    if (!tenantId || !editBlogId) {
      toast.error("Invalid blog or tenant ID.");
      return;
    }
    if (!isEditingBanner && !newBanner.image) {
      toast.error("Image is required for a new banner.");
      return;
    }

    const formData = new FormData();
    if (newBanner.image) formData.append("image", newBanner.image);
    formData.append("image_content", newBanner.image_content);

    setIsSubmitting(true);
    try {
      await toast.promise(
        isEditingBanner
          ? put(`/tenants/${tenantId}/blogs/${editBlogId}/banners/${editBannerId}`, formData, true)
          : post(`/tenants/${tenantId}/blogs/${editBlogId}/banners`, formData, true),
        {
          loading: "Saving banner...",
          success: "Banner saved successfully!",
          error: (err) => `Failed to save banner: ${err.response?.data?.message || err.message}`,
        }
      );
      await fetchBlogs();
      handleCancel();
    } catch (err) {
      console.error("Error saving banner:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared Handlers
  const handleCancel = () => {
    setShowBlogForm(false);
    setShowBannerForm(false);
    setIsEditingBlog(false);
    setIsEditingBanner(false);
    setEditBlogId(null);
    setEditBannerId(null);
    setShowComments(false);
    setSelectedBlogId(null);
    setNewBlog({ title: "", content: "", image: null, is_visible: true });
    setNewBanner({ image: null, image_content: "", currentImage: null });
    setIsSubmitting(false);
    setNewComment("");
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog and its banners?")) return;
    setIsSubmitting(true);
    try {
      await toast.promise(
        del(`/tenants/${tenantId}/blogs/${id}`),
        {
          loading: "Deleting blog...",
          success: "Blog deleted successfully!",
          error: (err) => `Failed to delete blog: ${err.response?.data?.message || err.message}`,
        }
      );
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async (blogId, bannerId) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    setIsSubmitting(true);
    try {
      await toast.promise(
        del(`/tenants/${tenantId}/blogs/${blogId}/banners/${bannerId}`),
        {
          loading: "Deleting banner...",
          success: "Banner deleted successfully!",
          error: (err) => `Failed to delete banner: ${err.response?.data?.message || err.message}`,
        }
      );
      await fetchBlogs();
    } catch (err) {
      console.error("Error deleting banner:", err.response?.data || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Comment Handlers
  const handleShowComments = (blogId) => {
    setSelectedBlogId(blogId);
    setShowComments(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    const newCommentObj = {
      id: comments.length + 1,
      blogId: selectedBlogId,
      content: newComment,
      is_approved: false,
    };
    setComments([...comments, newCommentObj]);
    setNewComment("");
    toast.success("Comment added (pending approval).");
  };

  const handleApproveComment = (commentId) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, is_approved: true } : comment
      )
    );
    toast.success("Comment approved!");
  };

  const handleDeleteComment = (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    setComments(comments.filter((comment) => comment.id !== commentId));
    toast.success("Comment deleted!");
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container ">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {!showBlogForm && !showBannerForm && !showComments && (
          <div className="flex gap-4">
            <button
              onClick={handleAddNewBlog}
              className="bg-black  text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:from-blue-700 hover:to-blue-900 hover:scale-105 transition-all duration-300 shadow-lg"
              disabled={isSubmitting}
            >
              <Plus size={18} /> Add Blog
            </button>
            <button
              onClick={() => handleAddNewBanner()}
              className="bg-black text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:from-teal-700 hover:to-teal-900 hover:scale-105 transition-all duration-300 shadow-lg"
              disabled={isSubmitting}
            >
              <Plus size={18} /> Add Banner
            </button>
          </div>
        )}
        {!showBlogForm && !showBannerForm && !showComments && (
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search blogs..."
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
          <span className="text-gray-600 text-lg mt-4 block animate-pulse">Loading blogs...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-red-600 text-center bg-red-100 p-4 rounded-lg shadow-md mb-8 animate-fade-in">
          {error.message || "An error occurred while loading blogs."}
        </div>
      )}

      {/* Blog List */}
      {!isLoading && !error && !showBlogForm && !showBannerForm && !showComments && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Blog List</h2>
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Content</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                      No blogs found. Click "Add Blog" to create one!
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog, index) => (
                    <tr key={blog.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{blog.title}</td>
                      <td className="px-6 py-4">
                        {blog.image_url ? (
                          <img src={blog.image_url} alt={blog.title} className="w-24 h-14 object-cover rounded-md shadow-sm" />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{blog.content.substring(0, 50)}...</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${blog.is_visible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                        >
                          {blog.is_visible ? "Visible" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{blog.created_at}</td>
                      <td className="px-6 py-4 flex items-center gap-4">
                        <button
                          onClick={() => handleEditBlog(blog)}
                          className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200"
                          title="Edit Blog"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200"
                          title="Delete Blog"
                        >
                          <Trash2 size={18} />
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

      {/* Blog Banners */}
      {!isLoading && !error && !showBlogForm && !showBannerForm && !showComments && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Blog Banners</h2>
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Blog Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Content</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBlogs.flatMap((blog) =>
                  blog.banners.map((banner, index) => (
                    <tr key={banner.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{blog.title}</td>
                      <td className="px-6 py-4">
                        <img src={banner.image_url} alt="Banner" className="w-24 h-14 object-cover rounded-md shadow-sm" />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{banner.image_content.substring(0, 50)}...</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{banner.created_at.split("T")[0]}</td>
                      <td className="px-6 py-4 flex items-center gap-4">
                        <button
                          onClick={() => handleEditBanner(banner, blog.id)}
                          className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200"
                          title="Edit Banner"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(blog.id, banner.id)}
                          className="text-red-600 hover:text-red-800 hover:scale-110 transition-all duration-200"
                          title="Delete Banner"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {filteredBlogs.every((blog) => blog.banners.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                      No banners found. Click "Add Banner" above to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blog Form */}
      {showBlogForm && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEditingBlog ? "Edit Blog" : "Create New Blog"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newBlog.title}
                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
                placeholder="Enter blog title"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blog Image (Max 4MB)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => handleImageUpload(e, "blog")}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-all duration-200 disabled:opacity-50"
                disabled={isSubmitting}
              />
              {newBlog.image && (
                <div className="mt-3 relative">
                  <img
                    src={URL.createObjectURL(newBlog.image)}
                    alt="Preview"
                    className="w-40 h-24 object-cover rounded-md shadow-sm"
                  />
                  <button
                    onClick={() => setNewBlog({ ...newBlog, image: null })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all duration-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {isEditingBlog && !newBlog.image && blogs.find((b) => b.id === editBlogId)?.image_url && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                  <img
                    src={blogs.find((b) => b.id === editBlogId).image_url}
                    alt="Current"
                    className="w-40 h-24 object-cover rounded-md shadow-sm"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newBlog.content}
                onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 h-40 resize-y disabled:opacity-50 shadow-sm"
                placeholder="Enter blog content"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newBlog.is_visible ? "Visible" : "Hidden"}
                onChange={(e) => setNewBlog({ ...newBlog, is_visible: e.target.value === "Visible" })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
                disabled={isSubmitting}
              >
                <option value="Visible">Visible</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
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
              onClick={handleSaveBlog}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full hover:from-blue-700 hover:to-blue-900 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditingBlog ? "Update Blog" : "Save Blog"}
            </button>
          </div>
        </div>
      )}

      {/* Banner Form */}
      {showBannerForm && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEditingBanner ? "Edit Banner" : "Create New Banner"}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Blog</label>
              <select
                value={editBlogId || ""}
                onChange={(e) => setEditBlogId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm transition-all duration-200 disabled:opacity-50 shadow-sm"
                disabled={isSubmitting || isEditingBanner}
              >
                {blogs.map((blog) => (
                  <option key={blog.id} value={blog.id}>
                    {blog.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (Max 4MB) {isEditingBanner ? "" : <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => handleImageUpload(e, "banner")}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 transition-all duration-200 disabled:opacity-50"
                disabled={isSubmitting}
              />
              {newBanner.image && (
                <div className="mt-3 relative">
                  <img
                    src={URL.createObjectURL(newBanner.image)}
                    alt="Preview"
                    className="w-40 h-24 object-cover rounded-md shadow-sm"
                  />
                  <button
                    onClick={() => setNewBanner({ ...newBanner, image: null })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all duration-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {isEditingBanner && newBanner.currentImage && !newBanner.image && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                  <img
                    src={newBanner.currentImage}
                    alt="Current"
                    className="w-40 h-24 object-cover rounded-md shadow-sm"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Content</label>
              <textarea
                value={newBanner.image_content}
                onChange={(e) => setNewBanner({ ...newBanner, image_content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm transition-all duration-200 h-32 resize-y disabled:opacity-50 shadow-sm"
                placeholder="Enter banner content"
                disabled={isSubmitting}
              />
            </div>
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
              onClick={handleSaveBanner}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-full hover:from-teal-700 hover:to-teal-900 hover:scale-105 transition-all duration-200 text-sm font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              )}
              {isSubmitting ? "Saving..." : isEditingBanner ? "Update Banner" : "Save Banner"}
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default BlogEditor;