import React from 'react';
import { Mail, Clock, User, MessageSquare } from 'lucide-react';
import { useMicrosoftInbox, ChatThread, MicrosoftThread } from '../../context/MicrosoftInboxContext';
import MicrosoftTabs from './MicrosoftTabs';

const MicrosoftThreadList: React.FC = () => {
  const { 
    threads, 
    chatThreads,
    activeThread, 
    setActiveThread, 
    loading, 
    error,
    activeTab,
    activeMainTab
  } = useMicrosoftInbox();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        );
      case 'telegram':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      default:
        return <MessageSquare size={20} className="text-gray-500" />;
    }
  };

  const getTabTitle = () => {
    if (activeMainTab === 'chats') {
      return 'Chats';
    }
    return activeTab === 'received' ? 'Correos Recibidos' : 'Correos Enviados';
  };

  const getEmptyMessage = () => {
    if (activeMainTab === 'chats') {
      return 'No hay chats disponibles';
    }
    return activeTab === 'received' 
      ? 'No hay correos recibidos'
      : 'No hay correos enviados';
  };

  const getEmptyDescription = () => {
    if (activeMainTab === 'chats') {
      return 'Los chats de redes sociales aparecerán aquí';
    }
    return activeTab === 'received'
      ? 'Conecta una cuenta de Microsoft para ver tus correos recibidos'
      : 'Los correos que envíes aparecerán aquí';
  };

  const getThreadsCount = () => {
    if (activeMainTab === 'chats') {
      return `${chatThreads.length} conversaciones`;
    }
    return `${threads.length} conversaciones`;
  };

  const getThreads = () => {
    return activeMainTab === 'chats' ? chatThreads : threads;
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{getTabTitle()}</h2>
          {activeMainTab === 'emails' && <MicrosoftTabs />}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{getTabTitle()}</h2>
          {activeMainTab === 'emails' && <MicrosoftTabs />}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare size={48} className="mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Error cargando datos</p>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const threadsToShow = getThreads();
  
  if (threadsToShow.length === 0) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{getTabTitle()}</h2>
          {activeMainTab === 'emails' && <MicrosoftTabs />}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Mail size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {getEmptyMessage()}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {getEmptyDescription()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{getTabTitle()}</h2>
        <p className="text-sm text-gray-500">{getThreadsCount()}</p>
        {activeMainTab === 'emails' && <MicrosoftTabs />}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {threadsToShow.map((thread) => {
          const isActive = activeThread === thread.id;
          
          if (activeMainTab === 'chats') {
            // Renderizar chat threads
            const chatThread = thread as ChatThread;
            const isUnread = chatThread.unreadCount > 0;
            
            return (
              <div
                key={chatThread.id}
                onClick={() => setActiveThread(chatThread.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                  isActive ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                {isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                )}
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getPlatformIcon(chatThread.platform)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium text-gray-900 truncate ${
                        isUnread ? 'font-bold' : ''
                      }`}>
                        {chatThread.contact}
                      </h3>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {formatDate(chatThread.lastActivity)}
                      </span>
                    </div>
                    
                    <p className={`text-sm font-medium text-gray-900 truncate mt-1 ${
                      isUnread ? 'font-bold text-blue-600' : ''
                    }`}>
                      {chatThread.lastMessage.content}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {chatThread.unreadCount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {chatThread.unreadCount}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 capitalize">
                          {chatThread.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            // Renderizar email threads
            const emailThread = thread as MicrosoftThread;
            const lastMessage = emailThread.lastMessage;
            const sender = lastMessage.from.emailAddress;
            const isUnread = emailThread.unreadCount > 0;
            
            return (
              <div
                key={thread.id}
                onClick={() => setActiveThread(thread.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                  isActive ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                {isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                )}
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {getInitials(sender.name || sender.address)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium text-gray-900 truncate ${
                        isUnread ? 'font-bold' : ''
                      }`}>
                        {activeTab === 'sent' ? 'Para: ' : ''}{sender.name || sender.address}
                      </h3>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {formatDate(lastMessage.receivedDateTime || lastMessage.sentDateTime || '')}
                      </span>
                    </div>
                    
                    <p className={`text-sm font-medium text-gray-900 truncate mt-1 ${
                      isUnread ? 'font-bold text-blue-600' : ''
                    }`}>
                      {emailThread.subject}
                    </p>
                    
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {lastMessage.bodyPreview}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {thread.unreadCount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {thread.unreadCount}
                          </span>
                        )}
                        {lastMessage.hasAttachments && (
                          <span className="text-gray-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <User size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {emailThread.participants.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default MicrosoftThreadList; 