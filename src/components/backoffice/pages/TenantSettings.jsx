import React, { useState, useEffect } from "react";
import { Edit, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { getToken } from "@/utils/auth";
import { Progress } from "@/components/ui/progress";
import toast, { Toaster } from "react-hot-toast";

const TenantSettings = () => {
  const navigate = useNavigate();
  const { getAll, put, isLoading, error } = useTenantApi();
  const [tenantId, setTenantId] = useState(null);
  const [settings, setSettings] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    "Domain Details",
    "Agent Basic Information",
    "Site Identity",
    "Distributor Details",
    "Update",
  ];

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

  // Fetch settings when tenantId is available
  useEffect(() => {
    if (tenantId) {
      fetchSettings();
    }
  }, [tenantId]);

  const fetchSettings = async () => {
    try {
      const response = await toast.promise(
        getAll(`/tenants/${tenantId}/settings`),
        {
          loading: "Fetching settings...",
          success: "Settings loaded successfully!",
          error: (err) => err.response?.data?.message || "Failed to load settings.",
        }
      );
      setSettings(response || {});
    } catch (err) {
      console.error("Error fetching settings:", err.response?.data || err.message);
      setSettings({});
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateStep = () => {
    let newErrors = {};
    if (step === 0) {
      if (!formData.domain_type) newErrors.domain_type = "Domain type is required";
      if (!formData.primary_domain_name) newErrors.primary_domain_name = "Primary domain is required";
      if (formData.domain_type === "sub_domain" && !formData.sub_domain)
        newErrors.sub_domain = "Sub domain is required";
    } else if (step === 1) {
      if (!formData.first_name) newErrors.first_name = "First name is required";
      if (!formData.last_name) newErrors.last_name = "Last name is required";
      if (!formData.email_id) newErrors.email_id = "Email is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (formData.email_id && !/\S+@\S+\.\S+/.test(formData.email_id))
        newErrors.email_id = "Enter a valid email address";
    } else if (step === 2) {
      if (!formData.site_name) newErrors.site_name = "Site name is required";
      if (formData.site_logo && formData.site_logo.size > 4 * 1024 * 1024)
        newErrors.site_logo = "Logo must be less than 4MB";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleSave = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "site_logo" && formData[key]) {
          formDataToSend.append("files", formData[key]); // Backend expects 'files'
        } else if (formData[key] !== undefined && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      await toast.promise(
        put(`/tenants/${tenantId}/settings`, formDataToSend, true),
        {
          loading: "Updating settings...",
          success: "Settings updated successfully!",
          error: (err) => err.response?.data?.message || "Failed to update settings.",
        }
      );

      await fetchSettings();
      resetForm();
    } catch (err) {
      console.error("Error updating settings:", err.response?.data || err.message);
      setErrors({ submit: err.response?.data?.message || "Failed to update settings" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setStep(0);
    setShowForm(false);
    setErrors({});
  };

  const handleEdit = () => {
    setFormData({ ...settings, site_logo: null });
    setShowForm(true);
    setStep(0);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0: // Domain Details
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain Type <span className="text-red-500">*</span>
              </label>
              <select
                name="domain_type"
                value={formData.domain_type || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                disabled={isSubmitting}
              >
                <option value="">Select Domain Type</option>
                <option value="sub_domain">Sub Domain</option>
                <option value="primary_domain">Primary Domain</option>
              </select>
              {errors.domain_type && <p className="text-red-500 text-xs mt-1">{errors.domain_type}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Domain Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="primary_domain_name"
                value={formData.primary_domain_name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                placeholder="e.g., livegrandlife.com"
                disabled={isSubmitting}
              />
              {errors.primary_domain_name && (
                <p className="text-red-500 text-xs mt-1">{errors.primary_domain_name}</p>
              )}
            </div>
            {formData.domain_type === "sub_domain" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Domain <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sub_domain"
                  value={formData.sub_domain || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                  placeholder="e.g., gdl"
                  disabled={isSubmitting}
                />
                {errors.sub_domain && <p className="text-red-500 text-xs mt-1">{errors.sub_domain}</p>}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Website Link</label>
              <input
                type="text"
                name="website_link"
                value={
                  formData.website_link ||
                  (formData.domain_type === "sub_domain" && formData.sub_domain
                    ? `https://${formData.sub_domain}.${formData.primary_domain_name || ""}`
                    : `https://${formData.primary_domain_name || ""}`)
                }
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-100 text-sm disabled:opacity-50"
                placeholder="e.g., https://gdl.livegrandlife.com"
                disabled
              />
            </div>
          </div>
        );
      case 1: // Agent Basic Information
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">Note: This will be published on the Contact page of your website.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                  placeholder="e.g., John"
                  disabled={isSubmitting}
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                  placeholder="e.g., Doe"
                  disabled={isSubmitting}
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email_id"
                value={formData.email_id || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                placeholder="e.g., john@example.com"
                disabled={isSubmitting}
              />
              {errors.email_id && <p className="text-red-500 text-xs mt-1">{errors.email_id}</p>}
              <p className="text-sm text-gray-500 mt-1">You will receive all emails at this address.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                placeholder="e.g., +1234567890"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                placeholder="e.g., 123 Main St"
                disabled={isSubmitting}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skype</label>
              <input
                type="text"
                name="skype"
                value={formData.skype || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                placeholder="e.g., skype_id"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish on Site</label>
              <input
                type="checkbox"
                name="publish_on_site"
                checked={formData.publish_on_site || false}
                onChange={handleChange}
                className="h-4 w-4 text-gray-900 focus:ring-gray-300 border-gray-200 rounded disabled:opacity-50"
                disabled={isSubmitting}
              />
            </div>
          </div>
        );
      case 2: // Site Identity
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Note: Use a logo with your site name. PNG or JPG only. Recommended size: 170px x 65px, max 4MB.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="site_name"
                value={formData.site_name || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                placeholder="e.g., My Site"
                disabled={isSubmitting}
              />
              {errors.site_name && <p className="text-red-500 text-xs mt-1">{errors.site_name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Logo</label>
              <input
                type="file"
                name="site_logo"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200 disabled:opacity-50"
                disabled={isSubmitting}
              />
              {formData.site_logo && (
                <div className="mt-2 relative">
                  <img
                    src={URL.createObjectURL(formData.site_logo)}
                    alt="Preview"
                    className="h-16 w-auto object-contain rounded-md shadow-sm"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, site_logo: null })}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              {errors.site_logo && <p className="text-red-500 text-xs mt-1">{errors.site_logo}</p>}
              {settings?.site_logo_url && !formData.site_logo && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Current Logo:</p>
                  <img
                    src={settings.site_logo_url}
                    alt="Current Logo"
                    className="h-16 w-auto object-contain rounded-md shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 3: // Distributor Details
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NHT Website Link</label>
              <input
                type="text"
                name="nht_website_link"
                value={formData.nht_website_link || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                placeholder="e.g., http://www.nhtglobal.com/healthzilla"
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500 mt-1">
                Updates your store and joining link for visitors.{" "}
                <a href="#" className="text-gray-900 hover:underline">
                  How to find link
                </a>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NHT Store Link</label>
              <input
                type="text"
                name="nht_store_link"
                value={formData.nht_store_link || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                placeholder="e.g., https://nht-office.nhtglobal.com/..."
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500 mt-1">
                Takes visitors to the NHT Global Store.{" "}
                <a href="#" className="text-gray-900 hover:underline">
                  How to find link
                </a>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NHT Joining Link</label>
              <input
                type="text"
                name="nht_joining_link"
                value={formData.nht_joining_link || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-sm disabled:opacity-50"
                placeholder="e.g., https://nht-office.nhtglobal.com/..."
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500 mt-1">
                Takes visitors to the NHT Global New Member Joining Link.{" "}
                <a href="#" className="text-gray-900 hover:underline">
                  How to find link
                </a>
              </p>
            </div>
          </div>
        );
      case 4: // Update
        return (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg">
              Review your details and click "Update" to save changes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium text-gray-700 capitalize">{key.replace("_", " ")}:</span>{" "}
                  {key === "site_logo" && value ? value.name : value || "N/A"}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!tenantId) {
    return <div className="container mx-auto p-6 text-gray-700">Please log in to view settings.</div>;
  }

  return (
    <div className="container ">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Loading State */}
      {isLoading && !settings && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-900 mx-auto"></div>
          <span className="text-gray-500 text-lg mt-2 block animate-pulse">Loading settings...</span>
        </div>
      )}

      {/* Current Settings */}
      {!showForm && settings && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <div className="p-6 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Current Settings</h2>
            <button
              onClick={handleEdit}
              className="bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-300 shadow-md"
              disabled={isLoading}
            >
              <Edit size={18} /> Edit Settings
            </button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Site Name", value: settings.site_name },
              { label: "Website Link", value: settings.website_link },
              { label: "Email", value: settings.email_id },
              { label: "Mobile", value: settings.mobile || "N/A" },
              { label: "Address", value: settings.address },
              { label: "Publish on Site", value: settings.publish_on_site ? "Yes" : "No" },
              { label: "Skype", value: settings.skype || "N/A" },
              { label: "NHT Website Link", value: settings.nht_website_link || "N/A" },
              { label: "NHT Store Link", value: settings.nht_store_link || "N/A" },
              { label: "NHT Joining Link", value: settings.nht_joining_link || "N/A" },
            ].map((item, idx) => (
              <div key={idx}>
                <p className="font-medium text-gray-700 text-sm uppercase">{item.label}</p>
                <p className="text-gray-800 mt-1 break-all">{item.value}</p>
              </div>
            ))}
            <div>
              <p className="font-medium text-gray-700 text-sm uppercase">Site Logo</p>
              {settings.site_logo_url ? (
                <img
                  src={settings.site_logo_url}
                  alt="Site Logo"
                  className="h-16 w-auto object-contain rounded-md mt-1 shadow-sm"
                />
              ) : (
                <p className="text-gray-800 mt-1">N/A</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Step Form */}
      {showForm && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Edit Tenant Settings</h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 hover:scale-105 transition-all duration-200"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-6">
              {steps.map((stepTitle, index) => (
                <div key={index} className="flex-1 text-center">
                  <div
                    className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      index <= step
                        ? "bg-gradient-to-r from-gray-800 to-black text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-xs mt-2 text-gray-700">{stepTitle}</p>
                </div>
              ))}
            </div>
            <Progress value={(step / (steps.length - 1)) * 100} className="w-full mb-6" />

            {/* Step Content */}
            {renderStepContent()}

            {/* Error Messages */}
            {errors.submit && (
              <p className="text-red-500 text-center mt-4 bg-red-50 p-2 rounded-md">{errors.submit}</p>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={resetForm}
                className="px-5 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="px-5 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm disabled:opacity-50"
                  disabled={step === 0 || isSubmitting}
                >
                  Previous
                </button>
                <button
                  onClick={step === steps.length - 1 ? handleSave : nextStep}
                  className="px-5 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  )}
                  {isSubmitting ? "Saving..." : step === steps.length - 1 ? "Update" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantSettings;