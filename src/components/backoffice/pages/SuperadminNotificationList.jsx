import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Filter } from "react-feather";
import toast, { Toaster } from "react-hot-toast";
import useTenantApi from "@/hooks/useTenantApi";
import { getToken } from "@/utils/auth";

const SuperadminNotificationList = () => {
  const { getAll, post, loading, error } = useTenantApi();
  const navigate = useNavigate();
  const [tenantId, setTenantId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [markAllLoading, setMarkAllLoading] = useState(false);

  useEffect(() => {
    const storedTenantId = localStorage.getItem("tenant_id");
    const token = getToken();
    if (!token || !storedTenantId) {
      toast.error("Please log in to continue");
      navigate("/backoffice-login");
    } else {
      setTenantId(storedTenantId);
    }
  }, [navigate]);

  useEffect(() => {
    if (tenantId) {
      fetchNotifications();
    }
  }, [tenantId]);

  const fetchNotifications = async () => {
    try {
      const response = await getAll(`/tenants/${tenantId}/notifications`);
      if (response && response.notifications) {
        setNotifications(response.notifications);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Authentication failed. Please log in again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/backoffice-login"), 1000);
      } else {
        toast.error(err.message || "Failed to fetch notifications");
      }
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    const loadingToast = toast.loading("Marking as read...");
    try {
      const response = await post(`/tenants/${tenantId}/notifications/read`, { notificationId });
      if (response) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true, readAt: new Date() } : notif
          )
        );
        toast.success("Notification marked as read!", { id: loadingToast });
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Authentication failed. Please log in again.", { id: loadingToast });
        localStorage.removeItem("token");
        setTimeout(() => navigate("/backoffice-login"), 1000);
      } else {
        toast.error(err.message || "Failed to mark as read", { id: loadingToast });
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((notif) => !notif.isRead);
    if (unreadNotifications.length === 0) {
      toast.success("No unread notifications to mark!");
      return;
    }

    setMarkAllLoading(true);
    const loadingToast = toast.loading("Marking all as read...");
    try {
      const response = await post(`/tenants/${tenantId}/notifications/read-all`);
      if (response) {
        setNotifications((prev) =>
          prev.map((notif) => ({
            ...notif,
            isRead: true,
            readAt: notif.readAt || new Date(),
          }))
        );
        toast.success(`${unreadNotifications.length} notifications marked as read!`, { id: loadingToast });
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("Authentication failed. Please log in again.", { id: loadingToast });
        localStorage.removeItem("token");
        setTimeout(() => navigate("/backoffice-login"), 1000);
      } else {
        toast.error(err.message || "Failed to mark all as read", { id: loadingToast });
      }
    } finally {
      setMarkAllLoading(false);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "read") return notif.isRead;
    if (filter === "unread") return !notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Your Notifications</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 hover:bg-gray-100 transition-all duration-200 shadow-sm"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllLoading}
              className={`flex items-center px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md ${
                markAllLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {markAllLoading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800"></div>
          <p className="mt-2 text-gray-600">Loading notifications...</p>
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
      {!loading && !error && filteredNotifications.length === 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 text-center border border-gray-200">
          <p className="text-gray-600">
            {filter === "all"
              ? "No notifications to display."
              : filter === "read"
              ? "No read notifications."
              : "No unread notifications."}
          </p>
        </div>
      )}

      {/* Notification List */}
      {!loading && !error && filteredNotifications.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Message</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Received</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNotifications.map((notification, index) => (
                <tr
                  key={notification.id}
                  className={`transition-all duration-200 ${
                    notification.isRead ? "bg-gray-50" : "bg-blue-50"
                  } hover:bg-gray-100`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{notification.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{notification.message}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.isRead
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {notification.isRead ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="flex items-center text-gray-600 hover:text-gray-800 transform hover:scale-105 transition-all duration-200"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Mark as Read
                      </button>
                    )}
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

export default SuperadminNotificationList;