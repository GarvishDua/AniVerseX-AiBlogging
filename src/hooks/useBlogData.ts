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

  // Fetch blog data from Supabase
  const fetchBlogData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching blog data from Supabase...');
      const data = await executeApiCall(() => apiService.getBlogDataFromAPI());
      if (data) {
        setBlogData(data);
        console.log('✅ Supabase fetch successful');
        return;
      }
    } catch (err) {
      console.error('❌ Failed to fetch blog data:', err);
      setError('Failed to fetch blog data');
      setBlogData({
        posts: [],
        categories: [
          { name: 'Anime', color: 'primary', count: 0 },
          { name: 'Manga', color: 'accent', count: 0 },
          { name: 'Marvel', color: 'secondary', count: 0 }
        ]
      });
    }
  }, [executeApiCall]);

  // Refresh data function
  const refreshData = useCallback(() => {
    fetchBlogData();
  }, [fetchBlogData]);

  // Create a new blog post
  const createPost = useCallback(async (postData: {
    title: string;
    content: string;
    author?: string;
    tags?: string[];
    category?: string;
    description?: string;
    thumbnail?: string;
  }) => {
    setLoading(true);
    try {
      const result = await apiService.createBlogPost(postData);
      if (result.success) {
        await refreshData();
        return result;
      }
      throw new Error(result.error || 'Failed to create post');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a blog post
  const deletePost = useCallback(async (postId: string) => {
    setLoading(true);
    try {
      const result = await apiService.deleteBlogPost(postId);
      if (result.success) {
        await refreshData();
        return result;
      }
      throw new Error(result.error || 'Failed to delete post');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
    reset,
    createPost,
    deletePost
  };
};
