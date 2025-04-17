import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import useTenantApi from "@/hooks/useTenantApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const { getAll, loading, error } = useTenantApi();
  const [userStats, setUserStats] = useState({ total: 0, active: 0, inactive: 0 });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await getAll("/admin/tenant-users");
        console.log("User stats response:", response);
        if (response && response.userStats) {
          setUserStats(response.userStats);
        }
      } catch (err) {
        console.error("Error fetching user stats:", err);
        // Only redirect for explicit auth errors
        if (
          err.response?.status === 401 &&
          (err.message === "No authentication token found" ||
            err.response?.data?.message === "Admin privileges required")
        ) {
          console.log("Token expired or unauthorized, redirecting to superadmin login");
          localStorage.clear();
          navigate("/superadmin-login", { replace: true });
        }
      }
    };

    fetchUserStats();
  }, [getAll, navigate]);

  const chartData = [
    { name: "Total Users", value: userStats.total, fill: "#D1D5DB" },
    { name: "Active Users", value: userStats.active, fill: "#000000" },
    { name: "Inactive Users", value: userStats.inactive, fill: "#6B7280" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-black">{loading ? "..." : userStats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-black">{loading ? "..." : userStats.active}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Inactive Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-black">{loading ? "..." : userStats.inactive}</p>
          </CardContent>
        </Card>
      </div>

      {/* User Stats Bar Chart */}
      <Card className="bg-white border-gray-200 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">User Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64">
            {loading ? (
              <p className="text-center text-gray-500">Loading chart...</p>
            ) : error ? (
              <p className="text-center text-red-500">Failed to load stats. Please try again.</p>
            ) : (
              <BarChart width={600} height={250} data={chartData} className="mx-auto">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#374151" />
                <YAxis stroke="#374151" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2A44", color: "#FFFFFF", border: "none" }}
                />
                <Legend />
                <Bar dataKey="value" />
              </BarChart>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}