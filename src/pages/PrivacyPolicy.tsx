import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Cookie, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Email addresses when you subscribe to our newsletter",
        "Comments and feedback when you interact with our content", 
        "Basic analytics data like page views and session duration",
        "Cookies for improving site functionality and user experience"
      ]
    },
    {
      icon: Shield,
      title: "How We Protect Your Data",
      content: [
        "We use industry-standard encryption for all data transmission",
        "Regular security audits and updates to our systems",
        "Limited access to personal data on a need-to-know basis",
        "Secure hosting with reputable cloud providers"
      ]
    },
    {
      icon: Cookie,
      title: "Cookies and Tracking",
      content: [
        "Essential cookies for site functionality and user preferences",
        "Analytics cookies to understand how visitors use our site",
        "We do not sell or share your data with third parties",
        "You can disable cookies in your browser settings"
      ]
    },
    {
      icon: Mail,
      title: "Your Rights",
      content: [
        "Request access to your personal data",
        "Request correction of inaccurate information",
        "Request deletion of your data",
        "Unsubscribe from our newsletter at any time"
      ]
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
          <h1 className="text-4xl font-heading font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground font-body">
            How we collect, use, and protect your information
          </p>
          <p className="text-sm text-muted-foreground font-body mt-2">
            Last updated: December 20, 2024
          </p>
        </div>

        <Card className="mb-8 anime-glow">
          <CardContent className="p-8">
            <div className="prose max-w-none font-body">
              <p className="text-lg leading-relaxed mb-6">
                At AnimeVerse, we respect your privacy and are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website 
                and use our services.
              </p>
              
              <p className="leading-relaxed mb-6">
                We believe in transparency and want you to understand exactly what information we collect and why. 
                By using AnimeVerse, you agree to the collection and use of information in accordance with this policy.
              </p>
              
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@animeverse.com.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 mb-8">
          {sections.map((section) => (
            <Card key={section.title} className="hover:anime-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg gradient-primary">
                    <section.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 font-body">
                  {section.content.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="anime-glow">
          <CardHeader>
            <CardTitle>Data Retention and Deletion</CardTitle>
          </CardHeader>
          <CardContent className="font-body">
            <p className="text-muted-foreground leading-relaxed mb-4">
              We retain your personal information only for as long as necessary to provide you with our services 
              and for legitimate business purposes. When you request deletion of your account or data, we will 
              remove your information within 30 days, except where we are required to retain it by law.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 mt-6">
              <h4 className="font-heading font-semibold mb-2">Contact Us About Privacy</h4>
              <p className="text-sm text-muted-foreground mb-2">
                If you have questions about this Privacy Policy or want to exercise your rights:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Email: privacy@animeverse.com</li>
                <li>• Response time: Within 72 hours</li>
                <li>• Data protection officer available upon request</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground font-body">
            This Privacy Policy may be updated from time to time. We will notify you of any significant changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;