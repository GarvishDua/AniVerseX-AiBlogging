import { useParams, Link } from "react-router-dom";
import { useBlogData } from "@/hooks/useBlogData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/ui/markdown-text";
import { Calendar, Clock, Eye, ArrowLeft, Share2, BookOpen } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { blogData, loading, error } = useBlogData();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="h-4 bg-muted rounded mb-8 w-1/3"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load post. Please try again later.</p>
        </div>
      </div>
    );
  }

  const post = blogData.posts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = blogData.posts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="font-body">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="mb-12">
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="default" className="font-body">
                {post.category}
              </Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="text-xl text-muted-foreground font-body leading-relaxed mb-6">
              <MarkdownText inline>
                {post.description}
              </MarkdownText>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y">
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-body">
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

              <Button variant="ghost" size="sm" className="font-body">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <Card className="anime-glow">
            <CardContent className="p-8">
              <MarkdownText className="prose prose-lg max-w-none font-body">
                {post.content}
              </MarkdownText>
            </CardContent>
          </Card>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-heading font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-body">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-heading font-bold">Related Posts</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="group hover:anime-glow transition-all duration-300">
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3 text-xs">
                      {relatedPost.category}
                    </Badge>
                    
                    <Link to={`/blog/${relatedPost.id}`}>
                      <h3 className="font-heading font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </Link>
                    
                    <div className="text-muted-foreground font-body text-sm line-clamp-3 mb-4">
                      <MarkdownText inline>
                        {relatedPost.description}
                      </MarkdownText>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{relatedPost.publishDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogPost;