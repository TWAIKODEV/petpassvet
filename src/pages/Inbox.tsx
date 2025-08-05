import React, { useState } from 'react';
import { 
  Filter, 
  RefreshCw,
  MessageSquare,
  Plus
} from 'lucide-react';

import Button from '../components/common/Button';
import { MicrosoftInboxProvider, useMicrosoftInbox } from '../context/MicrosoftInboxContext';
import MicrosoftThreadList from '../components/inbox/MicrosoftThreadList';
import MicrosoftMessageList from '../components/inbox/MicrosoftMessageList';
import MicrosoftMessageComposer from '../components/inbox/MicrosoftMessageComposer';
import ConnectedAccountsPanel from '../components/inbox/ConnectedAccountsPanel';
import MainTabs from '../components/inbox/MainTabs';

const InboxPage: React.FC = () => {
  return (
    <MicrosoftInboxProvider>
      <InboxContent />
    </MicrosoftInboxProvider>
  );
};

const InboxContent: React.FC = () => {
  const { 
    activeThread, 
    refreshThreads,
    loading,
    activeMainTab
  } = useMicrosoftInbox();

  const [showComposer, setShowComposer] = useState(false);

  const handleRefresh = () => {
    refreshThreads();
  };

  const handleNewEmail = () => {
    setShowComposer(true);
  };

  const handleCloseComposer = () => {
    setShowComposer(false);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bandeja de Entrada</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona tus correos de Microsoft y chats en un solo lugar
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
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
          
          {activeMainTab === 'emails' && (
            <Button
              variant="primary"
              icon={<Plus size={18} />}
              onClick={handleNewEmail}
            >
              Nuevo Correo
            </Button>
          )}
        </div>
      </div>

      {/* Connected Accounts Panel */}
      <ConnectedAccountsPanel />

      {/* Inbox Layout */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden mx-6 mb-6">
        <div className="flex h-full">
          {/* Thread List */}
          <div className="w-80 flex flex-col border-r border-gray-200">
            <MainTabs />
            <MicrosoftThreadList />
          </div>
          
          {/* Message Area */}
          <div className="hidden md:flex flex-col flex-1 min-w-0">
            {activeThread ? (
              <MicrosoftMessageList />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Selecciona una conversación
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Elige un {activeMainTab === 'emails' ? 'correo' : 'chat'} de la lista para ver la conversación completa
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nuevo Correo
              </h3>
              <button
                onClick={handleCloseComposer}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <MicrosoftMessageComposer onClose={handleCloseComposer} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxPage;