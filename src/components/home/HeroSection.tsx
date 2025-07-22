import { Calendar, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-anime.jpg";

const HeroSection = () => {
  const featuredPost = {
    title: "The Evolution of Anime: From Astro Boy to Modern Masterpieces",
    description: "Explore the incredible journey of anime from its humble beginnings to the global phenomenon it is today. Discover how legendary creators shaped the industry and what the future holds.",
    category: "Analysis",
    readTime: "8 min read",
    publishDate: "December 20, 2024",
    views: "12.5K",
    image: "/api/placeholder/1200/600",
    tags: ["History", "Industry", "Analysis"]
  };

  return (
    <section className="relative mb-12">
      {/* Top Banner Ad Placeholder */}
      <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center mb-8">
        <p className="text-sm text-muted-foreground/60 font-body">Top Banner Ad Space - 728x90</p>
      </div>

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
                {featuredPost.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="font-body">
                    {tag}
                  </Badge>
                ))}
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
                <button className="inline-flex items-center px-6 py-3 rounded-lg gradient-primary text-primary-foreground font-body font-medium hover:anime-glow transition-all duration-300 transform hover:scale-105">
                  Read Full Article
                </button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  );
};

export default HeroSection;