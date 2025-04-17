import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter } from "react-feather";
import toast, { Toaster } from "react-hot-toast";
import useTenantApi from "@/hooks/useTenantApi";
import { getToken } from "@/utils/auth";

const TenantTrainingList = () => {
  const { getAll, loading, error } = useTenantApi();
  const navigate = useNavigate();
  const [tenantId, setTenantId] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [filter, setFilter] = useState("all"); // all, active, inactive

  // Check authentication and tenantId
  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = getToken();
    if (!token || !storedTenantId) {
      toast.error("Please log in to continue");
      navigate("/backoffice-login");
    } else {
      console.log("Tenant ID:", storedTenantId); // Debug
      setTenantId(storedTenantId);
    }
  }, [navigate]);

  // Fetch trainings when tenantId is set
  useEffect(() => {
    if (tenantId) {
      fetchTrainings();
    }
  }, [tenantId]);

  const fetchTrainings = async () => {
    try {
      console.log("Fetching trainings for tenantId:", tenantId); // Debug
      const response = await getAll(`/tenants/${tenantId}/trainings`);
      console.log("Trainings response:", response); // Debug
      if (response && response.trainings) {
        setTrainings(response.trainings);
      } else {
        setTrainings([]);
      }
    } catch (err) {
      console.error("Error fetching trainings:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Authentication failed. Please log in again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/backoffice-login"), 1000);
      } else {
        toast.error(err.message || "Failed to fetch trainings");
      }
    }
  };
  // Filter trainings based on status
  const filteredTrainings = trainings.filter((training) => {
    if (filter === "active") return training.status === "ACTIVE";
    if (filter === "inactive") return training.status === "INACTIVE";
    return true;
  });

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Your Trainings</h2>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:bg-gray-100 transition-all duration-200 shadow-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800"></div>
          <p className="mt-2 text-gray-600">Loading trainings...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md mb-4">
          <p className="text-red-700 font-semibold">Error</p>
          <p className="text-red-600">{error.message || "An error occurred"}</p>
          {error.details && <p className="text-red-500 text-sm">{error.details}</p>}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTrainings.length === 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 text-center border border-gray-200">
          <p className="text-gray-600">
            {filter === "all"
              ? "No trainings to display."
              : filter === "active"
              ? "No active trainings."
              : "No inactive trainings."}
          </p>
        </div>
      )}

      {/* Training List */}
      {!loading && !error && filteredTrainings.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Training URL</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Document URL</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Created At</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Updated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTrainings.map((training, index) => (
                <tr
                  key={training.id}
                  className={`transition-all duration-200 ${
                    training.status === "ACTIVE" ? "bg-green-50" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{training.category_name || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{training.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {training.training_url ? (
                      <a
                        href={training.training_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Training
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {training.document_url ? (
                      <a
                        href={training.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        training.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {training.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(training.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {training.updated_at ? new Date(training.updated_at).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default TenantTrainingList;