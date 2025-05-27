import React, { useState } from 'react';
import { useInbox } from '../../context/InboxContext';
import { Thread } from '../../services/inboxService';
import ChannelBadge from './ChannelBadge';
import { Search, Filter, RefreshCw, Archive, UserCheck, UserX } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const ThreadList: React.FC = () => {
  const { 
    threads, 
    activeThread, 
    setActiveThread, 
    loading, 
    error, 
    refreshThreads, 
    archiveThread,
    viewClientInfo
  } = useInbox();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  // Filter threads based on search term and selected channel
  const filteredThreads = threads.filter(thread => {
    const matchesSearch = 
      thread.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.contact.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChannel = selectedChannel === 'all' || thread.channel === selectedChannel;
    
    return matchesSearch && matchesChannel;
  });

  const handleRefresh = () => {
    refreshThreads();
  };

  const handleArchive = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    archiveThread(threadId);
  };

  const handleClientClick = (e: React.MouseEvent, thread: Thread) => {
    e.stopPropagation();
    if (thread.contact.isRegistered && thread.contact.clientDetails) {
      viewClientInfo(thread.contact.clientDetails);
    }
  };

  // Format relative time (e.g., "2h ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'ahora';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }
    
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="w-full md:w-80 border-r border-gray-200 flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <Input
          placeholder="Buscar conversaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={18} />}
        />
        
        <div className="mt-3 flex justify-between">
          <select
            className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
          >
            <option value="all">Todos los canales</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="outlook">Email</option>
            <option value="sms">SMS</option>
            <option value="typebot">Typebot</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw size={16} />}
            onClick={handleRefresh}
          >
            Actualizar
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {loading && filteredThreads.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 p-4 text-center">
            <p className="text-gray-500 mb-2">No se encontraron conversaciones</p>
            <p className="text-sm text-gray-400">Intenta con otros términos de búsqueda o cambia el filtro de canal</p>
          </div>
        ) : (
          filteredThreads.map((thread) => (
            <ThreadItem 
              key={thread.id} 
              thread={thread} 
              isActive={thread.id === activeThread}
              onClick={() => setActiveThread(thread.id)}
              onArchive={(e) => handleArchive(thread.id, e)}
              onClientClick={(e) => handleClientClick(e, thread)}
              formatTime={formatRelativeTime}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface ThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
  onArchive: (e: React.MouseEvent) => void;
  onClientClick: (e: React.MouseEvent) => void;
  formatTime: (date: Date) => string;
}

const ThreadItem: React.FC<ThreadItemProps> = ({ 
  thread, 
  isActive, 
  onClick, 
  onArchive, 
  onClientClick,
  formatTime 
}) => {
  return (
    <div 
      className={`p-4 border-b border-gray-200 cursor-pointer ${
        isActive ? 'bg-blue-50' : thread.unreadCount > 0 ? 'bg-gray-50' : ''
      } hover:bg-gray-50`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 relative">
          {thread.contact.avatar ? (
            <img
              src={thread.contact.avatar}
              alt={thread.contact.name}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 font-medium">
                {thread.contact.name[0]}
              </span>
            </div>
          )}
          <div className="absolute -top-1 -right-1">
            <ChannelBadge channel={thread.channel} size="sm" />
          </div>
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-900 truncate">
                {thread.contact.name}
              </p>
              {thread.contact.isRegistered ? (
                <button
                  onClick={onClientClick}
                  className="ml-2 text-green-500 hover:text-green-600"
                  title="Cliente verificado - Ver información"
                >
                  <UserCheck size={16} />
                </button>
              ) : (
                <span className="ml-2 text-gray-400" title="No es cliente">
                  <UserX size={16} />
                </span>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-xs text-gray-500">
                {formatTime(thread.lastMessage.timestamp)}
              </span>
              <button 
                className="ml-2 text-gray-400 hover:text-gray-600"
                onClick={onArchive}
              >
                <Archive size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center">
            <p className="text-sm text-gray-500 truncate">
              {thread.lastMessage.isOutbound ? 'Tú: ' : ''}
              {thread.lastMessage.content}
            </p>
          </div>
          
          {thread.unreadCount > 0 && (
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {thread.unreadCount} {thread.unreadCount === 1 ? 'nuevo' : 'nuevos'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadList;