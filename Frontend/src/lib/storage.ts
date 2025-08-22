import { ChatHistory, HistoryEntry, ChatMessage, BYOKConfig } from './api';

const STORAGE_KEYS = {
  CHAT_HISTORY: 'chatdoc_history',
  BYOK_KEYS: 'chatdoc_byok_keys',
  API_BASE_URL: 'apiBaseUrl'
} as const;

export const storage = {
  // Chat History Management
  getChatHistory(): ChatHistory {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (!stored) return { entries: [] };
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error reading chat history:', error);
      return { entries: [] };
    }
  },

  saveChatHistory(history: ChatHistory): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  },

  addHistoryEntry(entry: HistoryEntry): void {
    const history = this.getChatHistory();
    history.entries.unshift(entry); // Add to beginning
    this.saveChatHistory(history);
  },

  updateHistoryEntry(uploadId: string, updates: Partial<HistoryEntry>): void {
    const history = this.getChatHistory();
    const entryIndex = history.entries.findIndex(e => e.upload_id === uploadId);
    if (entryIndex !== -1) {
      history.entries[entryIndex] = { ...history.entries[entryIndex], ...updates };
      this.saveChatHistory(history);
    }
  },

  deleteHistoryEntry(uploadId: string): void {
    const history = this.getChatHistory();
    history.entries = history.entries.filter(e => e.upload_id !== uploadId);
    this.saveChatHistory(history);
  },

  addChatMessage(uploadId: string, message: ChatMessage): void {
    const history = this.getChatHistory();
    const entry = history.entries.find(e => e.upload_id === uploadId);
    if (entry) {
      entry.chats.push(message);
      this.saveChatHistory(history);
    }
  },

  // BYOK Keys Management
  getBYOKKeys(): BYOKConfig | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BYOK_KEYS);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error reading BYOK keys:', error);
      return null;
    }
  },

  saveBYOKKeys(keys: BYOKConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BYOK_KEYS, JSON.stringify(keys));
    } catch (error) {
      console.error('Error saving BYOK keys:', error);
    }
  },

  clearBYOKKeys(): void {
    localStorage.removeItem(STORAGE_KEYS.BYOK_KEYS);
  },

  // Expiry Management
  cleanupExpiredEntries(): number {
    const history = this.getChatHistory();
    const today = new Date().toDateString();
    const initialCount = history.entries.length;

    history.entries = history.entries.filter(entry => {
      const entryDate = new Date(entry.upload_date).toDateString();
      // Keep if: same date as today, OR BYOK enabled
      return entryDate === today || entry.byok;
    });

    this.saveChatHistory(history);
    return initialCount - history.entries.length;
  },

  scheduleNextCleanup(): void {
    // Calculate milliseconds until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.cleanupExpiredEntries();
      // Schedule the next cleanup (24 hours from now)
      this.scheduleNextCleanup();
    }, msUntilMidnight);
  },

  // Context composition for chat
  composeContextFromHistory(uploadId: string, newQuestion: string): string {
    const history = this.getChatHistory();
    const entry = history.entries.find(e => e.upload_id === uploadId);
    
    if (!entry || entry.chats.length === 0) {
      return newQuestion;
    }

    // Take last 4 turns (8 messages: 4 user + 4 assistant)
    const recentChats = entry.chats.slice(-8);
    
    if (recentChats.length === 0) {
      return newQuestion;
    }

    const contextParts = ['Conversation history:'];
    
    for (const chat of recentChats) {
      const label = chat.role === 'user' ? 'User' : 'Assistant';
      contextParts.push(`${label}: ${chat.text}`);
    }

    contextParts.push(`\n\nNew question: ${newQuestion}`);
    
    const composed = contextParts.join('\n');
    
    // Trim if too long (rough estimate: 4000 chars)
    if (composed.length > 4000) {
      // Take fewer turns if needed
      const shorterChats = entry.chats.slice(-4); // Last 2 turns
      const shorterContext = [
        'Conversation history:',
        ...shorterChats.map(chat => `${chat.role === 'user' ? 'User' : 'Assistant'}: ${chat.text}`),
        `\n\nNew question: ${newQuestion}`
      ].join('\n');
      
      return shorterContext.length > 4000 ? newQuestion : shorterContext;
    }

    return composed;
  },

  // Export/Backup
  exportHistory(): string {
    const history = this.getChatHistory();
    return JSON.stringify(history, null, 2);
  },

  importHistory(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData) as ChatHistory;
      if (!imported.entries || !Array.isArray(imported.entries)) {
        return false;
      }
      this.saveChatHistory(imported);
      return true;
    } catch (error) {
      console.error('Error importing history:', error);
      return false;
    }
  }
};

// Initialize cleanup scheduler when module loads
if (typeof window !== 'undefined') {
  // Run initial cleanup
  storage.cleanupExpiredEntries();
  // Schedule future cleanups
  storage.scheduleNextCleanup();
}
