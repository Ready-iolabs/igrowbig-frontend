import React, { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import useTenantApi from "@/hooks/useTenantApi";

const NewsletterAdmin = () => {
  const { data, loading, error, getAll } = useTenantApi();

  useEffect(() => {
    getAll("/newsletters/subscribers");
  }, [getAll]);

  const subscribers = data?.subscribers || [];

  const handleRefresh = async () => {
    try {
      await toast.promise(getAll("/newsletters/subscribers"), {
        loading: "Refreshing subscribers...",
        success: "Subscribers list updated",
        error: (err) => err.message || "Failed to refresh subscribers",
      });
    } catch (err) {
      // Handled by toast
    }
  };

  return (
    <div className="m-4 border-2 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-black p-6 text-white">
        <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
        <p className="text-gray-300 mt-1">View all active subscribers</p>
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
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Subscriber List</h3>
            <button
              onClick={handleRefresh}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <svg
                className="animate-spin h-12 w-12 text-gray-800 mb-4"
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
              <p className="text-gray-700 font-medium">Loading subscribers...</p>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg
                className="mx-auto h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="mt-2 text-sm font-medium">No subscribers found</p>
              <p className="text-xs">Start by promoting your newsletter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      ID
                    </th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Email
                    </th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="p-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Subscribed At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="p-2 text-xs text-gray-800">{sub.id}</td>
                      <td className="p-2 text-xs text-gray-800 font-medium">
                        {sub.email}
                      </td>
                      <td className="p-2 text-xs text-gray-800">
                        {sub.name || "N/A"}
                      </td>
                      <td className="p-2">
                        <span
                          className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
                            sub.status === "active"
                              ? "bg-gray-800 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-2 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(sub.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="h-5 w-5 text-gray-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Only active subscribers are shown
        </div>
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

export default NewsletterAdmin;