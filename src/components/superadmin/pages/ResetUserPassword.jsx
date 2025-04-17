import React, { useState, useEffect } from "react";
import useTenantApi from "@/hooks/useTenantApi";
import { motion } from "framer-motion"; // For animations

const ResetUserPassword = () => {
    const [userId, setUserId] = useState("");
    const [tenantEmail, setTenantEmail] = useState("");
    const [tenants, setTenants] = useState([]);
    const [userStats, setUserStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
    const { data, loading, error, post, getAll } = useTenantApi();

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await getAll("/admin/tenant-users");
                if (response) {
                    setTenants(response.users || []);
                    setUserStats(response.userStats || { total: 0, active: 0, inactive: 0 });
                }
            } catch (err) {
                console.error("Failed to fetch tenants:", err);
            }
        };
        fetchTenants();
    }, [getAll]);

    const handleRowClick = (tenant) => {
        // Toggle form visibility and set/reset user
        if (userId === tenant.id.toString() && showPasswordForm) {
            // Clicking same user when form is visible - hide form
            setShowPasswordForm(false);
            setUserId("");
            setTenantEmail("");
        } else {
            // Clicking new user or when form is hidden - show form
            setUserId(tenant.id.toString());
            setTenantEmail(tenant.email);
            setShowPasswordForm(true);
            setNewPassword(""); // Clear previous password input
            setConfirmPassword(""); // Clear confirm password
            setPasswordError(""); // Clear any errors
        }
    };

    const validatePasswords = () => {
        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            return false;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const generateSecurePassword = () => {
        setIsGeneratingPassword(true);
        
        // Generate a secure password (12-16 chars with letters, numbers, symbols)
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        const length = Math.floor(Math.random() * 5) + 12; // 12-16 characters
        let password = "";
        
        // Ensure at least one of each type
        password += chars.substr(Math.floor(Math.random() * 26), 1); // Uppercase
        password += chars.substr(26 + Math.floor(Math.random() * 26), 1); // Lowercase
        password += chars.substr(52 + Math.floor(Math.random() * 10), 1); // Number
        password += chars.substr(62 + Math.floor(Math.random() * 14), 1); // Symbol
        
        // Fill the rest randomly
        for (let i = 4; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Shuffle the password
        password = password.split('').sort(() => 0.5 - Math.random()).join('');
        
        setNewPassword(password);
        setConfirmPassword(password);
        setPasswordError("");
        
        setTimeout(() => {
            setIsGeneratingPassword(false);
        }, 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePasswords()) {
            return;
        }
        
        try {
            await post("/admin/reset-user-password", {
                user_id: userId,
                new_password: newPassword,
                tenant_email: tenantEmail
            });

            // Refresh the list after successful reset
            const response = await getAll("/admin/tenant-users");
            if (response) {
                setTenants(response.users || []);
                setUserStats(response.userStats || { total: 0, active: 0, inactive: 0 });
            }

            // Reset form but keep showing it
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError("");
            
            // Show success message
            alert("Password reset successful");
        } catch (err) {
            console.error("Password reset failed:", err);
            setPasswordError("Password reset failed. Please try again.");
        }
    };

    const selectedTenant = tenants.find(t => t.id.toString() === userId);

    return (
        <div className="m-4 border-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-black p-6 text-white">
                <h2 className="text-2xl font-bold">Reset Tenant Password</h2>
                <p className="text-gray-300 mt-1">Select a user from the table below to reset their password</p>
            </div>
            
            {/* User Stats */}
            <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{userStats.total}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Active</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{userStats.active}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Inactive</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{userStats.inactive}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="p-6">
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tenants.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        {loading ? "Loading users..." : "No users found"}
                                    </td>
                                </tr>
                            ) : (
                                tenants.map((tenant) => (
                                    <motion.tr
                                        key={tenant.id}
                                        onClick={() => handleRowClick(tenant)}
                                        className={`cursor-pointer transition-colors ${
                                            userId === tenant.id.toString() 
                                                ? "bg-gray-100" 
                                                : "hover:bg-gray-50"
                                        }`}
                                        whileHover={{ scale: 1.005 }}
                                        whileTap={{ scale: 0.995 }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium mr-3">
                                                    {tenant.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{tenant.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-500 capitalize">{tenant.plan}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                tenant.status === "active"
                                                    ? "bg-gray-100 text-gray-800"
                                                    : "bg-gray-200 text-gray-800"
                                            }`}>
                                                {tenant.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(tenant.createdAt).toLocaleDateString()}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Password Reset Form */}
            {showPasswordForm && (
                <div className="p-6 border-t border-gray-200">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Tenant</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{selectedTenant?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{tenantEmail}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className="font-medium capitalize">{selectedTenant?.status}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                    <button
                                        type="button"
                                        onClick={generateSecurePassword}
                                        className="text-xs text-gray-600 hover:text-black transition-colors"
                                    >
                                        {isGeneratingPassword ? "Generating..." : "Generate Secure Password"}
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                        placeholder="Enter new password (min 8 chars)"
                                        required
                                        minLength="8"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>
                            </div>

                            {passwordError && (
                                <div className="bg-gray-100 border-l-4 border-gray-800 text-gray-800 p-4 rounded">
                                    <div className="flex">
                                        <svg className="h-5 w-5 text-gray-800 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span>{passwordError}</span>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2">
                                <p className="text-sm text-gray-500 mb-4">
                                    <svg className="h-5 w-5 text-gray-400 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    The user will receive an email with their new password and instructions to log in.
                                </p>
                            </div>

                            <div className="flex space-x-4">
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 py-3 text-white rounded-lg font-medium transition-all flex items-center justify-center ${
                                        loading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-black hover:bg-gray-900 cursor-pointer shadow-md hover:shadow-lg"
                                    }`}
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.98 }}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Resetting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                            Reset Password
                                        </>
                                    )}
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setUserId("");
                                        setTenantEmail("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                        setPasswordError("");
                                    }}
                                    className="flex-1 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-all flex items-center justify-center"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResetUserPassword;
