import axios from 'axios';
import { io, Socket } from 'socket.io-client';

// For Replit environment, use REPLIT_APP_URL or window.location.origin
const getWebSocketUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_REPLIT_APP_URL || 'http://localhost:4000';
};

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_REPLIT_APP_URL || 'http://localhost:4000';
const SOCKET_URL = getWebSocketUrl();

// Define message types
export interface UnifiedMessage {
  id: string;
  channel: 'whatsapp' | 'facebook' | 'instagram' | 'outlook' | 'sms' | 'typebot';
  threadId: string;
  externalId?: string;
  from: {
    id: string;
    name: string;
    handle: string;
    avatar?: string;
  };
  to: string[];
  timestamp: Date;
  type: 'text' | 'image' | 'email' | 'sms' | 'bot';
  content: {
    text: string;
    subject?: string;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
    botActions?: Array<{
      type: 'button' | 'input' | 'select';
      label: string;
      value?: string;
      options?: string[];
    }>;
  };
  status: 'read' | 'unread' | 'archived';
}

export interface Thread {
  id: string;
  channel: 'whatsapp' | 'facebook' | 'instagram' | 'outlook' | 'sms' | 'typebot';
  contact: {
    id: string;
    name: string;
    handle: string;
    avatar?: string;
    isRegistered?: boolean;
    clientDetails?: any;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
    isOutbound: boolean;
  };
  unreadCount: number;
}

// Mock data for development
const mockThreads: Thread[] = [
  {
    id: 'whatsapp-1',
    channel: 'whatsapp',
    contact: {
      id: 'contact-1',
      name: 'María García',
      handle: '+34666777888',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isRegistered: true,
      clientDetails: {
        id: '1',
        pet: {
          name: 'Luna',
          species: 'Perro',
          breed: 'Labrador',
          age: 3,
          sex: 'female'
        },
        lastVisit: '2025-05-01',
        nextVisit: '2025-06-15',
        visits: 12,
        petPass: true,
        healthPlan: 'Premium',
        insurance: {
          provider: 'PetSure',
          number: 'PS-123456'
        },
        billing: {
          totalSpent: 1250.00,
          lastPayment: {
            amount: 75.00,
            date: '2025-05-01',
            method: 'card'
          }
        },
        prescriptions: [
          {
            date: '2025-05-01',
            medication: 'Amoxicilina 250mg',
            duration: '7 días'
          },
          {
            date: '2025-04-15',
            medication: 'Meloxicam 1.5mg/ml',
            duration: '5 días'
          }
        ]
      }
    },
    lastMessage: {
      content: 'Buenos días, quisiera información sobre los servicios de peluquería canina.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      isOutbound: false
    },
    unreadCount: 1
  },
  {
    id: 'facebook-1',
    channel: 'facebook',
    contact: {
      id: 'contact-2',
      name: 'Carlos Rodríguez',
      handle: 'carlos.rodriguez.85',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isRegistered: false
    },
    lastMessage: {
      content: 'Hola! Vi en su página que tienen servicio de vacunación. ¿Qué vacunas recomiendan para un cachorro de 3 meses? 🐶',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      isOutbound: false
    },
    unreadCount: 1
  },
  {
    id: 'instagram-1',
    channel: 'instagram',
    contact: {
      id: 'contact-3',
      name: '@pet_lover_madrid',
      handle: 'pet_lover_madrid',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isRegistered: true,
      clientDetails: {
        id: '2',
        pet: {
          name: 'Milo',
          species: 'Gato',
          breed: 'Persa',
          age: 2,
          sex: 'male'
        },
        lastVisit: '2025-05-10',
        visits: 5,
        petPass: false,
        billing: {
          totalSpent: 450.00,
          lastPayment: {
            amount: 120.00,
            date: '2025-05-10',
            method: 'cash'
          }
        },
        prescriptions: [
          {
            date: '2025-05-10',
            medication: 'Antiparasitario',
            duration: 'Dosis única'
          }
        ]
      }
    },
    lastMessage: {
      content: '¿Cuál es el precio de la consulta veterinaria? Me gustaría llevar a mi gatito para su primera revisión 🐱',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isOutbound: false
    },
    unreadCount: 1
  },
  {
    id: 'outlook-1',
    channel: 'outlook',
    contact: {
      id: 'contact-4',
      name: 'Laura Martínez',
      handle: 'laura.martinez@example.com',
      isRegistered: true,
      clientDetails: {
        id: '3',
        pet: {
          name: 'Nala',
          species: 'Gato',
          breed: 'Siamés',
          age: 1,
          sex: 'female'
        },
        lastVisit: '2025-05-15',
        nextVisit: '2025-06-01',
        visits: 3,
        petPass: true,
        healthPlan: 'Basic',
        billing: {
          totalSpent: 280.00,
          lastPayment: {
            amount: 95.00,
            date: '2025-05-15',
            method: 'card'
          }
        },
        prescriptions: []
      }
    },
    lastMessage: {
      content: 'Estimados, adjunto los resultados de las pruebas anteriores de mi mascota para la consulta de mañana.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      isOutbound: false
    },
    unreadCount: 0
  },
  {
    id: 'sms-1',
    channel: 'sms',
    contact: {
      id: 'contact-5',
      name: 'Ana Sánchez',
      handle: '+34677888999',
      isRegistered: true,
      clientDetails: {
        id: '4',
        pet: {
          name: 'Max',
          species: 'Perro',
          breed: 'Golden Retriever',
          age: 4,
          sex: 'male'
        },
        lastVisit: '2025-05-18',
        nextVisit: '2025-05-25',
        visits: 8,
        petPass: true,
        healthPlan: 'Premium',
        insurance: {
          provider: 'VetProtect',
          number: 'VP-789012'
        },
        billing: {
          totalSpent: 890.00,
          lastPayment: {
            amount: 150.00,
            date: '2025-05-18',
            method: 'card'
          }
        },
        prescriptions: [
          {
            date: '2025-05-18',
            medication: 'Antiinflamatorio',
            duration: '5 días'
          }
        ]
      }
    },
    lastMessage: {
      content: 'Necesito cambiar mi cita de mañana para la próxima semana. ¿Tienen disponibilidad para el martes?',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      isOutbound: false
    },
    unreadCount: 0
  },
  {
    id: 'typebot-1',
    channel: 'typebot',
    contact: {
      id: 'contact-6',
      name: 'Asistente Virtual',
      handle: 'bot',
      isRegistered: false
    },
    lastMessage: {
      content: '¡Hola! Soy el asistente virtual de ClinicPro. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      isOutbound: true
    },
    unreadCount: 0
  }
];

