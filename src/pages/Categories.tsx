import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useBlogData } from "@/hooks/useBlogData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/ui/markdown-text";
import { Calendar, Eye, Filter, ArrowLeft } from "lucide-react";

interface Post {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  publishDate: string;
  views: string;
  tags: string[];
  featured: boolean;
}

const Categories = () => {
  const { blogData, loading, error } = useBlogData();
  const [searchParams] = useSearchParams();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (blogData) {
      const filter = searchParams.get('filter');
      
      if (filter) {
        // Convert URL filter to category name
        const categoryMap: { [key: string]: string } = {
          'anime-reviews': 'Anime Reviews',
          'manga': 'Manga',
          'marvel-comics': 'Marvel & Comics',
          'fan-theories': 'Fan Theories & Explained'
        };
        
        const categoryName = categoryMap[filter] || filter;
        setSelectedCategory(categoryName);
        
        const filtered = blogData.posts.filter(post => 
          post.category.toLowerCase() === categoryName.toLowerCase()
        );
        setFilteredPosts(filtered);
      } else {
        setSelectedCategory("all");
        setFilteredPosts(blogData.posts);
      }
    }
  }, [blogData, searchParams]);

  const categories = blogData?.categories || [];
  const allCategories = [
    { name: "All Categories", count: blogData?.posts.length || 0, filter: "all" },
    ...categories.map(cat => ({
      name: cat.name,
      count: cat.count,
      filter: cat.name.toLowerCase().replace(/\s+/g, '-').replace('&', '').replace(/\s+/g, '-')
    }))
  ];

  const handleCategoryFilter = (categoryName: string) => {
    setSelectedCategory(categoryName);
    if (categoryName === "All Categories" || categoryName === "all") {
      setFilteredPosts(blogData?.posts || []);
    } else {
      const filtered = blogData?.posts.filter(post => 
        post.category.toLowerCase() === categoryName.toLowerCase()
      ) || [];
      setFilteredPosts(filtered);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="h-4 bg-muted rounded mb-8 w-1/3"></div>
          <div className="grid gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
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
          <p className="text-muted-foreground">Failed to load categories. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="font-body">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4">
            Browse by Categories
          </h1>
          <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
            Discover amazing content organized by your favorite topics
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {allCategories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name || (selectedCategory === "all" && category.name === "All Categories") ? "default" : "outline"}
              onClick={() => handleCategoryFilter(category.name)}
              className="font-body"
            >
              <Filter className="h-4 w-4 mr-2" />
              {category.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-heading font-semibold">
            {selectedCategory === "all" || selectedCategory === "All Categories" 
              ? `All Posts (${filteredPosts.length})` 
              : `${selectedCategory} (${filteredPosts.length})`}
          </h2>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group hover:anime-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default" className="font-body">
                          {post.category}
                        </Badge>
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.featured && (
                          <Badge variant="outline" className="text-xs border-primary">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <Link to={`/blog/${post.id}`}>
                        <h2 className="text-xl font-heading font-semibold group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                      </Link>
                      
                      <div className="text-muted-foreground font-body line-clamp-2">
                        <MarkdownText inline>
                          {post.description}
                        </MarkdownText>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground font-body">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{post.publishDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span>{post.views} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body text-lg">
              No posts found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
