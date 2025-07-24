import { Calendar, TrendingUp, Tag, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogData } from "@/hooks/useBlogData";
import BlogPostLink from "@/components/ui/BlogPostLink";

const Sidebar = () => {
  const { blogData, loading } = useBlogData();

  // Get the 4 most recent posts (sorted by date)
  const recentPosts = blogData?.posts
    ?.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    ?.slice(0, 4) || [];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get popular tags from all blog posts
  const getAllTags = () => {
    if (!blogData?.posts) return [];
    
    const tagCount: { [key: string]: number } = {};
    
    blogData.posts.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => {
          const normalizedTag = tag.trim();
          tagCount[normalizedTag] = (tagCount[normalizedTag] || 0) + 1;
        });
      }
    });
    
    // Sort tags by frequency and return top 10
    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  };

  const popularTags = getAllTags();

  return (
    <aside className="w-80 sticky top-20 h-fit space-y-6">
      {/* Recent Posts */}
      <Card className="transition-theme">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                {index < 3 && <Separator className="mt-3" />}
              </div>
            ))
          ) : recentPosts.length > 0 ? (
            // Real blog posts
            recentPosts.map((post, index) => (
              <div key={post.id} className="space-y-2">
                <BlogPostLink postId={post.id}>
                  <h4 className="font-medium text-sm font-body hover:text-primary cursor-pointer transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                </BlogPostLink>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(post.publishDate)}</span>
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full capitalize">
                    {post.category}
                  </span>
                </div>
                {index < recentPosts.length - 1 && <Separator className="mt-3" />}
              </div>
            ))
          ) : (
            // No posts available
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground font-body">No recent posts available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card className="transition-theme">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg">
            <Tag className="h-5 w-5 text-accent" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            // Loading skeleton for tags
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          ) : popularTags.length > 0 ? (
            // Real tags from blog posts
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-muted hover:bg-accent hover:text-accent-foreground rounded-full transition-colors capitalize"
                >
                  {tag}
                </button>
              ))}
            </div>
          ) : (
            // No tags available
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground font-body">No tags available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Newsletter Subscription */}
      <Card className="transition-theme">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg">
            <Mail className="h-5 w-5 text-primary" />
            Stay Updated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground font-body">
            Get the latest anime news, reviews, and theories delivered to your inbox.
          </p>
          <div className="space-y-2">
            <Input 
              placeholder="Enter your email" 
              type="email"
              className="font-body"
            />
            <Button className="w-full gradient-primary border-0 font-body font-medium">
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ad Placeholder */}
      <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
        <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
        <p className="text-sm text-muted-foreground/60 font-body">Sidebar Ad Space</p>
        <p className="text-xs text-muted-foreground/40 font-body">300x250</p>
      </div>
    </aside>
  );
};

export default Sidebar;