import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { apiMethods } from '@/lib/api';
import { Upload, BarChart3, FileText, MessageSquare, Shield, Zap } from 'lucide-react';

export default function Landing() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['api-status'],
    queryFn: apiMethods.checkActive,
    retry: 1,
  });

  const features = [
    {
      icon: FileText,
      title: 'Multi-Format Support',
      description: 'Upload PDF, TXT, CSV, XLSX, PPTX, and DOCX files up to 20MB'
    },
    {
      icon: MessageSquare,
      title: 'Intelligent Chat',
      description: 'Ask questions about your documents with context-aware responses'
    },
    {
      icon: Shield,
      title: 'BYOK Security',
      description: 'Bring your own keys for enhanced security and data control'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Quick document analysis and instant responses'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Status Badge */}
            <div className="flex justify-center mb-8">
              <Badge 
                variant={isLoading ? "secondary" : status ? "default" : "destructive"}
                className="text-sm px-4 py-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-current rounded-full animate-pulse" />
                    Checking API Status...
                  </div>
                ) : status ? (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-success rounded-full" />
                    Backend Active & Ready
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-destructive rounded-full" />
                    Backend Unavailable
                  </div>
                )}
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Chat with Your
              </span>
              <br />
              <span className="text-foreground">Documents</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Upload any document and start an intelligent conversation. Get instant answers, 
              summaries, and insights from your files using advanced RAG technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" variant="hero" asChild>
                <Link to="/dashboard">
                  <Upload className="mr-2 h-5 w-5" />
                  Start Uploading
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-hero opacity-20 blur-3xl rounded-full" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to extract insights from your documents with AI-powered conversations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-primary mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">6+</div>
              <div className="text-muted-foreground">File Formats Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">20MB</div>
              <div className="text-muted-foreground">Maximum File Size</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <div className="text-muted-foreground">Questions You Can Ask</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already extracting valuable insights from their documents
          </p>
          <Button size="lg" variant="hero" asChild>
            <Link to="/dashboard">
              <FileText className="mr-2 h-5 w-5" />
              Upload Your First Document
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}