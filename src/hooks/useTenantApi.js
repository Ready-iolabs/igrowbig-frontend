// // hooks/useTenantApi.jsx
// import { useState, useCallback } from "react";
// import axios from "axios";

// // Get the domain and decide whether to use HTTP or HTTPS
// const getBaseUrl = () => {
//   let domain = 'begrat.com'; // Default domain name for production

//   // Check if the app is running in staging environment
//   if (window.location.hostname === "stage.begrat.com") {
//     domain = 'stage.begrat.com'; // Use the staging domain
//   }

//   if (process.env.NODE_ENV === "production") {
//     // For production, check if SSL is installed
//     return window.location.protocol === "https:" 
//       ? `https://${domain}/api` // Use HTTPS if SSL is installed
//       : `http://${domain}/api`;  // Fallback to HTTP if no SSL is installed
//   } else {
//     // For development, use local server
//     return "http://localhost:3001/api";
//   }
// };

// const BASE_URL = getBaseUrl();

// const apiClient = axios.create({
//   baseURL: BASE_URL,
// });

// // Add response interceptor
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const isLoginRequest =
//       error.config.url.includes("/admin/login") ||
//       error.config.url.includes("/users/login") ||
//       error.config.url.includes("/users/signup");

//     if (isLoginRequest) {
//       return Promise.reject(error);
//     }

//     const isAdminRoute = window.location.pathname.startsWith("/admin");
//     const redirectPath = isAdminRoute ? "/superadmin-login" : "/backoffice-login";

//     // Only redirect for critical auth errors
//     if (
//       error.response?.status === 401 &&
//       (error.response?.data?.message === "No authentication token found" ||
//         error.response?.data?.message === "Admin privileges required" ||
//         error.response?.data?.message?.includes("expired"))
//     ) {
//       console.log("Token expired or unauthorized, redirecting to:", redirectPath);
//       localStorage.clear();
//       window.location.href = `http://localhost:5173${redirectPath}`;
//     }

//     return Promise.reject(error);
//   }
// );

// const useTenantApi = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const getToken = () => localStorage.getItem("token");

//   const apiRequest = useCallback(
//     async (method, endpoint, payload = null, isFormData = false) => {
//       setLoading(true);
//       setError(null);

//       // Updated public endpoints to include /site/*
//       const publicEndpoints = [
//         "/users/signup",
//         "/users/login",
//         "/admin/login",
//         // Allow all /site/* routes to be public
//       ];

//       const token = getToken();

//       // Skip token check for /site/* endpoints
//       if (!token && !publicEndpoints.includes(endpoint) && !endpoint.startsWith("/site/")) {
//         const authError = { message: "No authentication token found" };
//         setError(authError);
//         setLoading(false);
//         return Promise.reject(authError);
//       }

//       try {
//         const headers = {};
//         if (token && !endpoint.startsWith("/site/")) {
//           headers.Authorization = `Bearer ${token}`;
//         }
//         if (!isFormData) {
//           headers["Content-Type"] = "application/json";
//         }

//         const config = {
//           method,
//           url: endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`,
//           headers,
//           data: isFormData ? payload : payload ? JSON.stringify(payload) : undefined,
//         };

//         console.log(`API Request: ${method} ${endpoint}`, payload);
//         const response = await apiClient(config);
//         console.log(`API Response: ${method} ${endpoint}`, response.data);

//         setData(response.data);
//         return response.data;
//       } catch (err) {
//         const errorData = err.response?.data || {
//           message: "API request failed",
//           details: err.message,
//         };
//         console.error(`API Error: ${method} ${endpoint}`, errorData);
//         setError(errorData);
//         return Promise.reject(errorData);
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   const getAll = useCallback((endpoint) => apiRequest("get", endpoint), [apiRequest]);
//   const post = useCallback(
//     (endpoint, data, isFormData = false) => apiRequest("post", endpoint, data, isFormData),
//     [apiRequest]
//   );
//   const put = useCallback(
//     (endpoint, data, isFormData = false) => apiRequest("put", endpoint, data, isFormData),
//     [apiRequest]
//   );
//   const del = useCallback((endpoint) => apiRequest("delete", endpoint), [apiRequest]);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   return { data, loading, error, getAll, post, put, del, apiRequest, clearError };
// };