// Mock messages for each thread
const mockMessages = {
  'whatsapp-1': [
    {
      id: 'msg-wa-1',
      channel: 'whatsapp',
      threadId: 'whatsapp-1',
      from: {
        id: 'contact-1',
        name: 'María García',
        handle: '+34666777888'
      },
      to: ['me'],
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      type: 'text',
      content: {
        text: 'Buenos días, quisiera información sobre los servicios de peluquería canina.'
      },
      status: 'unread'
    }
  ],
  'facebook-1': [
    {
      id: 'msg-fb-1',
      channel: 'facebook',
      threadId: 'facebook-1',
      from: {
        id: 'contact-2',
        name: 'Carlos Rodríguez',
        handle: 'carlos.rodriguez.85'
      },
      to: ['me'],
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      type: 'text',
      content: {
        text: 'Hola! Vi en su página que tienen servicio de vacunación. ¿Qué vacunas recomiendan para un cachorro de 3 meses? 🐶'
      },
      status: 'unread'
    }
  ],
  'instagram-1': [
    {
      id: 'msg-ig-1',
      channel: 'instagram',
      threadId: 'instagram-1',
      from: {
        id: 'contact-3',
        name: '@pet_lover_madrid',
        handle: 'pet_lover_madrid'
      },
      to: ['me'],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      type: 'text',
      content: {
        text: '¿Cuál es el precio de la consulta veterinaria? Me gustaría llevar a mi gatito para su primera revisión 🐱'
      },
      status: 'unread'
    }
  ],
  'outlook-1': [
    {
      id: 'msg-ol-1',
      channel: 'outlook',
      threadId: 'outlook-1',
      from: {
        id: 'contact-4',
        name: 'Laura Martínez',
        handle: 'laura.martinez@example.com'
      },
      to: ['me'],
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      type: 'email',
      content: {
        subject: 'Resultados de pruebas para consulta',
        text: 'Estimados,\n\nAdjunto los resultados de las pruebas anteriores de mi mascota para la consulta de mañana.\n\nSaludos cordiales,\nLaura Martínez'
      },
      status: 'read'
    }
  ],
  'sms-1': [
    {
      id: 'msg-sms-1',
      channel: 'sms',
      threadId: 'sms-1',
      from: {
        id: 'contact-5',
        name: 'Ana Sánchez',
        handle: '+34677888999'
      },
      to: ['me'],
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      type: 'sms',
      content: {
        text: 'Necesito cambiar mi cita de mañana para la próxima semana. ¿Tienen disponibilidad para el martes?'
      },
      status: 'read'
    }
  ],
  'typebot-1': [
    {
      id: 'msg-tb-1',
      channel: 'typebot',
      threadId: 'typebot-1',
      from: {
        id: 'me',
        name: 'ClinicPro',
        handle: 'bot'
      },
      to: ['contact-6'],
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      type: 'bot',
      content: {
        text: '¡Hola! Soy el asistente virtual de ClinicPro. ¿En qué puedo ayudarte hoy?',
        botActions: [
          {
            type: 'button',
            label: 'Solicitar cita',
            value: 'Quiero solicitar una cita'
          },
          {
            type: 'button',
            label: 'Información de servicios',
            value: 'Necesito información sobre servicios'
          },
          {
            type: 'button',
            label: 'Hablar con un humano',
            value: 'Prefiero hablar con un humano'
          }
        ]
      },
      status: 'read'
    }
  ]
};

