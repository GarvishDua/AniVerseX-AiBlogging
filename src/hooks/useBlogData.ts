import { useState, useEffect } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  readTime?: string;
}

export interface BlogData {
  posts: BlogPost[];
  categories: {
    anime: number;
    manga: number;
    marvel: number;
  };
}

export const useBlogData = () => {
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from static file served by Vercel
        const response = await fetch('/api/blogs.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog data: ${response.status} ${response.statusText}`);
        }
        
        const data: BlogData = await response.json();
        setBlogData(data);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blog data');
        
        // Fallback data for development/testing
        setBlogData({
          posts: [],
          categories: { anime: 0, manga: 0, marvel: 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  return { blogData, loading, error };
};
