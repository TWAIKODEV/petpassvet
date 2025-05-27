import React, { createContext, useContext, useState, useEffect } from 'react';
import inboxService, { UnifiedMessage, Thread } from '../services/inboxService';

interface ClientInfo {
  id: string;
  pet: {
    name: string;
    species: string;
    breed: string;
    age: number;
    sex: 'male' | 'female';
  };
  lastVisit: string;
  nextVisit?: string;
  visits: number;
  petPass: boolean;
  healthPlan?: string;
  insurance?: {
    provider: string;
    number: string;
  };
  billing: {
    totalSpent: number;
    lastPayment: {
      amount: number;
      date: string;
      method: string;
    };
  };
  prescriptions: Array<{
    date: string;
    medication: string;
    duration: string;
  }>;
}

interface InboxContextType {
  threads: Thread[];
  activeThread: string | null;
  messages: UnifiedMessage[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  clientInfo: ClientInfo | null;
  setActiveThread: (threadId: string | null) => void;
  sendMessage: (content: { text: string, subject?: string }) => Promise<boolean>;
  refreshThreads: () => Promise<void>;
  markThreadAsRead: (threadId: string) => Promise<void>;
  archiveThread: (threadId: string) => Promise<void>;
  viewClientInfo: (clientDetails: ClientInfo | null) => void;
}

const InboxContext = createContext<InboxContextType | undefined>(undefined);

export const useInbox = () => {
  const context = useContext(InboxContext);
  if (context === undefined) {
    throw new Error('useInbox must be used within an InboxProvider');
  }
  return context;
};

export const InboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<UnifiedMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    try {
      // Connect to Socket.IO
      const socket = inboxService.connectSocket();
      
      // Set up message listener
      const messageUnsubscribe = inboxService.onNewMessage((message) => {
        // If the message belongs to the active thread, add it to the messages
        if (activeThread && message.threadId === activeThread) {
          setMessages(prev => [...prev, message]);
        }
        
        // Update threads to reflect the new message
        refreshThreads();
      });
      
      // Set up threads listener
      const threadsUnsubscribe = inboxService.onThreadsUpdated((updatedThreads) => {
        setThreads(updatedThreads);
        calculateUnreadCount(updatedThreads);
      });
      
      // Load initial threads
      refreshThreads();
      
      // Cleanup
      return () => {
        messageUnsubscribe();
        threadsUnsubscribe();
      };
    } catch (error) {
      console.error('Error initializing inbox:', error);
      setError('Error al conectar con el servicio de mensajería');
    }
  }, []);

  // Load messages when active thread changes
  useEffect(() => {
    if (activeThread) {
      loadMessages(activeThread);
      markThreadAsRead(activeThread);
    } else {
      setMessages([]);
    }
  }, [activeThread]);

  const calculateUnreadCount = (threadList: Thread[]) => {
    const count = threadList.reduce((total, thread) => total + thread.unreadCount, 0);
    setUnreadCount(count);
  };

  const refreshThreads = async () => {
    setLoading(true);
    setError(null);
    try {
      const threadList = await inboxService.getThreads();
      setThreads(threadList);
      calculateUnreadCount(threadList);
    } catch (err: any) {
      console.error('Error fetching threads:', err);
      setError(err.message || 'Error al cargar los hilos');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (threadId: string) => {
    setLoading(true);
    setError(null);
    try {
      const messageList = await inboxService.getMessages(threadId);
      setMessages(messageList);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Error al cargar los mensajes');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: { text: string, subject?: string }): Promise<boolean> => {
    if (!activeThread) return false;
    
    setLoading(true);
    setError(null);
    try {
      // Get the channel from the active thread
      const thread = threads.find(t => t.id === activeThread);
      if (!thread) {
        throw new Error('Hilo no encontrado');
      }
      
      const result = await inboxService.sendMessage(activeThread, thread.channel, content);
      if (result) {
        // Add the sent message to the messages list
        setMessages(prev => [...prev, result]);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Error al enviar el mensaje');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markThreadAsRead = async (threadId: string) => {
    try {
      await inboxService.markThreadAsRead(threadId);
      // Update the threads list to reflect the read status
      setThreads(prev => 
        prev.map(thread => 
          thread.id === threadId 
            ? { ...thread, unreadCount: 0 } 
            : thread
        )
      );
      // Recalculate unread count
      calculateUnreadCount(threads);
    } catch (err) {
      console.error('Error marking thread as read:', err);
    }
  };

  const archiveThread = async (threadId: string) => {
    try {
      await inboxService.archiveThread(threadId);
      // Remove the archived thread from the list
      setThreads(prev => prev.filter(thread => thread.id !== threadId));
      // If the archived thread was active, clear the active thread
      if (activeThread === threadId) {
        setActiveThread(null);
      }
    } catch (err) {
      console.error('Error archiving thread:', err);
    }
  };

  const viewClientInfo = (clientDetails: ClientInfo | null) => {
    setClientInfo(clientDetails);
  };

  return (
    <InboxContext.Provider
      value={{
        threads,
        activeThread,
        messages,
        loading,
        error,
        unreadCount,
        clientInfo,
        setActiveThread,
        sendMessage,
        refreshThreads,
        markThreadAsRead,
        archiveThread,
        viewClientInfo
      }}
    >
      {children}
    </InboxContext.Provider>
  );
};