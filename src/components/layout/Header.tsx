import { useState } from "react";
import { Search, Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header = ({ isDarkMode, toggleDarkMode }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Popular Posts", href: "/popular" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const categoryItems = [
    { name: "All Categories", href: "/categories" },
    { name: "Anime Reviews", href: "/categories?filter=anime-reviews" },
    { name: "Manga", href: "/categories?filter=manga" },
    { name: "Marvel & Comics", href: "/categories?filter=marvel-comics" },
    { name: "Fan Theories", href: "/categories?filter=fan-theories" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-theme">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-heading font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AniVerseX
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                className="text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-transparent transition-all duration-300 ease-in-out px-3 py-2 h-auto"
              >
                Categories
                <ChevronDown className="ml-1 h-3 w-3 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
              </Button>
              
              {/* Dropdown Content */}
              <div className="absolute top-full left-0 mt-1 w-48 bg-background/95 backdrop-blur-md border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out transform translate-y-1 group-hover:translate-y-0 z-50">
                <div className="py-2">
                  {categoryItems.map((category) => (
                    <Link
                      key={category.name}
                      to={category.href}
                      className="block px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/20 transition-all duration-200 ease-in-out hover:translate-x-1"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:flex"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {/* Mobile Categories Section */}
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                      className="text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-transparent transition-all duration-300 ease-in-out px-4 py-2 h-auto justify-start w-full group"
                    >
                      Categories
                      <ChevronDown className={`ml-1 h-3 w-3 transition-transform duration-300 ease-in-out ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                    </Button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileCategoriesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="pl-2 space-y-1 pt-2">
                        {categoryItems.map((category, index) => (
                          <Link
                            key={category.name}
                            to={category.href}
                            className="block text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-accent/20 transition-all duration-200 ease-in-out px-4 py-3 rounded-md hover:translate-x-1"
                            style={{
                              animationDelay: isMobileCategoriesOpen ? `${index * 50}ms` : '0ms'
                            }}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Floating Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur border-b p-4 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search anime, manga, articles..."
                  className="pl-10 pr-10"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Anime", "Manga", "Marvel", "Reviews", "Theories"].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-md"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;