import { Calendar, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownText } from "@/components/ui/markdown-text";
import { Link } from "react-router-dom";
import animeImage from "@/assets/category-anime.jpg";
import mangaImage from "@/assets/category-manga.jpg";
import marvelImage from "@/assets/category-marvel.jpg";

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishDate: string;
  views: string;
  image?: string;
  tags: string[];
}

interface CategorySectionProps {
  title: string;
  posts: Post[];
  color?: "primary" | "accent" | "secondary";
}

const CategorySection = ({ title, posts, color = "primary" }: CategorySectionProps) => {
  const colorVariants = {
    primary: {
      header: "text-primary",
      icon: "text-primary",
      gradient: "gradient-primary"
    },
    accent: {
      header: "text-accent",
      icon: "text-accent", 
      gradient: "gradient-accent"
    },
    secondary: {
      header: "text-secondary-foreground",
      icon: "text-secondary-foreground",
      gradient: "bg-secondary"
    }
  };

  const variant = colorVariants[color];
  
  const getCategoryImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'anime reviews':
        return animeImage;
      case 'manga chapters':
        return mangaImage;
      case 'marvel & comics':
        return marvelImage;
      default:
        return animeImage;
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className={`h-1 w-12 rounded-full ${variant.gradient}`}></div>
        <h2 className={`text-2xl md:text-3xl font-heading font-bold ${variant.header}`}>
          {title}
        </h2>
        <TrendingUp className={`h-6 w-6 ${variant.icon}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Card key={post.id} className={`group cursor-pointer transition-all duration-300 hover:scale-105 hover:anime-glow ${index === 0 ? 'md:col-span-2' : ''}`}>
            <div className={`relative ${index === 0 ? 'h-64' : 'h-48'} bg-gradient-to-br from-muted/50 to-muted rounded-t-lg overflow-hidden`}>
              {/* Category-specific background image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${getCategoryImage(post.category)})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/60"></div>
              </div>
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <Badge variant="default" className={`${variant.gradient} text-white font-body`}>
                  {post.category}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-3">
                <Link to={`/blog/${post.id}`}>
                  <h3 className={`font-heading font-semibold group-hover:${variant.header} transition-colors ${index === 0 ? 'text-xl' : 'text-lg'} line-clamp-2`}>
                    {post.title}
                  </h3>
                </Link>
                
                <div className="text-muted-foreground font-body text-sm line-clamp-3">
                  <MarkdownText inline>
                    {post.description}
                  </MarkdownText>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-body">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground font-body pt-2 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.publishDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <span className="font-medium">{post.views} views</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </section>
  );
};

export default CategorySection;