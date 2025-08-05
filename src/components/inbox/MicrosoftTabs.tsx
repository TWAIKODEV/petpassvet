import React from 'react';
import { Inbox, Send } from 'lucide-react';
import { useMicrosoftInbox } from '../../context/MicrosoftInboxContext';

const MicrosoftTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useMicrosoftInbox();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'received'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Inbox size={16} className="mr-2" />
          Recibidos
        </button>
        
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'sent'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Send size={16} className="mr-2" />
          Enviados
        </button>
      </div>
    </div>
  );
};

export default MicrosoftTabs; 