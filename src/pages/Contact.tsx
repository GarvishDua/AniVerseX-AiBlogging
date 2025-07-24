import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, Clock, MapPin, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@aniversex.com",
      description: "For general inquiries and feedback"
    },
    {
      icon: MessageCircle,
      title: "Social Media",
      content: "@AniVerseX",
      description: "Follow us for daily updates"
    },
    {
      icon: Clock,
      title: "Response Time",
      content: "Within 24 hours",
      description: "We aim to respond quickly"
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Global Team",
      description: "Writers from around the world"
    }
  ];

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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
            Have a question, suggestion, or just want to chat about anime? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="anime-glow">
              <CardHeader>
                <CardTitle className="text-2xl font-heading">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-body">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className="font-body"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-body">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                        className="font-body"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="font-body">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      required
                      className="font-body"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-body">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more..."
                      rows={6}
                      required
                      className="font-body resize-none"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full font-body">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {contactInfo.map((info) => (
              <Card key={info.title} className="hover:anime-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg gradient-primary">
                      <info.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold mb-1">{info.title}</h3>
                      <p className="text-primary font-body font-medium mb-1">{info.content}</p>
                      <p className="text-sm text-muted-foreground font-body">{info.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="anime-glow">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-3">Frequently Asked Questions</h3>
                <div className="space-y-3 text-sm font-body">
                  <div>
                    <p className="font-medium text-foreground mb-1">Can I submit content ideas?</p>
                    <p className="text-muted-foreground">Absolutely! We love hearing your suggestions for articles and reviews.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Do you accept guest posts?</p>
                    <p className="text-muted-foreground">Yes, we occasionally feature guest writers. Reach out with your proposal!</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">How often do you publish?</p>
                    <p className="text-muted-foreground">We publish new content 3-4 times per week, including reviews and news.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;