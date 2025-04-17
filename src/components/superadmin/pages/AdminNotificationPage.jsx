import React, { useState } from "react";
import axios from "axios";

const AdminNotificationPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("adminToken"); // Admin JWT token

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/admin/notifications",
        { title, message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponse(res.data);
      setTitle("");
      setMessage("");
    } catch (err) {
      setError(err.response?.data || { message: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Send Notification to Tenants
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-32 resize-y"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-md ${
            loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          } transition-colors`}
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          {response.message} (ID: {response.notification_id}, Sent to: {response.recipients_count} tenants)
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          Error: {error.error} - {error.message}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationPage;