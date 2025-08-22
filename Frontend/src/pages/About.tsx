import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageSquare, Brain, Shield } from 'lucide-react';

export default function About() {
  const technologies = [
    'React + TypeScript',
    'Retrieval Augmented Generation (RAG)',
    'Mistral AI',
    'Milvus Vector Database',
    'Advanced Document Processing'
  ];

  const capabilities = [
    {
      icon: FileText,
      title: 'Document Processing',
      description: 'Advanced text extraction and analysis from multiple file formats including PDF, Word, Excel, PowerPoint, and more.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Leveraging state-of-the-art language models to understand context and provide accurate, relevant responses.'
    },
    {
      icon: MessageSquare,
      title: 'Conversational Interface',
      description: 'Natural language conversations that maintain context across multiple exchanges for deeper document exploration.'
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Optional BYOK (Bring Your Own Keys) mode for enhanced security and complete control over your data.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            About <span className="bg-gradient-hero bg-clip-text text-transparent">ChatDoc</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforming how you interact with documents through intelligent conversations and AI-powered insights.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12 border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-center">
            <p className="text-muted-foreground leading-relaxed">
              ChatDoc was created to bridge the gap between static documents and dynamic knowledge extraction. 
              We believe that every document contains valuable insights waiting to be discovered through natural 
              conversation. Our platform empowers users to unlock the full potential of their documents using 
              cutting-edge AI technology.
            </p>
          </CardContent>
        </Card>

        {/* Capabilities */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Platform Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
                      <capability.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{capability.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <Card className="mb-12 border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Built With Modern Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-6">
              Our platform is built on a foundation of proven technologies, ensuring reliability, 
              scalability, and cutting-edge performance for all your document analysis needs.
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary text-primary-foreground font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Upload Document</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your document in any supported format (PDF, Word, Excel, etc.)
                </p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary text-primary-foreground font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">AI Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI extracts, analyzes, and indexes your document content
                </p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary text-primary-foreground font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Start Chatting</h3>
                <p className="text-sm text-muted-foreground">
                  Ask questions and get intelligent, context-aware responses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}