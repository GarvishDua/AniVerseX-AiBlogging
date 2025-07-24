import { Link } from "react-router-dom";
import { ArrowLeft, Map, Home, FileText, Mail, Shield, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlogData } from "@/hooks/useBlogData";

const Sitemap = () => {
  const { blogData, loading } = useBlogData();

  return (
    <div className="min-h-screen bg-background transition-theme">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" className="font-body">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Map className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Sitemap
            </h1>
            <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
              Find all pages and content on Ink Splash Stories
            </p>
          </div>

          {/* Main Pages */}
          <Card className="anime-glow mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-heading">
                <Home className="h-6 w-6 text-primary" />
                Main Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="font-body space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                  <Home className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Home</div>
                    <div className="text-sm text-muted-foreground">Latest posts and featured content</div>
                  </div>
                </Link>
                
                <Link to="/categories" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Categories</div>
                    <div className="text-sm text-muted-foreground">Browse posts by category</div>
                  </div>
                </Link>
                
                <Link to="/popular" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <div>  
                    <div className="font-medium">Popular Posts</div>
                    <div className="text-sm text-muted-foreground">Most viewed and trending content</div>
                  </div>
                </Link>
                
                <Link to="/about" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">About</div>
                    <div className="text-sm text-muted-foreground">Learn about our mission</div>
                  </div>
                </Link>
                
                <Link to="/contact" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Contact</div>
                    <div className="text-sm text-muted-foreground">Get in touch with us</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Legal Pages */}
          <Card className="anime-glow mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-heading">
                <Shield className="h-6 w-6 text-primary" />
                Legal & Policy Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="font-body">
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/privacy" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                  <Shield className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Privacy Policy</div>
                    <div className="text-sm text-muted-foreground">How we handle your data</div>
                  </div>
                </Link>
                
                <Link to="/terms" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-medium">Terms of Service</div>
                    <div className="text-sm text-muted-foreground">Terms and conditions</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Blog Posts */}
          {!loading && blogData && (
            <Card className="anime-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-heading">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Blog Posts ({blogData.posts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="font-body">
                <div className="space-y-3">
                  {blogData.posts.map((post) => (
                    <Link 
                      key={post.id}
                      to={`/blog/${post.id}`}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <FileText className="h-4 w-4 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="font-medium line-clamp-1">{post.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {post.description || "Read this interesting blog post"}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{post.category}</span>
                          <span>{post.publishDate}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card className="anime-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-heading">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Blog Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
