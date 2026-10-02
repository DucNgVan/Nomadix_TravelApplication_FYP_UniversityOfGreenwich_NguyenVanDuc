import axios from 'axios';
import { NativeModules } from 'react-native';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const clearAuthToken = () => {
  authToken = null;
};

export const resolveApiBaseUrl = (
  envUrl = process.env.EXPO_PUBLIC_API_URL,
  scriptURL = (typeof NativeModules !== 'undefined' ? NativeModules?.SourceCode?.scriptURL : null)
) => {
  // If explicitly overridden to a custom remote host (e.g. production/staging)
  if (envUrl && !envUrl.includes('192.168.')) {
    return envUrl;
  }

  // Auto-detect Metro server IP from scriptURL (dynamic across any Wi-Fi/LAN change)
  if (scriptURL) {
    const match = scriptURL.match(/^https?:\/\/([^/:]+)/);
    if (match && match[1] && match[1] !== 'localhost' && match[1] !== '127.0.0.1') {
      return `http://${match[1]}:5001/api/v1`;
    }
  }

  if (envUrl) {
    return envUrl;
  }

  return 'http://192.168.1.26:5001/api/v1';
};

const DEFAULT_BASE_URL = resolveApiBaseUrl();

const apiClient = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Injects Bearer token when available
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unwraps standard backend { success: true, data } envelope
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const errorPayload = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.message || 'Network request failed',
    };

    const formattedError = {
      status: error.response?.status || 500,
      code: errorPayload.code || 'UNKNOWN_ERROR',
      message: errorPayload.message || 'An unexpected error occurred',
      details: errorPayload.details || [],
    };

    return Promise.reject(formattedError);
  }
);

export default apiClient;
