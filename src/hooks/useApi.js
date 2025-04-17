import { useState, useCallback } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';

const BASE_URL = 'http://localhost:3001/api';

const useApi = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, endpoint, payload = null, isFormData = false) => {
    setIsLoading(true);
    setError(null);

    const token = getToken();
    if (!token && !['/users/signup', '/users/login'].includes(endpoint)) {
      setError({ message: 'Authentication required' });
      setIsLoading(false);
      throw new Error('No token');
    }

    try {
      const headers = {
        Authorization: token ? `Bearer ${token}` : undefined,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      };

      const config = {
        method,
        url: `${BASE_URL}${endpoint}`,
        headers,
        data: isFormData ? payload : payload ? JSON.stringify(payload) : undefined,
      };

      const response = await axios(config);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Request failed';
      setError({ message: errorMessage, details: err.response?.data?.details });
      throw err; // Let caller handle specific errors (e.g., 401)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAll = useCallback((endpoint) => request('get', endpoint), [request]);
  const post = useCallback((endpoint, data, isFormData) => request('post', endpoint, data, isFormData), [request]);
  const put = useCallback((endpoint, data, isFormData) => request('put', endpoint, data, isFormData), [request]);

  return { data, isLoading, error, getAll, post, put, request };
};

export default useApi;