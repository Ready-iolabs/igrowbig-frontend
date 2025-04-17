import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import useTenantApi from "@/hooks/useTenantApi";

const SendTenantNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: sendData, loading: sendLoading, error: sendError, post } = useTenantApi();
  const { data: messagesData, loading: messagesLoading, error: messagesError, getAll } = useTenantApi();

  useEffect(() => {
    getAll("/admin/messages");
  }, [getAll]);

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!message.trim()) errors.message = "Message is required";
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
        post("/admin/notifications", { title, message }),
        {
          loading: "Sending notification...",
          success: (response) => {
            setTitle("");
            setMessage("");
            setFormErrors({});
            getAll("/admin/messages");
            return response.message || "Notification sent successfully!";
          },
          error: (err) => {
            return err.response?.data?.message || "Failed to send notification";
          },
        }
      );
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const messages = messagesData?.messages || [];

  return (
    <div className="m-4 border-2 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-black p-6 text-white">
        <h2 className="text-2xl font-bold">Send Tenant Notification</h2>
        <p className="text-gray-300 mt-1">Broadcast a message to all tenants</p>
      </div>

      {sendError && (
        <div className="mx-6 mt-6 p-4 bg-gray-100 border-l-4 border-gray-800 text-gray-800 rounded-md flex items-start">
          <svg className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{sendError.message}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border ${formErrors.title ? 'border-gray-800 bg-gray-100' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors`}
                  placeholder="Enter notification title"
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.title && (
                <p className="mt-1 text-sm text-gray-800">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border ${formErrors.message ? 'border-gray-800 bg-gray-100' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors h-32 resize-y`}
                  placeholder="Enter notification message"
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.message && (
                <p className="mt-1 text-sm text-gray-800">{formErrors.message}</p>
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
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Send Notification
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Messages Section */}
        <div className="lg:col-span-2">
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Message History</h3>
              <button
                onClick={() => getAll("/admin/messages")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                Refresh
              </button>
            </div>

            {messagesLoading ? (
              <div className="flex flex-col justify-center items-center py-12">
                <svg className="animate-spin h-12 w-12 text-gray-800 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-700 font-medium">Loading messages...</p>
              </div>
            ) : messagesError ? (
              <div className="bg-gray-100 border-l-4 border-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-800">{messagesError.message}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="mt-2 text-sm font-medium">No messages found</p>
                <p className="text-xs">Start by sending your first notification.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Message</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {messages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-gray-50">
                        <td className="p-2 text-xs text-gray-800">{msg.id}</td>
                        <td className="p-2 text-xs text-gray-800 font-medium">{msg.title}</td>
                        <td className="p-2 text-xs text-gray-800">
                          {msg.message.length > 50 ? msg.message.substring(0, 50) + '...' : msg.message}
                        </td>
                        <td className="p-2">
                          <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium 
                            ${msg.status === 'sent' ? 'bg-gray-800 text-white' : 
                              msg.status === 'draft' ? 'bg-gray-200 text-gray-800' : 
                              msg.status === 'failed' ? 'bg-gray-300 text-black' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {msg.status}
                          </span>
                        </td>
                        <td className="p-2 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Notifications will be sent to all active tenants
        </div>
      </div>

      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            iconTheme: { primary: '#ffffff', secondary: '#000000' },
          },
          error: {
            iconTheme: { primary: '#ffffff', secondary: '#000000' },
          },
        }}
      />
    </div>
  );
};

export default SendTenantNotification;