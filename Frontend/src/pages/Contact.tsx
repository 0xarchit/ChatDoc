import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, FileQuestion, Bug, Lightbulb } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
}

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();

  const contactTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'support', label: 'Technical Support', icon: FileQuestion },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
  ];

  const onSubmit = (data: ContactForm) => {
    // In a real app, this would send to a backend service
    console.log('Contact form submitted:', data);
    toast.success('Thank you for your message! We\'ll get back to you soon.');
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Contact <span className="bg-gradient-hero bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or need support? We'd love to hear from you. 
            Reach out and we'll respond as quickly as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Response Time</h3>
                  <p className="text-sm text-muted-foreground">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Support Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 9:00 AM - 6:00 PM (UTC)
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Emergency Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    For critical bugs or security issues, please mark your message as urgent.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Types */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>What can we help with?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contactTypes.map((type) => (
                    <div key={type.value} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <type.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        {...register('name', { required: 'Name is required' })}
                        className="mt-1"
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/,
                            message: 'Please enter a valid email address'
                          }
                        })}
                        className="mt-1"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="type">Topic</Label>
                    <select
                      id="type"
                      {...register('type', { required: 'Please select a topic' })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select a topic...</option>
                      {contactTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.type && (
                      <p className="text-sm text-destructive mt-1">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      {...register('subject', { required: 'Subject is required' })}
                      className="mt-1"
                      placeholder="Brief description of your inquiry"
                    />
                    {errors.subject && (
                      <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      {...register('message', { 
                        required: 'Message is required',
                        minLength: {
                          value: 20,
                          message: 'Please provide more details (at least 20 characters)'
                        }
                      })}
                      className="mt-1 min-h-[120px]"
                      placeholder="Please provide as much detail as possible. For bug reports, include steps to reproduce the issue."
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Links */}
        <Card className="mt-8 border-0 shadow-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Looking for quick answers?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check out our API documentation for technical details and common use cases.
              </p>
              <Button variant="outline" asChild>
                <a href="/api-docs">
                  <FileQuestion className="mr-2 h-4 w-4" />
                  View API Documentation
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}