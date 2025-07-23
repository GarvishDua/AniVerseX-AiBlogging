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
        console.log('Fetching blog data from GitHub...');
        
        // Fetch directly from GitHub raw content with cache busting
        const timestamp = Date.now();
        const githubUrl = `https://raw.githubusercontent.com/GarvishDua/ink-splash-stories/main/public/api/blogs.json?t=${timestamp}`;
        
        const response = await fetch(githubUrl, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`GitHub fetch failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Successfully fetched blog data:', data.posts?.length, 'posts');
        
        setBlogData(data);
      } catch (err) {
        console.error('Blog data fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blog data from GitHub');
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