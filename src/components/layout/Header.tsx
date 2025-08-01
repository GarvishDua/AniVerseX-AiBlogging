import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useBlogData } from "@/hooks/useBlogData";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header = ({ isDarkMode, toggleDarkMode }: HeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { blogData } = useBlogData();

  // Filter posts based on search query
  const filteredPosts = searchQuery.length > 0 
    ? blogData?.posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Show only top 5 results
    : [];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(value.length > 0);
  };

  // Handle post selection
  const handlePostSelect = (postId: string) => {
    navigate(`/blog/${postId}`);
    setSearchQuery("");
    setShowDropdown(false);
    setIsSearchOpen(false);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredPosts && filteredPosts.length > 0) {
      handlePostSelect(filteredPosts[0].id);
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Popular Posts", href: "/popular" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const categoryItems = [
    { name: "All Categories", href: "/categories" },
    { name: "Anime", href: "/categories?filter=anime" },
    { name: "Manga", href: "/categories?filter=manga" },
    { name: "Marvel", href: "/categories?filter=marvel" },
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
              className="flex"
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
          <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur border-b p-4 animate-fade-in z-50">
            <div className="max-w-md mx-auto" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search blog posts by title..."
                    className="pl-10 pr-10"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setShowDropdown(false);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showDropdown && filteredPosts && filteredPosts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-y-auto z-50">
                  {filteredPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handlePostSelect(post.id)}
                      className="w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors border-b last:border-b-0 group"
                    >
                      <div className="font-medium text-sm line-clamp-1 group-hover:text-primary">
                        {post.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                        <span>{post.publishDate}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Show "No results" message */}
              {showDropdown && searchQuery.length > 0 && (!filteredPosts || filteredPosts.length === 0) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50">
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No blog posts found matching "{searchQuery}"
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {["Anime", "Manga", "Marvel", "Reviews", "Theories"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag.toLowerCase());
                      setShowDropdown(true);
                    }}
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