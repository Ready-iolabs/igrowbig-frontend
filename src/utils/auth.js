import { useNavigate } from 'react-router-dom';

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => localStorage.setItem('token', token);

export const getTenantId = () => localStorage.getItem('tenant_id');

export const setTenantId = (tenantId) => localStorage.setItem('tenant_id', tenantId);

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tenant_id');
};

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  const handleUnauthorized = (error) => {
    if (error?.response?.status === 401) {
      clearAuth();
      navigate('/backoffice-login');
    }
  };

  return { handleUnauthorized };
};