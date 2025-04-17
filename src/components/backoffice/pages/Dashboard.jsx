import React, { useEffect, useState } from "react";
import { BarChart2, Users, Package, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useApi from "@/hooks/useApi"; // Updated to useApi for consistency
import { getToken } from "@/utils/auth";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: categoryData, isLoading: categoryLoading, error: categoryError, getAll: getCategories } = useApi();
  const { data: blogData, isLoading: blogLoading, error: blogError, getAll: getBlogs } = useApi();
  const { data: productData, isLoading: productLoading, error: productError, getAll: getProducts } = useApi();
  const [tenantId, setTenantId] = useState(null);

  // Authentication and tenant setup
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

  // Fetch data when tenantId is available
  useEffect(() => {
    if (tenantId) {
      getCategories(`/tenants/${tenantId}/categories`);
      getBlogs(`/tenants/${tenantId}/blogs`);
      getProducts(`/tenants/${tenantId}/products`);
    }
  }, [tenantId, getCategories, getBlogs, getProducts]);

  // Process data with fallbacks
  const productCategories = (categoryData || []).map((cat, index) => ({
    srNo: index + 1,
    category: cat.name || "Unnamed Category",
    productCount: productData ? productData.filter((prod) => prod.category_id === cat.id).length : 0,
    status: cat.status === "active" ? "ACTIVE" : "INACTIVE",
  }));

  const blogPosts = (blogData || []).map((blog) => ({
    id: blog.id,
    title: blog.title || "Untitled",
    createdOn: new Date(blog.created_at).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    excerpt: blog.content ? `${blog.content.substring(0, 50)}...` : "No content available",
    imageUrl: blog.image_url || "https://via.placeholder.com/300x200?text=No+Image",
  }));

  const totalProducts = productData?.length || 0;
  const totalCategories = productCategories.length;

  return (
    <div className="container ">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Hello Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome to your dashboard</p>
      </div>

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Categories", value: totalCategories, icon: BarChart2, color: "bg-gradient-to-r from-gray-800 to-black" },
          { title: "Total Products", value: totalProducts, icon: Package, color: "bg-gradient-to-r from-gray-700 to-gray-900" },
          { title: "Total Subscribers", value: "3", icon: Users, color: "bg-gradient-to-r from-gray-800 to-black" }, // Static value, update if dynamic
          { title: "Next Billing", value: "31-Mar-2025", icon: Calendar, color: "bg-gradient-to-r from-gray-700 to-gray-900" }, // Static value
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`${stat.color} text-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium mb-2 opacity-90">{stat.title}</h3>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
              <stat.icon size={32} className="opacity-80" />
            </div>
          </div>
        ))}
      </div>

      {/* Product Overview */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 transition-all duration-300 hover:shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Overview</h3>
        {(categoryLoading || productLoading) && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-900 mx-auto"></div>
            <span className="text-gray-500 text-sm mt-2 block">Loading data...</span>
          </div>
        )}
        {(categoryError || productError) && !categoryLoading && !productLoading && (
          <p className="text-red-500 text-center bg-red-50 p-3 rounded-md">
            Error: {categoryError?.message || productError?.message || "Failed to load data"}
          </p>
        )}
        {!categoryLoading && !productLoading && !categoryError && !productError && (
          productCategories.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex items-center">
                  <label htmlFor="entries" className="text-sm text-gray-700 mr-2">
                    Show
                  </label>
                  <select
                    id="entries"
                    className="border border-gray-200 rounded-md p-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                  </select>
                  <span className="text-sm text-gray-700 ml-2">entries</span>
                </div>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    id="search"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200"
                    placeholder="Search categories..."
                  />
                  <BarChart2 size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr. No.</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Product Count</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productCategories.map((item) => (
                      <tr key={item.srNo} className="hover:bg-gray-50 transition-all duration-200">
                        <td className="px-6 py-4 text-sm text-gray-800">{item.srNo}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{item.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{item.productCount}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              item.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-600">
                <p>Showing 1 to {productCategories.length} of {totalCategories} entries</p>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black">
                    1
                  </button>
                  <button className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300">Next</button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-6">No product categories found.</p>
          )
        )}
      </div>

      {/* Blog Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Latest Blog Posts</h3>
        {blogLoading && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gray-900 mx-auto"></div>
            <span className="text-gray-500 text-sm mt-2 block">Loading blogs...</span>
          </div>
        )}
        {blogError && !blogLoading && (
          <p className="text-red-500 text-center bg-red-50 p-3 rounded-md">Error: {blogError.message}</p>
        )}
        {!blogLoading && !blogError && (
          blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{post.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">Created: {post.createdOn}</p>
                      <button className="text-sm text-gray-800 hover:text-black underline font-medium transition-colors duration-200">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">No blog posts found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;