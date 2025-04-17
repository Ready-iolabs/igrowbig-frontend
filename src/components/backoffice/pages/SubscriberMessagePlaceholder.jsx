import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { getToken } from "@/utils/auth";
import toast, { Toaster } from "react-hot-toast";

const SubscriberMessagePlaceholder = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, getAll } = useTenantApi();
  const [tenantId, setTenantId] = useState(localStorage.getItem("tenant_id") || null);
  const [subscribers, setSubscribers] = useState([]);

  // Authentication and tenant setup
  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = getToken();
    if (!token || !storedTenantId) {
      toast.error("Please log in to continue.");
      navigate("/backoffice-login");
    } else if (tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, [tenantId, navigate]);

  // Fetch subscribers when tenantId is available
  useEffect(() => {
    if (tenantId) {
      fetchSubscribers();
    }
  }, [tenantId]);

  const fetchSubscribers = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/subscribers`),
        {
          loading: "Fetching subscribers...",
          success: "Subscribers loaded successfully!",
          error: "Failed to load subscribers.",
        }
      );
      setSubscribers(response?.subscribers || []);
    } catch (err) {
      console.error("Error fetching subscribers:", err.response?.data || err.message);
      setSubscribers([]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Subscribers</h2>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading subscribers...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg shadow-sm border border-red-200">
          Error: {error.message} {error.details ? `- ${error.details}` : ""}
        </div>
      )}

      {/* Subscribers Table */}
      {!isLoading && !error && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          {subscribers.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No subscribers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-800 to-black text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Subscribed At</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{subscriber.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{subscriber.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 break-all">
                        <a href={`mailto:${subscriber.email}`} className="text-blue-600 hover:underline">
                          {subscriber.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {new Date(subscriber.subscribed_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscriber.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subscriber.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriberMessagePlaceholder;