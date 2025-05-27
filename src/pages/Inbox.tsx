import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RefreshCw,
  Mail,
  MessageSquare,
  Phone,
  Instagram,
  Facebook,
  AtSign,
  Send,
  Paperclip,
  Image,
  Smile,
  MoreVertical,
  UserCheck,
  UserX,
  Calendar,
  DollarSign,
  X,
  Pill,
  Clock,
  FileText,
  Bot
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { InboxProvider, useInbox } from '../context/InboxContext';
import ChannelBadge from '../components/inbox/ChannelBadge';
import ThreadList from '../components/inbox/ThreadList';
import MessageList from '../components/inbox/MessageList';
import MessageComposer from '../components/inbox/MessageComposer';
import ClientInfoPanel from '../components/inbox/ClientInfoPanel';

const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const [showClientInfo, setShowClientInfo] = useState(false);

  return (
    <InboxProvider>
      <InboxContent 
        showClientInfo={showClientInfo}
        setShowClientInfo={setShowClientInfo}
        navigate={navigate}
      />
    </InboxProvider>
  );
};

interface InboxContentProps {
  showClientInfo: boolean;
  setShowClientInfo: (show: boolean) => void;
  navigate: any;
}

const InboxContent: React.FC<InboxContentProps> = ({ 
  showClientInfo, 
  setShowClientInfo,
  navigate
}) => {
  const { 
    threads, 
    activeThread, 
    clientInfo,
    viewClientInfo
  } = useInbox();

  const activeThreadData = threads.find(t => t.id === activeThread);

  const handleViewClientInfo = () => {
    if (activeThreadData?.contact.isRegistered && activeThreadData?.contact.clientDetails) {
      viewClientInfo(activeThreadData.contact.clientDetails);
      setShowClientInfo(true);
    }
  };

  const handleCloseClientInfo = () => {
    setShowClientInfo(false);
    viewClientInfo(null);
  };

  const handleViewFullProfile = (clientId: string) => {
    navigate(`/pacientes/${clientId}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bandeja de Entrada</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona todas tus conversaciones en un solo lugar
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            icon={<Filter size={18} />}
          >
            Filtros
          </Button>
          
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Inbox Layout */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden min-h-0">
        <div className="flex h-full">
          {/* Thread List */}
          <ThreadList />
          
          {/* Message Area */}
          <div className="hidden md:flex flex-col flex-1 min-w-0">
            {activeThread ? (
              <>
                {/* Conversation Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {activeThreadData?.contact.avatar ? (
                      <img
                        src={activeThreadData.contact.avatar}
                        alt={activeThreadData.contact.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {activeThreadData?.contact.name[0]}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">
                          {activeThreadData?.contact.name}
                        </h3>
                        {activeThreadData?.contact.isRegistered ? (
                          <button
                            onClick={handleViewClientInfo}
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
                        <div className="ml-2">
                          <ChannelBadge channel={activeThreadData?.channel || 'whatsapp'} size="sm" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {activeThreadData?.contact.handle}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {activeThreadData?.channel === 'whatsapp' && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Phone size={16} />}
                        className="mr-2"
                      >
                        Llamar
                      </Button>
                    )}
                    
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Message List */}
                <MessageList />
                
                {/* Message Composer */}
                <MessageComposer 
                  threadId={activeThread} 
                  channel={activeThreadData?.channel || 'whatsapp'}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Selecciona una conversación
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Elige un mensaje de la lista para ver la conversación completa
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Client Info Panel */}
          {showClientInfo && clientInfo && (
            <ClientInfoPanel 
              clientInfo={clientInfo}
              onClose={handleCloseClientInfo}
              onViewFullProfile={handleViewFullProfile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxPage;