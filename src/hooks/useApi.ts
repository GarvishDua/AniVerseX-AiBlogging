import { useState, useCallback } from 'react';
import { apiService, type ApiResponse } from '../services/apiService';

// Generic hook for API operations (based on your reference)
export const useApi = <T = any>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T> | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      
      // Enhanced JSON parsing for API responses
      let parsedResult: any = result;
      
      // If result is a string, try to parse it as JSON
      if (typeof result === 'string') {
        try {
          parsedResult = JSON.parse(result);
        } catch (e) {
          console.warn('Failed to parse API response as JSON:', result);
        }
      }
      
      // Handle success property with fallback
      const success = parsedResult?.success !== undefined ? parsedResult.success : true;
      
      if (success) {
        // Try to extract data from various possible structures
        let responseData = null;
        if (parsedResult && typeof parsedResult === 'object') {
          responseData = parsedResult.data || parsedResult.parsedData || parsedResult;
        } else {
          responseData = parsedResult;
        }
        setData(responseData);
      } else {
        const errorMsg = parsedResult?.message || parsedResult?.error || 'An error occurred';
        setError(errorMsg);
      }
      
      return result;
    } catch (err) {
      let errorMessage = 'An error occurred';
      
      // Enhanced error parsing
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Try to parse error message as JSON if it looks like one
        if (err.message.startsWith('{') && err.message.endsWith('}')) {
          try {
            const parsedError = JSON.parse(err.message);
            errorMessage = parsedError.message || parsedError.error || err.message;
          } catch (e) {
            // Keep original message if parsing fails
          }
        }
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

// Hook for blog post creation
export const useBlogPost = () => {
  const { loading, error, execute, reset } = useApi();
  
  const createBlogPost = useCallback(async (blogPost: {
    title: string;
    content: string;
    author?: string;
    tags?: string[];
    category?: string;
  }) => {
    return execute(() => apiService.createBlogPost(blogPost));
  }, [execute]);

  return {
    loading,
    error,
    createBlogPost,
    reset
  };
};

// Hook for server health check
export const useServerHealth = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const { loading, error, execute } = useApi();
  
  const checkHealth = useCallback(async () => {
    const result = await execute(() => apiService.checkHealth());
    setIsHealthy(result?.success || false);
    return result;
  }, [execute]);

  const testConnection = useCallback(async () => {
    setIsHealthy(null);
    try {
      const isConnected = await apiService.testConnection();
      setIsHealthy(isConnected);
      return isConnected;
    } catch (err) {
      setIsHealthy(false);
      return false;
    }
  }, []);

  return {
    isHealthy,
    loading,
    error,
    checkHealth,
    testConnection
  };
};

// Hook for contact form submission (for future use)
export const useContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { loading, error, execute, reset } = useApi();
  
  const submitContactForm = useCallback(async (contactData: {
    name: string;
    email: string;
    message: string;
    subject?: string;
  }) => {
    // This would need a corresponding API endpoint
    const result = await execute(async () => {
      // Placeholder for actual API call
      return { success: true, data: contactData };
    });
    if (result?.success) {
      setIsSubmitted(true);
    }
    return result;
  }, [execute]);

  const resetForm = useCallback(() => {
    reset();
    setIsSubmitted(false);
  }, [reset]);

  return {
    loading,
    error,
    isSubmitted,
    submitContactForm,
    reset: resetForm
  };
};
