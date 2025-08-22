import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadFormProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
}

const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export function UploadForm({ onUpload, isUploading, uploadProgress }: UploadFormProps) {

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File too large (max 20MB)');
      return;
    }

    try {
    await onUpload(file);
    } catch (error) {
      // Error handling is done in the parent component
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ALLOWED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isUploading,
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.name} className="text-sm text-destructive">
      <span className="font-medium">{file.name}:</span>
      <ul className="list-disc list-inside">
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </div>
  ));

  return (
    <div className="space-y-6">
      {/* File Drop Zone */}
      <Card className="border-2 border-dashed transition-colors duration-200 hover:border-primary/50">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`cursor-pointer text-center p-8 rounded-lg transition-colors duration-200 ${
              isDragActive 
                ? 'bg-primary/10 border-primary' 
                : 'bg-muted/50 hover:bg-muted/70'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center space-y-4">
              <div className={`rounded-full p-4 ${isDragActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10'}`}>
                <Upload className="h-8 w-8" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {isDragActive ? 'Drop your file here' : 'Upload Document'}
                </h3>
                <p className="text-muted-foreground mb-2">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: PDF, TXT, CSV, XLSX, PPTX, DOCX (max 20MB)
                </p>
              </div>
              
              {!isDragActive && !isUploading && (
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
              )}
            </div>
          </div>
          
          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
          
          {fileRejectionItems.length > 0 && (
            <Alert className="mt-4 border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {fileRejectionItems}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}