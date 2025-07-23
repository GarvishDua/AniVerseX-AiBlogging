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
        
        console.log('Attempting to fetch blog data from serverless API');
        
        // Try the serverless function first since it's working
        const serverlessResponse = await fetch('/api/get-blogs', {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-cache'
        });
        
        if (serverlessResponse.ok) {
          const apiResponse = await serverlessResponse.json();
          if (apiResponse.success) {
            const transformedData = transformBlogData(apiResponse.data);
            setBlogData(transformedData);
            console.log('Serverless API successful');
            return; // Exit early on success
          } else {
            throw new Error(apiResponse.error || 'Serverless API returned error');
          }
        } else {
          throw new Error('Serverless API failed');
        }
      } catch (err) {
        console.error('Error fetching from serverless API:', err);
        
        // Fallback to GitHub API
        try {
          console.log('Attempting GitHub API fallback');
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
          
          if (response.ok) {
            const githubData = await response.json();
            const decodedContent = atob(githubData.content);
            const rawData = JSON.parse(decodedContent);
            const transformedData = transformBlogData(rawData);
            setBlogData(transformedData);
            console.log('GitHub API fallback successful');
          } else {
            throw new Error(`GitHub API error: ${response.status}`);
          }
        } catch (githubErr) {
          console.error('GitHub API fallback failed:', githubErr);
          
          // Final fallback to static file
          try {
            console.log('Attempting final fallback to static file');
            const staticResponse = await fetch('/api/blogs.json', {
              headers: { 'Content-Type': 'application/json' },
              cache: 'no-cache'
            });
            
            if (staticResponse.ok) {
              const staticData = await staticResponse.json();
              const transformedData = transformBlogData(staticData);
              setBlogData(transformedData);
              console.log('Static file fallback successful');
            } else {
              throw new Error('Static file also failed');
            }
          } catch (staticErr) {
            console.error('All methods failed:', staticErr);
            setError('Failed to fetch blog data from all sources');
            // Final fallback to empty data
            setBlogData({
              posts: [],
              categories: []
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  return { blogData, loading, error, getPostsByCategory };
};
