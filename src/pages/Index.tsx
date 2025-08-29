import { useTheme } from "@/contexts/ThemeContext";
import { useBlogData } from "@/hooks/useBlogData";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import animeImage from "@/assets/category-anime.jpg";
import mangaImage from "@/assets/category-manga.jpg";
import marvelImage from "@/assets/category-marvel.jpg";
import heroImage from "@/assets/hero-anime.jpg";

const Index = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { blogData, loading, error, getPostsByCategory } = useBlogData();

  // Helper function to get category image
  const getCategoryImage = (categoryName: string, thumbnail?: string) => {
    if (thumbnail) return thumbnail;
    const name = categoryName.toLowerCase();
    if (name.includes('anime')) return animeImage;
    if (name.includes('manga')) return mangaImage;
    if (name.includes('marvel')) return marvelImage;
    return heroImage;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-theme">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-body text-muted-foreground">Loading awesome content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-theme">
        <div className="text-center space-y-4">
          <p className="text-lg font-body text-destructive">Error loading content: {error}</p>
        </div>
      </div>
    );
  }

  if (!blogData) return null;

  return (
    <div className="min-h-screen bg-background transition-theme">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Mobile Only: Modern Layout */}
        <div className="block md:hidden">
          <HeroSection />
          
          {/* Mobile Modern Category Layout */}
          <div className="space-y-8 mt-8">
            {blogData.categories.map((category, categoryIndex) => {
              const posts = getPostsByCategory(category.name);
              if (posts.length === 0) return null;
              
              return (
                <div key={category.name} className="relative">
                  {/* Background decoration */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className={`absolute top-0 ${categoryIndex % 2 === 0 ? 'right-0' : 'left-0'} w-32 h-32 bg-gradient-to-br from-primary/8 to-accent/8 rounded-full blur-3xl`}></div>
                  </div>
                  
                  <div className="relative">
                    {/* Category Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-1 w-8 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                          <h2 className="text-xl font-heading font-bold">{category.name}</h2>
                        </div>
                        <Link 
                          to={`/categories?filter=${category.name.toLowerCase()}`}
                          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                          View All
                        </Link>
                      </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="space-y-4">
                      {posts.slice(0, 3).map((post, index) => (
                        <div key={post.id} className={`${index % 2 === 1 ? 'ml-6' : 'mr-6'}`}>
                          {index === 0 ? (
                            // Featured large card
                            <Link to={`/blog/${post.id}`}>
                              <Card className="overflow-hidden hover:scale-[1.02] transition-all duration-300 bg-card/90 backdrop-blur-sm border border-border/50 group">
                                <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                                  {/* Custom thumbnail or category-based background image */}
                                  <div 
                                    className="absolute inset-0 bg-cover bg-center" 
                                    style={{ backgroundImage: `url(${getCategoryImage(category.name, post.thumbnail)})` }}
                                  ></div>
                                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/60"></div>
                                  <div className="absolute bottom-4 left-4 right-4">
                                    <Badge variant="secondary" className="text-xs mb-2 bg-secondary/80">
                                      {post.category}
                                    </Badge>
                                    <h3 className="font-heading font-semibold text-lg line-clamp-2 mb-2 text-white group-hover:text-primary transition-colors">{post.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-white/80">
                                      <span>{post.publishDate}</span>
                                      <div className="flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        <span>{post.views || '0'} views</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </Link>
                          ) : (
                            // Compact cards
                            <Link to={`/blog/${post.id}`}>
                              <Card className="overflow-hidden hover:scale-[1.02] transition-all duration-300 bg-card/80 backdrop-blur-sm border border-border/50 group">
                                <div className="flex gap-3 p-4">
                                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                    {/* Custom thumbnail or category-based image */}
                                    <div 
                                      className="absolute inset-0 bg-cover bg-center" 
                                      style={{ backgroundImage: `url(${getCategoryImage(category.name, post.thumbnail)})` }}
                                    ></div>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <Badge variant="secondary" className="text-xs mb-2 bg-secondary/80">
                                      {post.category}
                                    </Badge>
                                    <h3 className="font-heading font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                      <span>{post.publishDate}</span>
                                      <div className="flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        <span>{post.views || '0'} views</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop/Tablet: Original Layout */}
        <div className="hidden md:flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <HeroSection />
            
            {blogData.categories.map((category) => {
              const posts = getPostsByCategory(category.name);
              if (posts.length === 0) return null;
              
              return (
                <CategorySection
                  key={category.name}
                  title={category.name}
                  posts={posts}
                  color={category.color}
                />
              );
            })}
          </div>

          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </div>

        {/* Floating Action Element for Mobile */}
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <Link to="/popular">
            <div className="w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 floating-pulse anime-glow">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t transition-theme mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">I</span>
              </div>
              <span className="font-heading font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AniVerseX
              </span>
            </div>
            <p className="text-muted-foreground font-body">
              Explore the anime universe with AniVerseX - your gateway to manga reviews, anime insights, and pop culture content.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-body">
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>  
              <Link to="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              © {new Date().getFullYear()} AniVerseX. All rights reserved. Made with ❤️ for anime and manga fans.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
