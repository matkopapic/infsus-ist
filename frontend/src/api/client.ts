import axios, { AxiosError } from 'axios';
import type { ApiError } from './types';

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error('VITE_API_URL nije postavljen. Provjeri .env fajl.');
}

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// hendlanje api i network gresaka
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    if (error.request) {
      const networkError: ApiError = {
        statusCode: 0,
        message: 'Backend nije dostupan. Provjeri da je server pokrenut.',
      };
      return Promise.reject(networkError);
    }
  }
);

export default apiClient;