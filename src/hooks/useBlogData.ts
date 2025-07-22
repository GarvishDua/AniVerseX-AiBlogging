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
        const response = await fetch('/blogs.json');
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

  return {
    blogData,
    loading,
    error,
    getPostsByCategory,
    getFeaturedPosts,
    getRecentPosts
  };
};