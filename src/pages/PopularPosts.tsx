import { useBlogData } from "@/hooks/useBlogData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/ui/markdown-text";
import { Calendar, Clock, Eye, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PopularPosts = () => {
  const { blogData, loading, error } = useBlogData();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !blogData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Sort posts by views (convert string like "25.4K" to numbers for sorting)
  const getViewsNumber = (views: string) => {
    const num = parseFloat(views.replace('K', ''));
    return views.includes('K') ? num * 1000 : num;
  };

  const popularPosts = [...blogData.posts].sort((a, b) => getViewsNumber(b.views) - getViewsNumber(a.views));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to Home Button */}
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" className="font-body">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-heading font-bold">Popular Posts</h1>
      </div>
      
      <p className="text-muted-foreground font-body mb-8 text-lg">
        Discover our most-read articles about anime, manga, and pop culture.
      </p>

      <div className="grid gap-6">
        {popularPosts.map((post, index) => (
          <Card key={post.id} className="group hover:anime-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-32 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-3xl font-heading font-bold text-primary mb-2">
                      #{index + 1}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {post.views} views
                    </Badge>
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default" className="font-body">
                      {post.category}
                    </Badge>
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Link to={`/blog/${post.id}`}>
                    <h2 className="text-xl font-heading font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <div className="text-muted-foreground font-body line-clamp-2">
                    <MarkdownText inline>
                      {post.description}
                    </MarkdownText>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground font-body">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.publishDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{post.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PopularPosts;