// export default useTenantApi;


import { useState, useCallback } from 'react';
import axios from 'axios';

const getBaseUrl = () => {
  const protocol = window.location.protocol; // http: or https:
  const hostname = window.location.hostname;
  let domain = 'begrat.com';

  // Subdomain or custom domain
  if (hostname !== 'begrat.com' && hostname !== 'www.begrat.com' && !hostname.includes('localhost')) {
    domain = hostname; // e.g., priti.begrat.com or mydomain.com
  } else if (hostname === 'stage.begrat.com') {
    domain = 'stage.begrat.com';
  } else if (hostname.includes('localhost')) {
    return 'http://localhost:3001/api';
  }

  return `${protocol}//${domain}/api`;
};

const BASE_URL = getBaseUrl();

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest =
      error.config.url.includes('/admin/login') ||
      error.config.url.includes('/users/login') ||
      error.config.url.includes('/users/signup');

    if (isLoginRequest) {
      return Promise.reject(error);
    }

    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const redirectPath = isAdminRoute ? '/superadmin-login' : '/backoffice-login';

    if (
      error.response?.status === 401 &&
      (error.response?.data?.message === 'No authentication token found' ||
        error.response?.data?.message === 'Admin privileges required' ||
        error.response?.data?.message?.includes('expired'))
    ) {
      console.log('Token expired or unauthorized, redirecting to:', redirectPath);
      localStorage.clear();
      window.location.href = `${window.location.protocol}//${window.location.hostname}${redirectPath}`;
    }

    return Promise.reject(error);
  }
);

const useTenantApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem('token');

  const apiRequest = useCallback(
    async (method, endpoint, payload = null, isFormData = false) => {
      setLoading(true);
      setError(null);

      const publicEndpoints = ['/users/signup', '/users/login', '/admin/login'];

      const token = getToken();

      if (!token && !publicEndpoints.includes(endpoint) && !endpoint.startsWith('/site/')) {
        const authError = { message: 'No authentication token found' };
        setError(authError);
        setLoading(false);
        return Promise.reject(authError);
      }

      try {
        const headers = {};
        if (token && !endpoint.startsWith('/site/')) {
          headers.Authorization = `Bearer ${token}`;
        }
        if (!isFormData) {
          headers['Content-Type'] = 'application/json';
        }

        const config = {
          method,
          url: endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`,
          headers,
          data: isFormData ? payload : payload ? JSON.stringify(payload) : undefined,
        };

        console.log(`API Request: ${method} ${endpoint}`, payload);
        const response = await apiClient(config);
        console.log(`API Response: ${method} ${endpoint}`, response.data);

        setData(response.data);
        return response.data;
      } catch (err) {
        const errorData = err.response?.data || {
          message: 'API request failed',
          details: err.message,
        };
        console.error(`API Error: ${method} ${endpoint}`, errorData);
        setError(errorData);
        return Promise.reject(errorData);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAll = useCallback((endpoint) => apiRequest('get', endpoint), [apiRequest]);
  const post = useCallback(
    (endpoint, data, isFormData = false) => apiRequest('post', endpoint, data, isFormData),
    [apiRequest]
  );
  const put = useCallback(
    (endpoint, data, isFormData = false) => apiRequest('put', endpoint, data, isFormData),
    [apiRequest]
  );
  const del = useCallback((endpoint) => apiRequest('delete', endpoint), [apiRequest]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { data, loading, error, getAll, post, put, del, apiRequest, clearError };
};

export default useTenantApi;