import axios from 'axios';

// Create configured Axios instance
const API = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getSummary = async (datasetId) => {
  const params = datasetId ? { dataset_id: datasetId } : {};
  const response = await API.get('/analytics/summary', { params });
  return response.data;
};

export const getCategories = async (datasetId) => {
  const params = datasetId ? { dataset_id: datasetId } : {};
  const response = await API.get('/analytics/categories', { params });
  return response.data;
};

export const getMonthly = async (datasetId) => {
  const params = datasetId ? { dataset_id: datasetId } : {};
  const response = await API.get('/analytics/monthly', { params });
  return response.data;
};

export const getPaymentModes = async (datasetId) => {
  const params = datasetId ? { dataset_id: datasetId } : {};
  const response = await API.get('/analytics/payment-modes', { params });
  return response.data;
};

export const getDaily = async (datasetId) => {
  const params = datasetId ? { dataset_id: datasetId } : {};
  const response = await API.get('/analytics/daily', { params });
  return response.data;
};

export const getAnomalies = async (datasetId, contamination = 0.03) => {
  const params = { contamination };
  if (datasetId) params.dataset_id = datasetId;
  const response = await API.get('/anomalies', { params });
  return response.data;
};

export const getPrediction = async (datasetId) => {
  const params = datasetId ? { dataset_id: datasetId } : {};
  const response = await API.get('/prediction', { params });
  return response.data;
};

export const getInsights = async (datasetId) => {
  const params = datasetId ? { dataset_id: datasetId } : {};
  const response = await API.get('/insights', { params });
  return response.data;
};

export const getDatasets = async () => {
  const response = await API.get('/analytics/datasets');
  return response.data;
};

export const getHealth = async () => {
  const response = await API.get('/health');
  return response.data;
};

export default API;
