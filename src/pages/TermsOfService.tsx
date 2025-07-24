import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Shield, Eye, UserCheck, Gavel, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background transition-theme">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" className="font-body">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Gavel className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our service.
            </p>
            <div className="flex justify-center mt-6">
              <Badge variant="secondary" className="font-body">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Badge>
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            {/* Acceptance of Terms */}
            <Card className="anime-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-heading">
                  <UserCheck className="h-6 w-6 text-primary" />
                  1. Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="font-body space-y-4">
                <p>
                  By accessing and using Ink Splash Stories ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms of Service ("Terms") govern your use of our website located at your domain name (the "Service") operated by Ink Splash Stories.
                </p>
              </CardContent>
            </Card>

            {/* Use License */}
            <Card className="anime-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-heading">
                  <FileText className="h-6 w-6 text-primary" />
                  2. Use License
                </CardTitle>
              </CardHeader>
              <CardContent className="font-body space-y-4">
                <p>
                  Permission is granted to temporarily download one copy of the materials on Ink Splash Stories for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
                <p>
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.
                </p>
              </CardContent>
            </Card>

            {/* Content Guidelines */}
            <Card className="anime-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-heading">
                  <Shield className="h-6 w-6 text-primary" />
                  3. Content Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="font-body space-y-4">
                <p>
                  Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                </p>
                <p>
                  By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
                </p>
                <p>
                  You represent and warrant that:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The Content is yours (you own it) or you have the right to use it</li>
                  <li>The Content does not violate the privacy rights, publicity rights, copyrights, or other rights of any person</li>
                  <li>The Content does not contain harmful, offensive, or inappropriate material</li>
                </ul>
              </CardContent>
            </Card>

            {/* Privacy and Data */}
            <Card className="anime-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-heading">
                  <Eye className="h-6 w-6 text-primary" />
                  4. Privacy and Data Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="font-body space-y-4">
                <p>
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
                </p>
                <p>
                  We may use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="anime-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-heading">
                  <Shield className="h-6 w-6 text-primary" />
                  5. Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent className="font-body space-y-4">
                <p>
                  The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>excludes all representations and warranties relating to this website and its contents</li>
                  <li>excludes all liability for damages arising out of or in connection with your use of this website</li>
                </ul>
                <p>
                  Nothing in these terms and conditions shall exclude our liability for death or personal injury resulting from our negligence.
                </p>
              </CardContent>
            </Card>

            {/* Limitations */}
            <Card className="anime-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-heading">
                  <Gavel className="h-6 w-6 text-primary" />
                  6. Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="font-body space-y-4">
                <p>
                  In no event shall Ink Splash Stories or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
                <p>
                  Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="anime-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-heading">
                  <Mail className="h-6 w-6 text-primary" />
                  7. Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="font-body space-y-4">
                <p>
                  If you have any questions about these Terms of Service, please contact us through our contact page or by email.
                </p>
                <p>
                  We reserve the right to update or change our Terms of Service at any time and you should check this page periodically. Your continued use of the Service after we post any modifications to the Terms of Service on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Terms of Service.
                </p>
                <div className="mt-6">
                  <Link to="/contact">
                    <Button variant="outline" className="font-body">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Navigation */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap justify-center gap-6 text-sm font-body">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link to="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/" className="hover:text-primary transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
