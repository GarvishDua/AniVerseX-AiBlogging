import { Calendar, TrendingUp, Tag, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  const recentPosts = [
    {
      title: "Top 10 Anime of 2024",
      date: "Dec 15, 2024",
      category: "Reviews"
    },
    {
      title: "One Piece Chapter 1100 Analysis",
      date: "Dec 14, 2024",
      category: "Manga"
    },
    {
      title: "Marvel's X-Men: New Developments",
      date: "Dec 13, 2024",
      category: "Marvel"
    },
    {
      title: "Attack on Titan Ending Explained",
      date: "Dec 12, 2024",
      category: "Theories"
    }
  ];

  const popularTags = [
    "One Piece", "Naruto", "Dragon Ball", "Attack on Titan", "Marvel",
    "DC Comics", "Studio Ghibli", "Demon Slayer", "My Hero Academia", "Jujutsu Kaisen"
  ];

  return (
    <aside className="w-80 sticky top-20 h-fit space-y-6">
      {/* Recent Posts */}
      <Card className="transition-theme">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentPosts.map((post, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-sm font-body hover:text-primary cursor-pointer transition-colors line-clamp-2">
                {post.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                  {post.category}
                </span>
              </div>
              {index < recentPosts.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card className="transition-theme">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg">
            <Tag className="h-5 w-5 text-accent" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-muted hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Subscription */}
      <Card className="transition-theme">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg">
            <Mail className="h-5 w-5 text-primary" />
            Stay Updated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground font-body">
            Get the latest anime news, reviews, and theories delivered to your inbox.
          </p>
          <div className="space-y-2">
            <Input 
              placeholder="Enter your email" 
              type="email"
              className="font-body"
            />
            <Button className="w-full gradient-primary border-0 font-body font-medium">
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ad Placeholder */}
      <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
        <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
        <p className="text-sm text-muted-foreground/60 font-body">Sidebar Ad Space</p>
        <p className="text-xs text-muted-foreground/40 font-body">300x250</p>
      </div>
    </aside>
  );
};

export default Sidebar;