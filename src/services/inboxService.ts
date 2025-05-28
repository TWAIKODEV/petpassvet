import { api } from "../../convex/_generated/api";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "");

export interface Contact {
  _id: string;
  handle: string;
  channel: 'whatsapp' | 'facebook' | 'instagram' | 'outlook' | 'sms' | 'typebot';
  name: string;
  avatar?: string;
  isRegistered: boolean;
  patientId?: string;
  metadata?: any;
}

export interface Message {
  _id: string;
  threadId: string;
  contactId: string;
  content: string;
  timestamp: string;
  direction: 'incoming' | 'outgoing';
  channel: string;
  isRead: boolean;
  attachments?: Array<{
    type: string;
    url: string;
    name: string;
  }>;
}

export interface Thread {
  _id: string;
  contactId: string;
  title: string;
  lastMessageAt: string;
  isUnread: boolean;
  channel: string;
}

class InboxService {
  private convex: ConvexReactClient;

  constructor() {
    this.convex = convex;
  }

  async getThreads(): Promise<Thread[]> {
    try {
      return await this.convex.query(api.threads.list);
    } catch (error) {
      console.error('Error fetching threads:', error);
      return [];
    }
  }

  async getMessages(threadId: string): Promise<Message[]> {
    try {
      return await this.convex.query(api.messages.list, { threadId });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async sendMessage(threadId: string, content: string, contactId: string, channel: string): Promise<void> {
    try {
      await this.convex.mutation(api.messages.create, {
        threadId,
        contactId,
        content,
        direction: 'outgoing',
        channel,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await this.convex.mutation(api.messages.markAsRead, { id: messageId });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  async createThread(contactId: string, title: string, channel: string): Promise<string> {
    try {
      return await this.convex.mutation(api.threads.create, {
        contactId,
        title,
        channel,
      });
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  }
}

export const inboxService = new InboxService();