import React, { useEffect, useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { theme } from '@/constants/backofficeConfig';
import useTenantApi from '@/hooks/useTenantApi';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ isOpen, toggle, ref }) => {
  const { data, loading, error, getAll } = useTenantApi();
  const [tenantId, setTenantId] = useState(null);

  // Get tenant ID from localStorage when component mounts
  useEffect(() => {
    const storedTenantId = localStorage.getItem('tenant_id');
    if (storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, []);

  // Fetch user data when tenantId is available
  useEffect(() => {
    if (tenantId) {
      getAll(`/users/${tenantId}`); // Using tenant_id as the user ID
    }
  }, [getAll, tenantId]); // Fixed dependency array to use tenantId

  // Get initial for display (first letter of first name)
  const getInitial = () => {
    if (data?.user?.first_name) {
      return data.user.name.charAt(0).toUpperCase();
    }
    return 'A'; // Default fallback
  };

  // Get display name
  const getDisplayName = () => {
    if (data?.user?.first_name && data?.user?.last_name) {
      return `${data.user.first_name} ${data.user.last_name}`;
    }
    return 'Admin'; // Default fallback
  };

  // Get email
  const getEmail = () => {
    return data?.user?.email || 'admin@igrowbig.com';
  };

  const navigate = useNavigate()

  const LogoutController=()=>{
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('token')
    navigate('/backoffice-login')
  }

  // Show loading state if we don't have tenantId yet
  if (!tenantId) {
    return (
      <div className="flex items-center gap-2 p-1">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold shadow-md"
          style={{ backgroundColor: theme.primary.main }}
        >
          ...
        </div>
        <span className="hidden md:block text-sm font-medium" style={{ color: theme.text.primary }}>
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 p-1 rounded-full hover:bg-opacity-10 transition-colors duration-200 focus:outline-none"
        onClick={toggle}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold shadow-md"
          style={{ backgroundColor: theme.primary.main }}
        >
          {loading ? '...' : getInitial()}
        </div>
        <span className="hidden md:block text-sm font-medium" style={{ color: theme.text.primary }}>
          {loading ? 'Loading...' : getDisplayName()}
        </span>
        <ChevronDown size={16} className="hidden md:block" style={{ color: theme.text.secondary }} />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg overflow-hidden z-20 border animate-fade-in"
          style={{ backgroundColor: theme.secondary.main, borderColor: theme.accent.light }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: theme.accent.light }}>
            <p className="text-sm font-medium" style={{ color: theme.text.primary }}>
              {loading ? 'Loading...' : getDisplayName()}
            </p>
            <p className="text-xs mt-0.5" style={{ color: theme.text.light }}>
              {loading ? '...' : getEmail()}
            </p>
            {error && (
              <p className="text-xs mt-0.5 text-red-500">
                Error: {error.message}
              </p>
            )}
          </div>
          <button
            className="w-full px-4 py-2 text-left text-sm hover:bg-opacity-10 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            style={{ color: theme.text.primary }}
            onClick={LogoutController}
          >
            <LogOut size={16}  />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;