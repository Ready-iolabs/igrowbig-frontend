import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import useTenantApi from "@/hooks/useTenantApi";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnsubscribe, setIsUnsubscribe] = useState(false);
  const { post, loading, error } = useTenantApi();

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required";
    if (!isUnsubscribe && !name.trim()) errors.name = "Name is required";
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
        post(`/newsletters/${isUnsubscribe ? "unsubscribe" : "subscribe"}`, {
          email,
          name: isUnsubscribe ? undefined : name,
        }),
        {
          loading: isUnsubscribe ? "Unsubscribing..." : "Subscribing...",
          success: (response) => {
            setEmail("");
            setName("");
            setFormErrors({});
            return response.message;
          },
          error: (err) => err.message || "Operation failed",
        }
      );
    } catch (err) {
      // Handled by toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-4 border-2 bg-white rounded-xl shadow-sm overflow-hidden max-w-md mx-auto">
      <div className="bg-black p-6 text-white">
        <h2 className="text-2xl font-bold">
          {isUnsubscribe ? "Unsubscribe" : "Join Our Newsletter"}
        </h2>
        <p className="text-gray-300 mt-1">
          {isUnsubscribe
            ? "Enter your email to unsubscribe"
            : "Stay updated with our latest news"}
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isUnsubscribe && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    formErrors.name ? "border-gray-800 bg-gray-100" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors`}
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.name && (
                <p className="mt-1 text-sm text-gray-800">{formErrors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formErrors.email ? "border-gray-800 bg-gray-100" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors`}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-sm text-gray-800">{formErrors.email}</p>
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
                {isUnsubscribe ? "Unsubscribing..." : "Subscribing..."}
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {isUnsubscribe ? "Unsubscribe" : "Subscribe"}
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsUnsubscribe(!isUnsubscribe)}
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            {isUnsubscribe
              ? "Want to subscribe instead?"
              : "Want to unsubscribe instead?"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-gray-100 border-l-4 border-gray-800 text-gray-800 rounded-md flex items-start">
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

export default NewsletterForm;