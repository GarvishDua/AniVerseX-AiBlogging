// API Service for blog data operations
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

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
  thumbnail?: string;
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

class ApiService {
  private baseUrl: string;
  private supabase: any;

  constructor() {
    this.baseUrl = window.location.origin;
    // Initialize Supabase client
    import('../integrations/supabase/client').then(module => {
      this.supabase = module.supabase;
    });
  }

  private async getSupabaseClient() {
    if (!this.supabase) {
      const module = await import('../integrations/supabase/client');
      this.supabase = module.supabase;
    }
    return this.supabase;
  }

  // Generic API call wrapper
  private async makeApiCall<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        cache: 'no-cache',
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      if (typeof data === 'object' && data !== null) {
        // If the response has a success field, use it
        if ('success' in data) {
          return data as ApiResponse<T>;
        }
        // Otherwise, assume it's successful data
        return {
          success: true,
          data: data as T
        };
      }

      return {
        success: true,
        data: data as T
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Fetch blog data from Supabase
  async getBlogDataFromAPI(): Promise<ApiResponse<BlogData>> {
    try {
      const supabase = await this.getSupabaseClient();
      const { data: posts, error } = await supabase
        .from('blogs')
        .select('*')
        .order('publish_date', { ascending: false });

      if (error) throw error;

      // Transform to BlogData format
      const categoryMap: { [key: string]: { color: 'primary' | 'accent' | 'secondary'; count: number } } = {
        'anime': { color: 'primary', count: 0 },
        'manga': { color: 'accent', count: 0 },
        'marvel': { color: 'secondary', count: 0 }
      };

      posts?.forEach((post: any) => {
        const category = post.category.toLowerCase();
        if (categoryMap[category]) {
          categoryMap[category].count++;
        }
      });

      const categories = Object.entries(categoryMap).map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        color: data.color,
        count: data.count
      }));

      return {
        success: true,
        data: {
          posts: posts || [],
          categories
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch from Supabase';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Fetch blog data from GitHub API (fallback only)
  async getBlogDataFromGitHub(): Promise<ApiResponse<BlogData>> {
    try {
      const response = await fetch(
        'https://api.github.com/repos/GarvishDua/ink-splash-stories/contents/public/api/blogs.json',
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'aniversex-frontend',
          },
          cache: 'force-cache' // Use cache for fallback
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const githubData = await response.json();
      const decodedContent = atob(githubData.content);
      const rawData = JSON.parse(decodedContent);

      return {
        success: true,
        data: rawData as BlogData
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'GitHub API error';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Fetch blog data from static file (last resort)
  async getBlogDataFromStatic(): Promise<ApiResponse<BlogData>> {
    return this.makeApiCall<BlogData>(`${this.baseUrl}/api/blogs.json`);
  }

  // Create a new blog post
  async createBlogPost(blogPost: {
    title: string;
    content: string;
    author?: string;
    tags?: string[];
    category?: string;
    description?: string;
    thumbnail?: string;
  }): Promise<ApiResponse<any>> {
    try {
      const supabase = await this.getSupabaseClient();
      
      const newPost = {
        id: `post-${Date.now()}`,
        title: blogPost.title,
        content: blogPost.content,
        category: blogPost.category || 'anime',
        author: blogPost.author || 'Garvish Dua',
        description: blogPost.description || blogPost.content.substring(0, 150) + '...',
        tags: blogPost.tags || [],
        thumbnail: blogPost.thumbnail || '',
        read_time: `${Math.ceil(blogPost.content.split(' ').length / 200)} min read`,
        publish_date: new Date().toISOString().split('T')[0],
        views: '0',
        featured: false
      };

      const { data, error } = await supabase
        .from('blogs')
        .insert([newPost])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Delete a blog post
  async deleteBlogPost(postId: string): Promise<ApiResponse<any>> {
    try {
      const supabase = await this.getSupabaseClient();
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      return {
        success: true,
        message: 'Post deleted successfully'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Health check
  async checkHealth(): Promise<ApiResponse<{ status: string }>> {
    return this.makeApiCall(`${this.baseUrl}/api/health`);
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/get-blogs`, {
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
