import { useTheme } from "@/contexts/ThemeContext";
import { useBlogData } from "@/hooks/useBlogData";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";

const Index = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { blogData, loading, error, getPostsByCategory } = useBlogData();

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
        <div className="flex flex-col lg:flex-row gap-8">
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
                Ink Splash Stories
              </span>
            </div>
            <p className="text-muted-foreground font-body">
              Your ultimate destination for anime, manga, and pop culture insights. Quality content for passionate fans.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-body">
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>  
              <Link to="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              © {new Date().getFullYear()} Ink Splash Stories. All rights reserved. Made with ❤️ for anime and manga fans.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
