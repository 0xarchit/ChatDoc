import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { HistoryEntry, ChatMessage, BYOKConfig } from '@/lib/api';
import { Send, Bot, User, Loader2, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface ChatWindowProps {
  selectedEntry: HistoryEntry | null;
  onSendMessage: (uploadId: string, message: string, overrides?: Partial<BYOKConfig>) => Promise<void>;
  isLoading: boolean;
}

interface ChatForm {
  message: string;
}

export function ChatWindow({ selectedEntry, onSendMessage, isLoading }: ChatWindowProps) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ChatForm>();
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const message = watch('message', '');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedEntry?.chats]);

  const onSubmit = async (data: ChatForm) => {
    if (!selectedEntry || !data.message.trim()) return;

    // Check message length for non-BYOK uploads (max 100 words)
    if (!selectedEntry.byok) {
      const wordCount = data.message.trim().split(/\s+/).length;
      if (wordCount > 100) {
        toast.error('Message too long. Maximum 100 words for non-BYOK uploads.');
        return;
      }
    }

    setIsSending(true);
    try {
      await onSendMessage(selectedEntry.upload_id, data.message, selectedEntry.overrides);
      reset();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedEntry) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <div className="text-center text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Document Selected</h3>
            <p>Upload a document or select one from your history to start chatting.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg truncate">{selectedEntry.filename}</CardTitle>
          <div className="flex items-center gap-2">
            {selectedEntry.byok && (
              <Badge variant="default" className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20">
                <Shield className="h-3 w-3 mr-1" />
                Protected
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {selectedEntry.chats?.length || 0} messages
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Uploaded {new Date(selectedEntry.upload_date).toLocaleDateString()}
        </p>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 min-h-0 p-4">
          <div className="space-y-4">
            {(!selectedEntry.chats || selectedEntry.chats.length === 0) ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p>No messages yet. Ask a question about your document!</p>
              </div>
            ) : (
              selectedEntry.chats.map((chat, index) => (
                <div
                  key={index}
                  className={`flex w-full items-start gap-3 ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {chat.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`min-w-0 max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
                      chat.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border'
                    }`}
                  >
                    <div className="text-sm break-words whitespace-pre-wrap">
                      {chat.role === 'assistant' ? (
                        <div className="prose prose-sm max-w-full dark:prose-invert break-words">
                          <ReactMarkdown
                            components={{
                              pre: (props: any) => (
                                <pre className="overflow-x-auto max-w-full" {...props} />
                              ),
                              code: (props: any) => {
                                const inline = props.inline as boolean | undefined;
                                const className = props.className || '';
                                const children = props.children;
                                return (
                                  <code
                                    className={`break-words ${inline ? 'whitespace-pre-wrap' : 'whitespace-pre'} ${className}`}
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              table: (props: any) => (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-sm" {...props} />
                                </div>
                              ),
                              img: (props: any) => (
                                <img className="max-w-full h-auto" {...props} />
                              ),
                              a: (props: any) => (
                                <a className="underline break-words" {...props} />
                              )
                            }}
                          >
                            {chat.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        chat.text
                      )}
                    </div>
                    <div className={`text-xs mt-1 opacity-70 ${
                      chat.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {formatTimestamp(chat.ts)}
                    </div>
                  </div>

                  {chat.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}

            {(isLoading || isSending) && (
              <div className="flex w-full items-start gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 max-w-[80%] rounded-lg px-4 py-3 bg-card border shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Form */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <div className="flex-1">
              <Input
                {...register('message', {
                  required: 'Please enter a message',
                  validate: (value) => {
                    if (!selectedEntry?.byok && value.trim().split(/\s+/).length > 100) {
                      return 'Message too long (max 100 words for non-BYOK)';
                    }
                    return true;
                  }
                })}
                placeholder="Ask a question about your document..."
                disabled={isLoading || isSending}
                className="resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                  }
                }}
              />
              {errors.message && (
                <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
              )}
              {!selectedEntry.byok && (
                <p className="text-xs text-muted-foreground mt-1">
                  {message.trim().split(/\s+/).filter(w => w).length}/100 words
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || isSending || !message.trim()}
              size="icon"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}