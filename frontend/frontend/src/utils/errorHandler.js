import { toast } from 'react-hot-toast';

export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  if (error instanceof APIError) {
    switch (error.status) {
      case 400:
        toast.error('Permintaan tidak valid');
        break;
      case 401:
        toast.error('Sesi telah berakhir, silakan login kembali');
        // Redirect to login if needed
        break;
      case 403:
        toast.error('Anda tidak memiliki akses untuk melakukan tindakan ini');
        break;
      case 404:
        toast.error('Data tidak ditemukan');
        break;
      case 422:
        toast.error('Data yang dikirim tidak valid');
        break;
      case 500:
        toast.error('Terjadi kesalahan pada server');
        break;
      default:
        toast.error(error.message || 'Terjadi kesalahan yang tidak diketahui');
    }
  } else if (error.name === 'NetworkError' || !navigator.onLine) {
    toast.error('Koneksi internet bermasalah');
  } else {
    toast.error('Terjadi kesalahan yang tidak diketahui');
  }
};

export const withErrorHandling = (asyncFunction) => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      handleAPIError(error);
      throw error;
    }
  };
};

// Enhanced fetch with error handling
export const apiRequest = async (url, options = {}) => {
  try {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new APIError(data.message || 'Request failed', response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError(
      'Network error or server unreachable',
      0,
      { originalError: error.message }
    );
  }
};

