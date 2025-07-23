import { useState, useEffect } from "react";

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishDate: string;
  views: string;
  tags: string[];
  content: string;
  featured: boolean;
}

interface Category {
  name: string;
  count: number;
  color: "primary" | "accent" | "secondary";
}

interface BlogData {
  posts: Post[];
  categories: Category[];
}

export const useBlogData = () => {
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        // Use static JSON file for both development and production
        const endpoint = process.env.NODE_ENV === 'production' 
          ? '/api/blogs.json' 
          : '/blogs.json';
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch blog data');
        }
        const data = await response.json();
        setBlogData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  const getPostsByCategory = (categoryName: string) => {
    if (!blogData) return [];
    return blogData.posts.filter(post => post.category === categoryName);
  };

  const getFeaturedPosts = () => {
    if (!blogData) return [];
    return blogData.posts.filter(post => post.featured);
  };

  const getRecentPosts = (limit: number = 5) => {
    if (!blogData) return [];
    return blogData.posts.slice(0, limit);
  };

  const createPost = async (postData: Partial<Post>) => {
    try {
      const endpoint = process.env.NODE_ENV === 'production' 
        ? '/api/blogs-fallback' 
        : 'http://localhost:3001/api/blogs';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const result = await response.json();
      
      // Refresh blog data
      const dataResponse = await fetch(process.env.NODE_ENV === 'production' ? '/api/blogs.json' : '/blogs.json');
      if (dataResponse.ok) {
        const updatedData = await dataResponse.json();
        setBlogData(updatedData);
      }

      return result;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const endpoint = process.env.NODE_ENV === 'production' 
        ? `/api/blogs-fallback?id=${postId}` 
        : `http://localhost:3001/api/blogs/${postId}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Refresh blog data
      const dataEndpoint = process.env.NODE_ENV === 'production' 
        ? '/api/blogs.json' 
        : '/blogs.json';
        
      const dataResponse = await fetch(dataEndpoint);
      if (dataResponse.ok) {
        const updatedData = await dataResponse.json();
        setBlogData(updatedData);
      }

      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete post');
    }
  };

  return {
    blogData,
    loading,
    error,
    getPostsByCategory,
    getFeaturedPosts,
    getRecentPosts,
    createPost,
    deletePost
  };
};