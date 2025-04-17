import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getTemplates = () => api.get('/templates');
export const getTemplateById = (id) => api.get(`/templates/${id}`);
export const modifyTemplate = (id, data) => api.post(`/templates/${id}/modify`, data);
export const generateTemplate = (id) => api.get(`/templates/${id}/generate`, { responseType: 'blob' });

export default api;