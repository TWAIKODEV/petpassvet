import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useToastContext } from './ToastContext';

// Tipos para los correos de Microsoft
export interface MicrosoftEmail {
  id: string;
  subject: string;
  bodyPreview: string;
  receivedDateTime: string;
  sentDateTime?: string;
  from: {
    emailAddress: {
      address: string;
      name: string;
    };
  };
  toRecipients: Array<{
    emailAddress: {
      address: string;
      name: string;
    };
  }>;
  isRead: boolean;
  hasAttachments: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    contentType: string;
    size: number;
    contentBytes?: string;
  }>;
  conversationId: string;
  body: {
    contentType: string;
    content: string;
  };
}

export interface MicrosoftThread {
  id: string;
  subject: string;
  lastMessage: MicrosoftEmail;
  unreadCount: number;
  participants: string[];
  lastActivity: string;
  type: 'received' | 'sent';
}

// Tipos para chats mock
export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  platform: 'whatsapp' | 'telegram' | 'instagram' | 'facebook';
  contact: string;
  lastMessage: ChatMessage;
  unreadCount: number;
  lastActivity: string;
}

type TabType = 'received' | 'sent';
type MainTabType = 'emails' | 'chats';

interface MicrosoftInboxContextType {
  // Estado
  threads: MicrosoftThread[];
  chatThreads: ChatThread[];
  activeThread: string | null;
  messages: MicrosoftEmail[];
  chatMessages: ChatMessage[];
  connectedAccounts: Array<{
    _id: string;
    userId: string;
    platform: string;
    username: string;
    name: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
    connected: boolean;
    email?: string;
    profileImageUrl?: string;
    accountCreatedAt?: string;
    createdAt: number;
    updatedAt: number;
  }>;
  loading: boolean;
  error: string | null;
  isUpdatingAccounts: boolean;
  isLoadingMessages: boolean;
  activeTab: TabType;
  activeMainTab: MainTabType;
  
  // Acciones
  setActiveThread: (threadId: string | null) => void;
  setActiveTab: (tab: TabType) => void;
  setActiveMainTab: (tab: MainTabType) => void;
  refreshThreads: () => Promise<void>;
  loadMessages: (threadId: string) => Promise<void>;
  loadMessageDetails: (messageId: string) => Promise<void>;
  sendEmail: (toRecipients: string[], subject: string, body: string, ccRecipients?: string[], bccRecipients?: string[], attachments?: Array<{name: string, contentType: string, contentBytes: string}>) => Promise<boolean>;
  replyToEmail: (messageId: string, body: string) => Promise<boolean>;
  markAsRead: (messageId: string) => Promise<void>;
  updateConnectedAccounts: () => Promise<void>;
}

const MicrosoftInboxContext = createContext<MicrosoftInboxContextType | undefined>(undefined);

export const useMicrosoftInbox = () => {
  const context = useContext(MicrosoftInboxContext);
  if (context === undefined) {
    throw new Error('useMicrosoftInbox must be used within a MicrosoftInboxProvider');
  }
  return context;
};