// Singleton class for inbox service
class InboxService {
  private static instance: InboxService;
  private socket: Socket | null = null;
  private apiUrl: string;
  private socketUrl: string;
  private token: string | null = null;
  private messageListeners: Array<(message: UnifiedMessage) => void> = [];
  private threadListeners: Array<(threads: Thread[]) => void> = [];
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  private constructor() {
    this.apiUrl = API_URL;
    this.socketUrl = SOCKET_URL;
  }

  public static getInstance(): InboxService {
    if (!InboxService.instance) {
      InboxService.instance = new InboxService();
    }
    return InboxService.instance;
  }

  private async waitForConnection(socket: Socket, timeout: number = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve(false);
      }, timeout);

      socket.once('connect', () => {
        clearTimeout(timer);
        resolve(true);
      });
    });
  }

  public async connectSocket(): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting) {
      console.log('Socket.IO connection already in progress');
      return this.socket as Socket;
    }

    this.isConnecting = true;

    try {
      console.log('Connecting to Socket.IO:', this.socketUrl);
      
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }

      this.socket = io(this.socketUrl, {
        path: '/socket.io',
        transports: ['websocket'],
        timeout: 20000,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        auth: {
          token: this.token
        },
        withCredentials: true
      });

      const connected = await this.waitForConnection(this.socket);
      
      if (!connected) {
        throw new Error('Connection timeout');
      }

      this.socket.on('connect', () => {
        console.log('Socket.IO connected successfully');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
      });

      this.socket.on('new_message', (data) => {
        try {
          this.messageListeners.forEach(listener => listener(data));
        } catch (error) {
          console.error('Error handling new message event:', error);
        }
      });

      this.socket.on('threads_updated', (data) => {
        try {
          this.threadListeners.forEach(listener => listener(data));
        } catch (error) {
          console.error('Error handling threads updated event:', error);
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        this.isConnecting = false;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Running in development mode - continuing with mock data');
          this.threadListeners.forEach(listener => listener(mockThreads));
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.warn(`Socket.IO disconnected: ${reason}`);
        this.isConnecting = false;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          this.reconnectDelay *= 2; // Exponential backoff
          setTimeout(() => {
            console.log(`Attempting to reconnect (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            this.connectSocket();
          }, this.reconnectDelay);
        } else {
          console.log('Max reconnection attempts reached, falling back to polling');
          // Fall back to regular polling for updates
          this.startPolling();
        }
      });

      return this.socket;
    } catch (error) {
      console.error('Error creating Socket.IO connection:', error);
      this.isConnecting = false;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Running in development mode - continuing with mock data');
        this.threadListeners.forEach(listener => listener(mockThreads));
      }
      
      // Start polling as fallback
      this.startPolling();
      
      throw error;
    }
  }

  private startPolling() {
    // Implement polling fallback
    const pollInterval = 10000; // Poll every 10 seconds
    
    setInterval(async () => {
      try {
        const threads = await this.getThreads();
        this.threadListeners.forEach(listener => listener(threads));
      } catch (error) {
        console.error('Error polling for updates:', error);
      }
    }, pollInterval);
  }

  public async getThreads(): Promise<Thread[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return Promise.resolve(mockThreads);
      }
      
      const response = await axios.get(`${this.apiUrl}/threads`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching threads:', error);
      
      if (process.env.NODE_ENV === 'development') {
        return Promise.resolve(mockThreads);
      }
      
      throw new Error('No se pudieron cargar los hilos. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  public async getMessages(threadId: string, page: number = 1, limit: number = 50): Promise<UnifiedMessage[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return Promise.resolve(mockMessages[threadId] || []);
      }
      
      const response = await axios.get(`${this.apiUrl}/threads/${threadId}/messages?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      
      if (process.env.NODE_ENV === 'development') {
        return Promise.resolve(mockMessages[threadId] || []);
      }
      
      throw new Error('No se pudieron cargar los mensajes. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  public async sendMessage(threadId: string, channel: string, content: { text: string, subject?: string }): Promise<UnifiedMessage | null> {
    try {
      if (process.env.NODE_ENV === 'development') {
        const newMessage = {
          id: `msg-${Date.now()}`,
          channel: channel as any,
          threadId: threadId,
          from: {
            id: 'me',
            name: 'Me',
            handle: ''
          },
          to: [mockThreads.find(t => t.id === threadId)?.contact.handle || ''],
          timestamp: new Date(),
          type: 'text' as any,
          content,
          status: 'sent' as any
        };
        
        if (!mockMessages[threadId]) {
          mockMessages[threadId] = [];
        }
        mockMessages[threadId].push(newMessage);
        
        const threadIndex = mockThreads.findIndex(t => t.id === threadId);
        if (threadIndex !== -1) {
          mockThreads[threadIndex] = {
            ...mockThreads[threadIndex],
            lastMessage: {
              content: content.text,
              timestamp: new Date(),
              isOutbound: true
            }
          };
        }
        
        if (threadId === 'typebot-1') {
          setTimeout(() => {
            let botResponse;
            
            if (content.text.toLowerCase().includes('cita')) {
              botResponse = {
                id: `msg-${Date.now() + 1}`,
                channel: 'typebot',
                threadId: 'typebot-1',
                from: {
                  id: 'typebot',
                  name: 'Asistente Virtual',
                  handle: 'bot'
                },
                to: ['me'],
                timestamp: new Date(),
                type: 'bot',
                content: {
                  text: 'Para solicitar una cita, necesito algunos datos. ¿Para qué tipo de servicio necesitas la cita?',
                  botActions: [
                    {
                      type: 'button',
                      label: 'Consulta veterinaria',
                      value: 'Consulta veterinaria'
                    },
                    {
                      type: 'button',
                      label: 'Peluquería',
                      value: 'Peluquería'
                    },
                    {
                      type: 'button',
                      label: 'Vacunación',
                      value: 'Vacunación'
                    }
                  ]
                },
                status: 'unread'
              };
            } else if (content.text.toLowerCase().includes('servicio')) {
              botResponse = {
                id: `msg-${Date.now() + 1}`,
                channel: 'typebot',
                threadId: 'typebot-1',
                from: {
                  id: 'typebot',
                  name: 'Asistente Virtual',
                  handle: 'bot'
                },
                to: ['me'],
                timestamp: new Date(),
                type: 'bot',
                content: {
                  text: 'Ofrecemos los siguientes servicios:',
                  botActions: []
                },
                status: 'unread'
              };
              
              setTimeout(() => {
                const servicesList = {
                  id: `msg-${Date.now() + 2}`,
                  channel: 'typebot',
                  threadId: 'typebot-1',
                  from: {
                    id: 'typebot',
                    name: 'Asistente Virtual',
                    handle: 'bot'
                  },
                  to: ['me'],
                  timestamp: new Date(),
                  type: 'bot',
                  content: {
                    text: '• Consultas veterinarias\n• Vacunaciones\n• Peluquería canina y felina\n• Cirugía\n• Análisis clínicos\n• Hospitalización\n\n¿Sobre cuál te gustaría más información?',
                    botActions: [
                      {
                        type: 'select',
                        label: 'Selecciona un servicio',
                        options: ['Consultas', 'Vacunaciones', 'Peluquería', 'Cirugía', 'Análisis', 'Hospitalización']
                      }
                    ]
                  },
                  status: 'unread'
                };
                
                mockMessages[threadId].push(servicesList);
                this.messageListeners.forEach(listener => listener(servicesList as any));
              }, 1000);
            } else if (content.text.toLowerCase().includes('humano')) {
              botResponse = {
                id: `msg-${Date.now() + 1}`,
                channel: 'typebot',
                threadId: 'typebot-1',
                from: {
                  id: 'typebot',
                  name: 'Asistente Virtual',
                  handle: 'bot'
                },
                to: ['me'],
                timestamp: new Date(),
                type: 'bot',
                content: {
                  text: 'Entiendo que prefieres hablar con un humano. Por favor, déjame tu nombre y número de teléfono para que un miembro de nuestro equipo se ponga en contacto contigo lo antes posible.',
                  botActions: [
                    {
                      type: 'input',
                      label: 'Nombre completo'
                    }
                  ]
                },
                status: 'unread'
              };
            } else {
              botResponse = {
                id: `msg-${Date.now() + 1}`,
                channel: 'typebot',
                threadId: 'typebot-1',
                from: {
                  id: 'typebot',
                  name: 'Asistente Virtual',
                  handle: 'bot'
                },
                to: ['me'],
                timestamp: new Date(),
                type: 'bot',
                content: {
                  text: 'Lo siento, no he entendido tu consulta. ¿Podrías seleccionar una de estas opciones?',
                  botActions: [
                    {
                      type: 'button',
                      label: 'Solicitar cita',
                      value: 'Quiero solicitar una cita'
                    },
                    {
                      type: 'button',
                      label: 'Información de servicios',
                      value: 'Necesito información sobre servicios'
                    },
                    {
                      type: 'button',
                      label: 'Hablar con un humano',
                      value: 'Prefiero hablar con un humano'
                    }
                  ]
                },
                status: 'unread'
              };
            }
            
            mockMessages[threadId].push(botResponse);
            this.messageListeners.forEach(listener => listener(botResponse as any));
          }, 1000);
        }
        
        return newMessage;
      }
      
      const response = await axios.post(`${this.apiUrl}/send`, {
        threadId,
        channel,
        content
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('No se pudo enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  public async markThreadAsRead(threadId: string): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development') {
        const threadIndex = mockThreads.findIndex(t => t.id === threadId);
        if (threadIndex !== -1) {
          mockThreads[threadIndex] = {
            ...mockThreads[threadIndex],
            unreadCount: 0
          };
        }
        
        if (mockMessages[threadId]) {
          mockMessages[threadId] = mockMessages[threadId].map(msg => ({
            ...msg,
            status: 'read'
          }));
        }
        
        return Promise.resolve(true);
      }
      
      const response = await axios.put(`${this.apiUrl}/threads/${threadId}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Error marking thread as read:', error);
      return false;
    }
  }

  public async archiveThread(threadId: string): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development') {
        const threadIndex = mockThreads.findIndex(t => t.id === threadId);
        if (threadIndex !== -1) {
          mockThreads.splice(threadIndex, 1);
        }
        
        return Promise.resolve(true);
      }
      
      const response = await axios.put(`${this.apiUrl}/threads/${threadId}/archive`, {}, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Error archiving thread:', error);
      return false;
    }
  }

  public setToken(token: string) {
    this.token = token;
  }

  public onNewMessage(callback: (message: UnifiedMessage) => void) {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter(listener => listener !== callback);
    };
  }

  public onThreadsUpdated(callback: (threads: Thread[]) => void) {
    this.threadListeners.push(callback);
    return () => {
      this.threadListeners = this.threadListeners.filter(listener => listener !== callback);
    };
  }
}

export default InboxService.getInstance();