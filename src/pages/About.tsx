import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Users, BookOpen, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    { icon: BookOpen, label: "Articles Published", value: "150+" },
    { icon: Users, label: "Monthly Readers", value: "25K+" },
    { icon: Star, label: "Community Rating", value: "4.9/5" },
    { icon: Heart, label: "Years Running", value: "3+" }
  ];

  const team = [
    {
      name: "Alex Chen",
      role: "Founder & Editor-in-Chief",
      description: "Anime enthusiast for 15+ years, started AniVerseX to share the magic of Japanese culture with the world."
    },
    {
      name: "Maya Rodriguez",
      role: "Senior Writer",
      description: "Manga expert and translator who brings deep cultural insights to every review and analysis."
    },
    {
      name: "Jordan Kim",
      role: "Community Manager",
      description: "Connects with our amazing community and ensures everyone feels welcome in the AniVerseX family."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="font-body">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About AniVerseX
          </h1>
          <p className="text-xl text-muted-foreground font-body leading-relaxed">
            Your gateway to the incredible world of anime, manga, and pop culture
          </p>
        </div>

        <Card className="mb-12 anime-glow">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none font-body">
              <p className="text-lg leading-relaxed mb-6">
                Welcome to AniVerseX, where passion meets expertise in the vibrant world of anime and manga. 
                Founded in 2024, we've grown from a small blog into a thriving community of anime enthusiasts, 
                manga readers, and pop culture aficionados.
              </p>
              
              <p className="leading-relaxed mb-6">
                Our mission is simple: to provide thoughtful, engaging content that celebrates the artistry, 
                storytelling, and cultural significance of anime and manga. Whether you're a seasoned otaku 
                or just beginning your journey into Japanese pop culture, we're here to guide, inform, and 
                inspire you.
              </p>
              
              <p className="leading-relaxed mb-6">
                From in-depth reviews and analysis to the latest industry news and fan theories, we cover 
                everything that makes anime and manga special. We believe in the power of these mediums to 
                tell compelling stories, explore complex themes, and bring people together across cultures.
              </p>
              
              <p className="leading-relaxed">
                Join our community and discover why millions of fans worldwide have fallen in love with 
                the incredible art form that is anime and manga. Welcome to AniVerseX – where every story matters.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center hover:anime-glow transition-all duration-300">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 mx-auto text-primary mb-3" />
                <div className="text-2xl font-heading font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-body">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold mb-6 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="hover:anime-glow transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-heading font-bold text-primary-foreground">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="anime-glow">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-heading font-bold mb-4">Join Our Community</h2>
            <p className="text-muted-foreground font-body mb-6 max-w-2xl mx-auto">
              AniVerseX is more than just a blog – it's a community of passionate fans who love to discuss, 
              discover, and celebrate anime and manga together. Join thousands of readers who make AniVerseX 
              their home for anime content.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="default" className="px-4 py-2">Weekly Reviews</Badge>
              <Badge variant="default" className="px-4 py-2">Breaking News</Badge>
              <Badge variant="default" className="px-4 py-2">Fan Theories</Badge>
              <Badge variant="default" className="px-4 py-2">Community Discussions</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;