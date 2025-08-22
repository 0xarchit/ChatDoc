import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, Lock, Trash2, Key, AlertTriangle } from 'lucide-react';

export default function Privacy() {
  const lastUpdated = "August 22, 2025";

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Privacy <span className="bg-gradient-hero bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8 border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Important:</strong> This privacy policy covers the ChatDoc frontend application. 
            Your document processing and storage policies may vary depending on your chosen backend 
            configuration and BYOK (Bring Your Own Keys) settings.
          </AlertDescription>
        </Alert>

        {/* Data Collection */}
        <Card className="mb-8 border-0 shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-primary" />
              <CardTitle>Information We Collect</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Local Storage Data</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Chat history and conversation logs (stored locally in your browser)</li>
                <li>Document upload metadata (filename, upload date, document ID)</li>
                <li>Application settings and preferences</li>
                <li>BYOK credentials (only if you opt-in to local storage)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Uploaded Documents</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Document content sent to configured backend API for processing</li>
                <li>File metadata (size, type, name)</li>
                <li>Generated embeddings and extracted text content</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* BYOK Mode */}
        <Card className="mb-8 border-0 shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Key className="h-6 w-6 text-primary" />
              <CardTitle>BYOK (Bring Your Own Keys) Mode</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-success bg-success/10">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                When using BYOK mode, you maintain complete control over your API keys and data processing.
              </AlertDescription>
            </Alert>
            
            <div>
              <h3 className="font-semibold mb-2">Enhanced Privacy Features</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Your API keys are stored locally in your browser only</li>
                <li>Direct communication with your chosen AI and vector database providers</li>
                <li>No intermediary processing of your sensitive data</li>
                <li>Complete control over data retention and deletion policies</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Your Responsibilities</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Securing your API keys and credentials</li>
                <li>Understanding your chosen providers' privacy policies</li>
                <li>Managing data retention within your own systems</li>
                <li>Backing up important chat history if needed</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8 border-0 shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle>Data Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Local Data Protection</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>All chat history is stored locally in your browser</li>
                <li>BYOK credentials use browser's secure local storage</li>
                <li>No persistent cookies or tracking mechanisms</li>
                <li>Optional encryption for sensitive locally stored data</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Transmission Security</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>All API communications use HTTPS encryption</li>
                <li>Document uploads are encrypted in transit</li>
                <li>No storage of credentials on our servers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8 border-0 shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trash2 className="h-6 w-6 text-primary" />
              <CardTitle>Data Retention & Deletion</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Automatic Cleanup</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Non-BYOK documents are automatically deleted at midnight (local time)</li>
                <li>BYOK documents persist until you manually delete them</li>
                <li>Chat history cleanup follows the same rules as document retention</li>
                <li>You can manually export your data before deletion</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Manual Control</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Delete individual documents and their chat history anytime</li>
                <li>Clear all local data through browser settings</li>
                <li>Export chat history for backup purposes</li>
                <li>Revoke BYOK credentials to stop data persistence</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8 border-0 shadow-card">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Access:</strong> View all your locally stored data through the application interface</li>
              <li><strong>Portability:</strong> Export your chat history and settings in JSON format</li>
              <li><strong>Deletion:</strong> Delete individual conversations or all local data at any time</li>
              <li><strong>Control:</strong> Choose whether to persist data locally or use session-only storage</li>
              <li><strong>Transparency:</strong> Clear information about what data is stored and where</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Questions About Privacy?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this privacy policy or how your data is handled, 
              please don't hesitate to reach out to us.
            </p>
            <p className="text-sm text-muted-foreground">
              This policy applies specifically to the ChatDoc frontend application. For questions 
              about backend data processing, please refer to your chosen service providers' privacy policies.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}