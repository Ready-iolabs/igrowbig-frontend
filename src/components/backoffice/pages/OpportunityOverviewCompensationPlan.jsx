import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "react-feather";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { getToken } from "@/utils/auth";

const OpportunityOverviewCompensationPlan = () => {
  const { tenantId: paramTenantId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, getAll, post, put, request } = useTenantApi();

  const [tenantId, setTenantId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ plan_document: null });

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
      fetchPlan();
    }
  }, [tenantId]);

  const fetchPlan = async () => {
    try {
      const response = await getAll(`/tenants/${tenantId}/opportunity-page`);
      if (response && response.plan_document_url) {
        const fullUrl = response.plan_document_url;
        console.log("PDF URL:", fullUrl); // Debug the URL
        setPlans([{ id: response.id, plan_document_url: fullUrl }]);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error("Error fetching opportunity page plan:", err);
      setPlans([]);
    }
  };

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewPlan({ plan_document: null });
  };

  const handleEdit = (plan) => {
    setShowForm(true);
    setIsEditing(true);
    setNewPlan({ plan_document: null });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setNewPlan({ plan_document: null });
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only.");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        alert("File size exceeds 50MB limit.");
        return;
      }
      setNewPlan({ ...newPlan, plan_document: file });
    }
  };

  const handleSave = async () => {
    if (!tenantId) return;

    const formData = new FormData();

    // Only add the plan document to FormData
    if (newPlan.plan_document) {
      formData.append("plan_document", newPlan.plan_document);
    }

    try {
      const existingPage = await getAll(`/tenants/${tenantId}/opportunity-page`);
      if (existingPage && existingPage.id) {
        // Send a specific flag to indicate we're only updating the plan document
        formData.append("update_type", "plan_document_only");
        await put(`/tenants/${tenantId}/opportunity-page`, formData, true);
      } else {
        await post(`/tenants/${tenantId}/opportunity-page`, formData, true);
      }
      fetchPlan();
      handleCancel();
    } catch (err) {
      console.error("Error saving opportunity page plan:", err);
    }
  };

  const handleDelete = async () => {
    if (!tenantId || plans.length === 0) return;
    if (confirm("Are you sure you want to delete this plan document?")) {
      try {
        await request("delete", `/tenants/${tenantId}/opportunity-page`);
        setPlans([]);
      } catch (err) {
        console.error("Error deleting opportunity page plan:", err);
      }
    }
  };

  const filteredPlans = plans.filter((plan) =>
    plan.plan_document_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      {/* Always show the header with Add New button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Compensation Plans</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md"
        >
          <Plus size={16} className="mr-2" /> Add New
        </button>
      </div>

      {isLoading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {!showForm && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Plan Document</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-center text-gray-800">
                    No plan document found.{" "}
                    <button
                      onClick={handleAddNew}
                      className="text-blue-600 hover:underline"
                    >
                      Add one now
                    </button>.
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan, index) => (
                  <tr key={plan.id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      <a
                        href={plan.plan_document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        onClick={() => console.log("Opening PDF:", plan.plan_document_url)} // Debug click
                      >
                        View PDF
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200 flex items-center gap-1"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={handleDelete}
                        className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-1"
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
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {isEditing ? "Edit Plan Document" : "Create New Plan Document"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compensation Plan Document (PDF only, Max 50MB)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleDocumentUpload}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200"
                />
                {isEditing && plans[0]?.plan_document_url && !newPlan.plan_document && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current:{" "}
                    <a
                      href={plans[0].plan_document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View PDF
                    </a>
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
              disabled={isLoading || !newPlan.plan_document}
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

export default OpportunityOverviewCompensationPlan;