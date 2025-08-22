import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { UploadForm } from '@/components/UploadForm';
import { ChatWindow } from '@/components/ChatWindow';
import { HistorySidebar } from '@/components/HistorySidebar';
import { SettingsModal } from '@/components/SettingsModal';
import { apiMethods, BYOKConfig, HistoryEntry, ChatMessage } from '@/lib/api';
import { storage } from '@/lib/storage';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentBYOKKeys, setCurrentBYOKKeys] = useState<BYOKConfig | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Load chat history and BYOK keys
  const { data: chatHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['chat-history'],
    queryFn: () => storage.getChatHistory(),
    staleTime: 0,
  });

  // Initialize BYOK keys from storage
  useEffect(() => {
    const storedKeys = storage.getBYOKKeys();
    setCurrentBYOKKeys(storedKeys);
  }, []);

  // Auto-select the first entry if none selected and update selected entry data
  useEffect(() => {
    if (chatHistory?.entries.length) {
      if (!selectedEntry) {
        setSelectedEntry(chatHistory.entries[0]);
      } else {
        // Update the selected entry with latest data from storage
        const updatedEntry = chatHistory.entries.find(e => e.upload_id === selectedEntry.upload_id);
        if (updatedEntry && JSON.stringify(updatedEntry) !== JSON.stringify(selectedEntry)) {
          setSelectedEntry(updatedEntry);
        }
      }
    }
  }, [chatHistory, selectedEntry]);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ file }: { 
      file: File; 
    }) => {
      setUploadProgress(10);

      // Use BYOK keys from settings storage if present
      const storedKeys = storage.getBYOKKeys();
      const overrides: Partial<BYOKConfig> | undefined = storedKeys || undefined;

      const uploadResponse = await apiMethods.uploadFile(file, overrides);
      setUploadProgress(100);

      // Create history entry
      const historyEntry: HistoryEntry = {
        upload_id: uploadResponse.upload_id,
        filename: file.name,
        upload_date: new Date().toISOString(),
  byok: !!overrides && !!(overrides.mistral_api_key && overrides.zilliz_uri && overrides.zilliz_token && overrides.collection_name),
  overrides: overrides || undefined,
        chats: [],
      };

      // Save to localStorage
      storage.addHistoryEntry(historyEntry);
      return { historyEntry, uploadResponse };
    },
    onSuccess: ({ historyEntry }) => {
      toast.success(`Document "${historyEntry.filename}" uploaded successfully!`);
      setSelectedEntry(historyEntry);
      refetchHistory();
      setUploadProgress(0);
    },
    onError: (error: any) => {
      console.error('Upload error:', error);
      if (error.response?.status === 413) {
        toast.error('File too large (max 20MB)');
      } else if (error.response?.status === 400) {
        toast.error('Invalid file or text extraction failed');
      } else {
        toast.error('Upload failed. Please try again.');
      }
      setUploadProgress(0);
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ uploadId, message, overrides }: {
      uploadId: string;
      message: string;
      overrides?: Partial<BYOKConfig>;
    }) => {
      // Compose context from chat history
      const contextualQuestion = storage.composeContextFromHistory(uploadId, message);
      
      const response = await apiMethods.query({
        question: contextualQuestion,
        upload_id: uploadId,
        mistral_api_key: overrides?.mistral_api_key || null,
        zilliz_uri: overrides?.zilliz_uri || null,
        zilliz_token: overrides?.zilliz_token || null,
        collection_name: overrides?.collection_name || null,
      });

      return { response, originalMessage: message };
    },
    onMutate: ({ uploadId, message }) => {
      // Add user message immediately
      const userMessage: ChatMessage = {
        role: 'user',
        text: message,
        ts: new Date().toISOString(),
      };
      
      storage.addChatMessage(uploadId, userMessage);
      refetchHistory();
    },
    onSuccess: ({ response, originalMessage }, { uploadId }) => {
      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        text: response.answer,
        ts: new Date().toISOString(),
      };
      
      storage.addChatMessage(uploadId, assistantMessage);
      refetchHistory();
    },
    onError: (error: any) => {
      console.error('Query error:', error);
      if (error.response?.status === 404) {
        toast.error('Document not found. Please re-upload the document.');
      } else {
        toast.error('Failed to get response. Please try again.');
      }
    },
  });

  // Delete document mutation
  const deleteMutation = useMutation({
    mutationFn: async (uploadId: string) => {
      const entry = chatHistory?.entries.find(e => e.upload_id === uploadId);
      
      try {
        // Try to delete from server
        await apiMethods.deleteDocument(uploadId, entry?.overrides);
      } catch (error) {
        // Continue with local deletion even if server deletion fails
        console.warn('Server deletion failed, continuing with local deletion:', error);
      }
      
      // Always delete from local storage
      storage.deleteHistoryEntry(uploadId);
      
      return uploadId;
    },
    onSuccess: (deletedId) => {
      if (selectedEntry?.upload_id === deletedId) {
        setSelectedEntry(null);
      }
      refetchHistory();
    },
    onError: () => {
      toast.error('Failed to delete document');
    },
  });

  const handleUpload = async (file: File) => {
    await uploadMutation.mutateAsync({ file });
  };

  const handleSendMessage = async (uploadId: string, message: string, overrides?: Partial<BYOKConfig>) => {
    await sendMessageMutation.mutateAsync({ uploadId, message, overrides });
  };

  const handleDeleteEntry = async (uploadId: string) => {
    await deleteMutation.mutateAsync(uploadId);
  };


  const handleExportHistory = () => {
    const exported = storage.exportHistory();
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatdoc-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('History exported successfully');
  };

  const handleClearExpired = () => {
    const clearedCount = storage.cleanupExpiredEntries();
    refetchHistory();
    if (selectedEntry && chatHistory?.entries.find(e => e.upload_id === selectedEntry.upload_id) === undefined) {
      setSelectedEntry(null);
    }
    toast.success(`Cleared ${clearedCount} expired documents`);
  };

  const handleUpdateBYOKKeys = (keys: BYOKConfig | null) => {
    setCurrentBYOKKeys(keys);
  };

  // Calculate expired count
  const expiredCount = chatHistory?.entries.filter(entry => {
    if (entry.byok) return false;
    const entryDate = new Date(entry.upload_date).toDateString();
    const today = new Date().toDateString();
    return entryDate !== today;
  }).length || 0;

  if (isMobile && sidebarOpen) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">ChatDoc Dashboard</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Sidebar */}
        <div className="flex-1 overflow-hidden">
          <HistorySidebar
            entries={chatHistory?.entries || []}
            selectedEntry={selectedEntry}
            onSelectEntry={(entry) => {
              setSelectedEntry(entry);
              setSidebarOpen(false);
            }}
            onDeleteEntry={handleDeleteEntry}
            onExportHistory={handleExportHistory}
            onClearExpired={handleClearExpired}
            expiredCount={expiredCount}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold">
            Dashboard
          </h1>
        </div>
        
        <SettingsModal
          currentBYOKKeys={currentBYOKKeys}
          onUpdateBYOKKeys={handleUpdateBYOKKeys}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Sidebar */}
          {!isMobile && (
            <>
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <HistorySidebar
                  entries={chatHistory?.entries || []}
                  selectedEntry={selectedEntry}
                  onSelectEntry={setSelectedEntry}
                  onDeleteEntry={handleDeleteEntry}
                  
                  onExportHistory={handleExportHistory}
                  onClearExpired={handleClearExpired}
                  expiredCount={expiredCount}
                />
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Main Panel */}
          <ResizablePanel defaultSize={75}>
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* Upload Section */}
              <ResizablePanel defaultSize={40} minSize={30}>
                <div className="h-full p-4 overflow-y-auto">
                  <UploadForm
                    onUpload={handleUpload}
                    isUploading={uploadMutation.isPending}
                    uploadProgress={uploadProgress}
                  />
                </div>
              </ResizablePanel>
              
              <ResizableHandle />
              
              {/* Chat Section */}
              <ResizablePanel defaultSize={60} minSize={40}>
                <div className="h-full p-4">
                  <ChatWindow
                    selectedEntry={selectedEntry}
                    onSendMessage={handleSendMessage}
                    isLoading={sendMessageMutation.isPending}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}