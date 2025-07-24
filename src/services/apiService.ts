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

  constructor() {
    this.baseUrl = window.location.origin;
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

  // Fetch blog data from serverless API (optimized)
  async getBlogDataFromAPI(): Promise<ApiResponse<BlogData>> {
    return this.makeApiCall<BlogData>(`${this.baseUrl}/api/get-blogs`);
  }

  // Fetch blog data from GitHub API (fallback only)
  async getBlogDataFromGitHub(): Promise<ApiResponse<BlogData>> {
    try {
      const response = await fetch(
        'https://api.github.com/repos/GarvishDua/ink-splash-stories/contents/public/api/blogs.json',
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'ink-splash-stories-frontend',
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
  }): Promise<ApiResponse<any>> {
    return this.makeApiCall(`${this.baseUrl}/api/post-blog`, {
      method: 'POST',
      body: JSON.stringify(blogPost),
    });
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