// Datos mock para chats
const mockChatThreads: ChatThread[] = [
  {
    id: 'chat-1',
    platform: 'whatsapp',
    contact: 'María García',
    lastMessage: {
      id: 'msg-1',
      sender: 'María García',
      content: 'Hola, ¿tienen cita disponible para mañana?',
      timestamp: '2025-01-20T14:30:00Z',
      isRead: false
    },
    unreadCount: 2,
    lastActivity: '2025-01-20T14:30:00Z'
  },
  {
    id: 'chat-2',
    platform: 'telegram',
    contact: 'Carlos López',
    lastMessage: {
      id: 'msg-2',
      sender: 'Carlos López',
      content: 'Perfecto, confirmo la cita para el viernes',
      timestamp: '2025-01-20T13:15:00Z',
      isRead: true
    },
    unreadCount: 0,
    lastActivity: '2025-01-20T13:15:00Z'
  },
  {
    id: 'chat-3',
    platform: 'instagram',
    contact: 'Ana Martínez',
    lastMessage: {
      id: 'msg-3',
      sender: 'Ana Martínez',
      content: '¿Pueden darme información sobre los servicios de peluquería?',
      timestamp: '2025-01-20T12:45:00Z',
      isRead: false
    },
    unreadCount: 1,
    lastActivity: '2025-01-20T12:45:00Z'
  },
  {
    id: 'chat-4',
    platform: 'facebook',
    contact: 'Luis Rodríguez',
    lastMessage: {
      id: 'msg-4',
      sender: 'Luis Rodríguez',
      content: 'Gracias por la atención, mi perro está mucho mejor',
      timestamp: '2025-01-20T11:20:00Z',
      isRead: true
    },
    unreadCount: 0,
    lastActivity: '2025-01-20T11:20:00Z'
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'María García',
    content: 'Hola, ¿tienen cita disponible para mañana?',
    timestamp: '2025-01-20T14:30:00Z',
    isRead: false
  },
  {
    id: 'msg-2',
    sender: 'ClinicPro',
    content: 'Hola María, sí tenemos disponibilidad. ¿A qué hora te vendría bien?',
    timestamp: '2025-01-20T14:32:00Z',
    isRead: true
  },
  {
    id: 'msg-3',
    sender: 'María García',
    content: 'Perfecto, me vendría bien a las 10:00 AM',
    timestamp: '2025-01-20T14:35:00Z',
    isRead: false
  }
];

