import { useState, useEffect } from 'react';

export interface BlogPost {
  id: string;
  title: string;
  author?: string;
  date?: string;
  category: string;
  content: string;
  description?: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  readTime?: string;
  publishDate?: string;
  views?: string;
  featured?: boolean;
}

export interface Category {
  name: string;
  color: 'primary' | 'accent' | 'secondary';
  count: number;
}

export interface BlogData {
  posts: BlogPost[];
  categories: Category[];
}

export const useBlogData = () => {
  const [blogData, setBlogData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get posts by category
  const getPostsByCategory = (categoryName: string): BlogPost[] => {
    if (!blogData) return [];
    return blogData.posts.filter(post => 
      post.category.toLowerCase() === categoryName.toLowerCase()
    );
  };

  // Helper function to transform raw data to expected structure
  const transformBlogData = (rawData: any): BlogData => {
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
  };

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Attempting to fetch blog data from GitHub API');
        
        // Fetch from GitHub API
        const response = await fetch(
          'https://api.github.com/repos/GarvishDua/ink-splash-stories/contents/public/api/blogs.json',
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'ink-splash-stories-frontend',
            },
            cache: 'no-cache'
          }
        );
        
        console.log('GitHub API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch from GitHub API: ${response.status} ${response.statusText}`);
        }
        
        const githubData = await response.json();
        console.log('GitHub API response received');
        
        // Decode base64 content from GitHub API
        const decodedContent = atob(githubData.content);
        const rawData = JSON.parse(decodedContent);
        console.log('Successfully parsed blog data from GitHub:', rawData);
        
        // Transform the data to match expected structure
        const transformedData = transformBlogData(rawData);
        setBlogData(transformedData);
      } catch (err) {
        console.error('Error fetching blog data from GitHub:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blog data');
        
        // Fallback to static file if GitHub API fails
        try {
          console.log('Attempting fallback to static file');
          const fallbackResponse = await fetch('/api/blogs.json', {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-cache'
          });
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const transformedData = transformBlogData(fallbackData);
            setBlogData(transformedData);
            console.log('Fallback successful');
          } else {
            throw new Error('Fallback also failed');
          }
        } catch (fallbackErr) {
          console.error('Fallback failed:', fallbackErr);
          // Final fallback to empty data
          setBlogData({
            posts: [],
            categories: []
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  return { blogData, loading, error, getPostsByCategory };
};
