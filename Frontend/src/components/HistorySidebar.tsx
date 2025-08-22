import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { HistoryEntry } from '@/lib/api';
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  Trash2, 
  Download, 
  Shield, 
  Clock,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface HistorySidebarProps {
  entries: HistoryEntry[];
  selectedEntry: HistoryEntry | null;
  onSelectEntry: (entry: HistoryEntry) => void;
  onDeleteEntry: (uploadId: string) => Promise<void>;
  onExportHistory: () => void;
  onClearExpired: () => void;
  expiredCount: number;
}

export function HistorySidebar({
  entries,
  selectedEntry,
  onSelectEntry,
  onDeleteEntry,
  onExportHistory,
  onClearExpired,
  expiredCount
}: HistorySidebarProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (uploadId: string) => {
    setDeletingId(uploadId);
    try {
      await onDeleteEntry(uploadId);
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  const getExpiryInfo = (entry: HistoryEntry) => {
    if (entry.byok) return null;
    
    const uploadDate = new Date(entry.upload_date);
    const today = new Date();
    const isToday = uploadDate.toDateString() === today.toDateString();
    
    if (!isToday) {
      return 'Will be auto-deleted at midnight';
    }
    
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const entryDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = entryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > -7) return `${Math.abs(diffDays)} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document History
        </CardTitle>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExportHistory}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          {expiredCount > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear Expired ({expiredCount})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Expired Documents</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove {expiredCount} expired document(s) from your history. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearExpired}>
                    Clear Expired
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          {entries.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No documents uploaded yet.</p>
              <p className="text-xs mt-1">Upload your first document to get started!</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {entries.map((entry) => {
                const expiryInfo = getExpiryInfo(entry);
                const isSelected = selectedEntry?.upload_id === entry.upload_id;
                
                return (
                  <div
                    key={entry.upload_id}
                    className={`group p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => onSelectEntry(entry)}
                  >
                    {/* Header with filename and badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-sm truncate flex-1" title={entry.filename}>
                        {entry.filename}
                      </h3>
                      <div className="flex gap-1 flex-shrink-0">
                        {entry.byok && (
                          <Badge variant="default" className="text-xs px-2 py-0 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                            <Shield className="h-2 w-2 mr-1" />
                            Protected
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(entry.upload_date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {entry.chats.length}
                      </div>
                    </div>

                    {/* Expiry warning */}
                    {expiryInfo && (
                      <Alert className="mb-2 py-1 px-2 border-warning bg-warning/10">
                        <Clock className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          {expiryInfo}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end">

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                            disabled={deletingId === entry.upload_id}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Document</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{entry.filename}"? 
                              This will remove the document and all its chat history. 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(entry.upload_id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}