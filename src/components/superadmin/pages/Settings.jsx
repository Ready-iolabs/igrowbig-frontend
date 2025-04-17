import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import useTenantApi from "@/hooks/useTenantApi";

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { put, loading, error } = useTenantApi();

  const validateForm = () => {
    const errors = {};
    if (!currentPassword) errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your new password";
    if (newPassword && newPassword.length < 6)
      errors.newPassword = "Password must be at least 6 characters long";
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      await toast.promise(
        put("/admin/admin-change-password", { currentPassword, newPassword }),
        {
          loading: "Changing password...",
          success: (response) => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setFormErrors({});
            return response.message;
          },
          error: (err) => err.message || "Failed to change password",
        }
      );
    } catch (err) {
      // Handled by toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-4 border-2 bg-white rounded-xl shadow-sm overflow-hidden ">
      <div className="bg-black p-6 text-white">
        <h2 className="text-2xl font-bold">Account Settings</h2>
        <p className="text-gray-300 mt-1">Change your admin password</p>
      </div>

      {error && (
        <div className="mx-6 mt-6 p-4 bg-gray-100 border-l-4 border-gray-800 text-gray-800 rounded-md flex items-start">
          <svg
            className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        </div>
      )}

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2zM12 11c0 1.104.896 2 2 2s2-.896 2-2-2-4-2-4-2 .896-2 2zM7 19h10v-2H7v2z"
                  />
                </svg>
              </div>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formErrors.currentPassword ? "border-gray-800 bg-gray-100" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors`}
                placeholder="Enter current password"
                disabled={isSubmitting}
              />
            </div>
            {formErrors.currentPassword && (
              <p className="mt-1 text-sm text-gray-800">{formErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2zM12 11c0 1.104.896 2 2 2s2-.896 2-2-2-4-2-4-2 .896-2 2zM7 19h10v-2H7v2z"
                  />
                </svg>
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formErrors.newPassword ? "border-gray-800 bg-gray-100" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors`}
                placeholder="Enter new password"
                disabled={isSubmitting}
              />
            </div>
            {formErrors.newPassword && (
              <p className="mt-1 text-sm text-gray-800">{formErrors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2zM12 11c0 1.104.896 2 2 2s2-.896 2-2-2-4-2-4-2 .896-2 2zM7 19h10v-2H7v2z"
                  />
                </svg>
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formErrors.confirmPassword ? "border-gray-800 bg-gray-100" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors`}
                placeholder="Confirm new password"
                disabled={isSubmitting}
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="mt-1 text-sm text-gray-800">{formErrors.confirmPassword}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900 cursor-pointer text-white shadow-md hover:shadow-lg"
            }`}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Changing...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2zM12 11c0 1.104.896 2 2 2s2-.896 2-2-2-4-2-4-2 .896-2 2zM7 19h10v-2H7v2z"
                  />
                </svg>
                Change Password
              </>
            )}
          </motion.button>
        </form>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            borderRadius: "8px",
            padding: "16px",
          },
          success: {
            iconTheme: { primary: "#ffffff", secondary: "#000000" },
          },
          error: {
            iconTheme: { primary: "#ffffff", secondary: "#000000" },
          },
        }}
      />
    </div>
  );
};

export default Settings;