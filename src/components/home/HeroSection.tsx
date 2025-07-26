import { Calendar, Eye } from "lucide-react";
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
          <div className="relative h-96 sm:h-[450px] md:h-[550px] bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
            </div>
            
            <CardContent className="relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-8 bg-gradient-to-t from-background/95 via-background/50 to-transparent">
              <div className="w-full max-w-4xl pt-4 sm:pt-6">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 min-h-[28px] sm:min-h-[32px]">
                  <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
                </div>
                
                <Skeleton className="h-8 sm:h-10 md:h-12 w-full mb-3 sm:mb-4" />
                <Skeleton className="h-4 sm:h-5 md:h-6 w-full sm:w-3/4 mb-4 sm:mb-6" />
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                  <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
                  <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
                </div>
                
                <Skeleton className="h-8 sm:h-10 md:h-12 w-32 sm:w-40" />
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
          <div className="relative h-96 sm:h-[450px] md:h-[550px] bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
            </div>
            
            <CardContent className="relative h-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-heading font-bold mb-3 sm:mb-4">Welcome to AniVerseX</h2>
              <p className="text-sm sm:text-base text-muted-foreground font-body">
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
        <div className="relative h-96 sm:h-[450px] md:h-[550px] bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 overflow-hidden">
          {/* Hero Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
          </div>
          
          <CardContent className="relative h-full flex flex-col justify-end p-4 sm:p-6 md:p-8 bg-gradient-to-t from-background/95 via-background/50 to-transparent overflow-hidden">
            <div className="w-full max-w-4xl pt-4 sm:pt-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 min-h-[28px] sm:min-h-[32px]">
                <Badge variant="default" className="bg-primary text-primary-foreground font-body text-xs sm:text-sm shrink-0 max-w-full truncate">
                  {featuredPost.category}
                </Badge>
                {featuredPost.tags && featuredPost.tags.length > 0 && (
                  featuredPost.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="font-body text-xs sm:text-sm shrink-0 max-w-[120px] truncate">
                      {tag}
                    </Badge>
                  ))
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold mb-3 sm:mb-4 leading-tight break-words">
                {featuredPost.title}
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-4 sm:mb-6 font-body leading-relaxed max-w-full md:max-w-3xl break-words">
                {featuredPost.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground font-body mb-4 sm:mb-6">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{featuredPost.publishDate}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{featuredPost.views} views</span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6">
                {featuredPost && (
                  <BlogPostLink postId={featuredPost.id}>
                    <button className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg gradient-primary text-primary-foreground font-body font-medium hover:anime-glow transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
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