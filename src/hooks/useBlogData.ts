import { useState, useEffect, useCallback } from 'react';
import { apiService, type ApiResponse, type BlogPost, type Category, type BlogData } from '../services/apiService';

export const useBlogData = () => {
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get posts by category
  const getPostsByCategory = useCallback((categoryName: string): BlogPost[] => {
    if (!blogData) return [];
    return blogData.posts.filter(post => 
      post.category.toLowerCase() === categoryName.toLowerCase()
    );
  }, [blogData]);

  // Helper function to transform raw data to expected structure
  const transformBlogData = useCallback((rawData: any): BlogData => {
    const posts: BlogPost[] = rawData.posts || [];
    
    // Create categories array from posts with proper color mapping
    const categoryMap: { [key: string]: { color: 'primary' | 'accent' | 'secondary'; count: number } } = {
      'anime': { color: 'primary', count: 0 },
      'manga': { color: 'accent', count: 0 },
      'marvel': { color: 'secondary', count: 0 }
    };

    // Count posts by category
    posts.forEach(post => {
      const category = post.category.toLowerCase();
      if (categoryMap[category]) {
        categoryMap[category].count++;
      }
    });

    // Convert to categories array
    const categories: Category[] = Object.entries(categoryMap).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      color: data.color,
      count: data.count
    }));

    return { posts, categories };
  }, []);

  // Enhanced API execution with error handling
  const executeApiCall = useCallback(async (
    apiCall: () => Promise<ApiResponse<BlogData>>
  ): Promise<BlogData | null> => {
    try {
      const result = await apiCall();
      
      if (result.success && result.data) {
        const transformedData = transformBlogData(result.data);
        return transformedData;
      } else {
        throw new Error(result.error || 'API call failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('API call failed:', errorMessage);
      throw err;
    }
  }, [transformBlogData]);

  // Fetch blog data with multiple fallbacks
  const fetchBlogData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Strategy 1: Try serverless API first
      console.log('Attempting serverless API...');
      const serverlessData = await executeApiCall(() => apiService.getBlogDataFromAPI());
      if (serverlessData) {
        setBlogData(serverlessData);
        console.log('✅ Serverless API successful');
        return;
      }
    } catch (err) {
      console.warn('❌ Serverless API failed:', err);
    }

    try {
      // Strategy 2: Fallback to GitHub API
      console.log('Attempting GitHub API fallback...');
      const githubData = await executeApiCall(() => apiService.getBlogDataFromGitHub());
      if (githubData) {
        setBlogData(githubData);
        console.log('✅ GitHub API fallback successful');
        return;
      }
    } catch (err) {
      console.warn('❌ GitHub API fallback failed:', err);
    }

    try {
      // Strategy 3: Final fallback to static file
      console.log('Attempting static file fallback...');
      const staticData = await executeApiCall(() => apiService.getBlogDataFromStatic());
      if (staticData) {
        setBlogData(staticData);
        console.log('✅ Static file fallback successful');
        return;
      }
    } catch (err) {
      console.warn('❌ Static file fallback failed:', err);
    }

    // If all strategies fail, set empty data and error
    console.error('❌ All data fetching strategies failed');
    setError('Failed to fetch blog data from all sources');
    setBlogData({
      posts: [],
      categories: [
        { name: 'Anime', color: 'primary', count: 0 },
        { name: 'Manga', color: 'accent', count: 0 },
        { name: 'Marvel', color: 'secondary', count: 0 }
      ]
    });
  }, [executeApiCall]);

  // Refresh data function
  const refreshData = useCallback(() => {
    fetchBlogData();
  }, [fetchBlogData]);

  // Reset function
  const reset = useCallback(() => {
    setBlogData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBlogData().finally(() => setLoading(false));
  }, [fetchBlogData]);

  return { 
    blogData, 
    loading, 
    error, 
    getPostsByCategory, 
    refreshData, 
    reset 
  };
};