export const MicrosoftInboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threads, setThreads] = useState<MicrosoftThread[]>([]);
  const [chatThreads] = useState<ChatThread[]>(mockChatThreads);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<MicrosoftEmail[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingAccounts, setIsUpdatingAccounts] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>('emails');
  
  const { showSuccess, showError } = useToastContext();
  
  // Convex queries y actions
  const connectedAccounts = useQuery(api.microsoft.getConnectedAccounts, { userId: "current-user" });
  const getMicrosoftEmails = useAction(api.microsoft.getMicrosoftEmails);
  const getMicrosoftSentEmails = useAction(api.microsoft.getMicrosoftSentEmails);
  const getMicrosoftMessageDetails = useAction(api.microsoft.getMicrosoftMessageDetails);
  const sendMicrosoftEmail = useAction(api.microsoft.sendMicrosoftEmail);
  const replyToMicrosoftEmail = useAction(api.microsoft.replyToMicrosoftEmail);
  const markMicrosoftEmailAsRead = useAction(api.microsoft.markMicrosoftEmailAsRead);
  const updateMicrosoftAccount = useAction(api.microsoft.updateMicrosoftAccount);
  const disconnectAccount = useMutation(api.microsoft.disconnectAccount);

  // Filtrar solo cuentas conectadas de Microsoft
  const microsoftAccounts = connectedAccounts?.filter(account => 
    account.platform === 'microsoft' && account.connected
  ) || [];

  // Actualizar cuentas conectadas al cargar la página
  useEffect(() => {
    if (microsoftAccounts.length > 0) {
      updateConnectedAccounts();
    }
  }, [microsoftAccounts.length]);

  // Actualizar cuentas conectadas
  const updateConnectedAccounts = async () => {
    if (!microsoftAccounts || microsoftAccounts.length === 0) return;
    
    setIsUpdatingAccounts(true);
    try {
      for (const account of microsoftAccounts) {
        if (!account.accessToken) continue;
        
        // Verificar si el token ha expirado
        if (account.expiresAt && Date.now() > account.expiresAt) {
          console.log(`Token expirado para Microsoft: ${account.username}`);
          await disconnectAccount({ accountId: account._id as Id<"socialAccounts"> });
          showError(`Token expirado para Microsoft: ${account.username}. Por favor, reconecta la cuenta.`);
          continue;
        }

        try {
          console.log(`Actualizando datos de Microsoft para: ${account.username}`);
          await updateMicrosoftAccount({ 
            accountId: account._id as Id<"socialAccounts">, 
            accessToken: account.accessToken 
          });
          console.log(`Datos actualizados para Microsoft: ${account.username}`);
        } catch (error) {
          console.error(`Error actualizando Microsoft:`, error);
          await disconnectAccount({ accountId: account._id as Id<"socialAccounts"> });
          showError(`Error actualizando Microsoft: ${account.username}`);
        }
      }
    } catch (error) {
      console.error('Error actualizando cuentas:', error);
      showError('Error actualizando las cuentas conectadas');
    } finally {
      setIsUpdatingAccounts(false);
    }
  };

  // Cargar hilos de conversación
  const refreshThreads = async () => {
    if (activeMainTab === 'chats') {
      // Para chats, usar datos mock
      setThreads([]);
      return;
    }

    if (microsoftAccounts.length === 0) {
      setThreads([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const allThreads: MicrosoftThread[] = [];
      
      for (const account of microsoftAccounts) {
        if (!account.accessToken) continue;
        
        try {
          let emailsData;
          
          if (activeTab === 'received') {
            emailsData = await getMicrosoftEmails({ 
              accessToken: account.accessToken, 
              top: 50 
            });
          } else {
            emailsData = await getMicrosoftSentEmails({ 
              accessToken: account.accessToken, 
              top: 50 
            });
          }
          
          if (emailsData && emailsData.value) {
            // Agrupar correos por conversationId
            const threadsMap = new Map<string, MicrosoftEmail[]>();
            
            emailsData.value.forEach((email: MicrosoftEmail) => {
              const conversationId = email.conversationId;
              if (!threadsMap.has(conversationId)) {
                threadsMap.set(conversationId, []);
              }
              threadsMap.get(conversationId)!.push(email);
            });
            
            // Crear hilos de conversación
            threadsMap.forEach((emails, conversationId) => {
              const sortedEmails = emails.sort((a, b) => {
                const dateA = new Date(a.receivedDateTime || a.sentDateTime || '');
                const dateB = new Date(b.receivedDateTime || b.sentDateTime || '');
                return dateB.getTime() - dateA.getTime();
              });
              
              const lastMessage = sortedEmails[0];
              const unreadCount = activeTab === 'received' ? emails.filter(email => !email.isRead).length : 0;
              
              const thread: MicrosoftThread = {
                id: conversationId,
                subject: lastMessage.subject || 'Sin asunto',
                lastMessage,
                unreadCount,
                participants: [
                  lastMessage.from.emailAddress.address,
                  ...lastMessage.toRecipients.map(r => r.emailAddress.address)
                ],
                lastActivity: lastMessage.receivedDateTime || lastMessage.sentDateTime || '',
                type: activeTab
              };
              
              allThreads.push(thread);
            });
          }
        } catch (error) {
          console.error(`Error cargando correos de ${account.username}:`, error);
        }
      }
      
      // Ordenar hilos por fecha de última actividad
      allThreads.sort((a, b) => 
        new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
      );
      
      setThreads(allThreads);
    } catch (error) {
      console.error('Error cargando hilos:', error);
      setError('Error cargando los hilos de conversación');
    } finally {
      setLoading(false);
    }
  };

  // Cargar mensajes de un hilo específico
  const loadMessages = async (threadId: string) => {
    if (activeMainTab === 'chats') {
      // Para chats, usar datos mock
      setMessages([]);
      setChatMessages(mockChatMessages);
      return;
    }

    if (microsoftAccounts.length === 0) {
      setMessages([]);
      return;
    }

    setIsLoadingMessages(true);
    setError(null);
    
    try {
      const allMessages: MicrosoftEmail[] = [];
      
      for (const account of microsoftAccounts) {
        if (!account.accessToken) continue;
        
        try {
          let emailsData;
          
          if (activeTab === 'received') {
            emailsData = await getMicrosoftEmails({ 
              accessToken: account.accessToken, 
              top: 100 
            });
          } else {
            emailsData = await getMicrosoftSentEmails({ 
              accessToken: account.accessToken, 
              top: 100 
            });
          }
          
          if (emailsData && emailsData.value) {
            const threadMessages = emailsData.value.filter((email: MicrosoftEmail) => 
              email.conversationId === threadId
            );
            
            allMessages.push(...threadMessages);
          }
        } catch (error) {
          console.error(`Error cargando mensajes de ${account.username}:`, error);
        }
      }
      
      // Ordenar mensajes por fecha
      allMessages.sort((a, b) => {
        const dateA = new Date(a.receivedDateTime || a.sentDateTime || '');
        const dateB = new Date(b.receivedDateTime || b.sentDateTime || '');
        return dateA.getTime() - dateB.getTime();
      });
      
      setMessages(allMessages);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      setError('Error cargando los mensajes');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Cargar detalles de un mensaje específico con adjuntos
  const loadMessageDetails = async (messageId: string) => {
    if (microsoftAccounts.length === 0) return;

    try {
      const account = microsoftAccounts[0];
      
      const messageDetails = await getMicrosoftMessageDetails({
        accessToken: account.accessToken,
        messageId: messageId
      });
      
      if (messageDetails) {
        // Actualizar el mensaje específico con los detalles completos
        setMessages(prevMessages => 
          prevMessages.map(message => 
            message.id === messageId 
              ? { ...message, ...messageDetails }
              : message
          )
        );
      }
    } catch (error) {
      console.error('Error cargando detalles del mensaje:', error);
    }
  };

  // Enviar correo
  const sendEmail = async (toRecipients: string[], subject: string, body: string, ccRecipients?: string[], bccRecipients?: string[], attachments?: Array<{name: string, contentType: string, contentBytes: string}>): Promise<boolean> => {
    if (microsoftAccounts.length === 0) {
      showError('No hay cuentas de Microsoft conectadas');
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Usar la primera cuenta conectada
      const account = microsoftAccounts[0];
      
      await sendMicrosoftEmail({
        accessToken: account.accessToken,
        toRecipients,
        ccRecipients: ccRecipients || [],
        bccRecipients: bccRecipients || [],
        subject,
        body,
        attachments: attachments || []
      });
      
      showSuccess('Correo enviado exitosamente');
      return true;
    } catch (error) {
      console.error('Error enviando correo:', error);
      setError('Error enviando el correo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Responder a un correo
  const replyToEmail = async (messageId: string, body: string): Promise<boolean> => {
    if (microsoftAccounts.length === 0) {
      showError('No hay cuentas de Microsoft conectadas');
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Usar la primera cuenta conectada
      const account = microsoftAccounts[0];
      
      await replyToMicrosoftEmail({
        accessToken: account.accessToken,
        messageId,
        body
      });
      
      showSuccess('Respuesta enviada exitosamente');
      return true;
    } catch (error) {
      console.error('Error respondiendo correo:', error);
      setError('Error enviando la respuesta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Marcar correo como leído
  const markAsRead = async (messageId: string) => {
    if (microsoftAccounts.length === 0) return;

    try {
      const account = microsoftAccounts[0];
      
      await markMicrosoftEmailAsRead({
        accessToken: account.accessToken,
        messageId
      });
    } catch (error) {
      console.error('Error marcando correo como leído:', error);
    }
  };

  // Cargar mensajes cuando cambia el hilo activo
  useEffect(() => {
    if (activeThread) {
      loadMessages(activeThread);
    } else {
      setMessages([]);
      setChatMessages([]);
    }
  }, [activeThread]);

  // Recargar hilos cuando cambia el tab
  useEffect(() => {
    refreshThreads();
  }, [activeTab, activeMainTab]);

  const contextValue: MicrosoftInboxContextType = {
    threads,
    chatThreads,
    activeThread,
    messages,
    chatMessages,
    connectedAccounts: microsoftAccounts,
    loading,
    error,
    isUpdatingAccounts,
    isLoadingMessages,
    activeTab,
    activeMainTab,
    setActiveThread,
    setActiveTab,
    setActiveMainTab,
    refreshThreads,
    loadMessages,
    loadMessageDetails,
    sendEmail,
    replyToEmail,
    markAsRead,
    updateConnectedAccounts
  };

  return (
    <MicrosoftInboxContext.Provider value={contextValue}>
      {children}
    </MicrosoftInboxContext.Provider>
  );
}; 