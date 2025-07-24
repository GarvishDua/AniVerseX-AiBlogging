import { Calendar, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogData } from "@/hooks/useBlogData";
import BlogPostLink from "@/components/ui/BlogPostLink";
import heroImage from "@/assets/hero-anime.jpg";

const HeroSection = () => {
  const { blogData, loading, error } = useBlogData();
  
  // Get the featured post or fallback to the first post
  const featuredPost = blogData?.posts.find(post => post.featured) || blogData?.posts[0];

  // Loading state
  if (loading) {
    return (
      <section className="relative mb-12">
        <Card className="overflow-hidden transition-theme anime-glow">
          <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
            </div>
            
            <CardContent className="relative h-full flex flex-col justify-end p-8 bg-gradient-to-t from-background/95 via-background/50 to-transparent">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Skeleton className="h-6 w-20" />
                </div>
                
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-6" />
                
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                
                <Skeleton className="h-12 w-40" />
              </div>
            </CardContent>
          </div>
        </Card>
      </section>
    );
  }

  // Error state or no featured post
  if (error || !featuredPost) {
    return (
      <section className="relative mb-12">
        <Card className="overflow-hidden transition-theme anime-glow">
          <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
            </div>
            
            <CardContent className="relative h-full flex flex-col justify-center items-center p-8 text-center">
              <h2 className="text-2xl font-heading font-bold mb-4">Welcome to AniVerseX</h2>
              <p className="text-muted-foreground font-body">
                {error ? 'Unable to load featured content' : 'No featured posts available'}
              </p>
            </CardContent>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="relative mb-12">
      <Card className="overflow-hidden transition-theme anime-glow">
        <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
          {/* Hero Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
          </div>
          
          <CardContent className="relative h-full flex flex-col justify-end p-8 bg-gradient-to-t from-background/95 via-background/50 to-transparent">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="default" className="bg-primary text-primary-foreground font-body">
                  {featuredPost.category}
                </Badge>
                {featuredPost.tags && featuredPost.tags.length > 0 && (
                  featuredPost.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="font-body">
                      {tag}
                    </Badge>
                  ))
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 leading-tight">
                {featuredPost.title}
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-6 font-body leading-relaxed max-w-3xl">
                {featuredPost.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-body">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{featuredPost.publishDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{featuredPost.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{featuredPost.views} views</span>
                </div>
              </div>
              
              <div className="mt-6">
                {featuredPost && (
                  <BlogPostLink postId={featuredPost.id}>
                    <button className="inline-flex items-center px-6 py-3 rounded-lg gradient-primary text-primary-foreground font-body font-medium hover:anime-glow transition-all duration-300 transform hover:scale-105">
                      Read Full Article
                    </button>
                  </BlogPostLink>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  );
};

export default HeroSection;