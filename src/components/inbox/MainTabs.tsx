import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { useMicrosoftInbox } from '../../context/MicrosoftInboxContext';

const MainTabs: React.FC = () => {
  const { activeMainTab, setActiveMainTab } = useMicrosoftInbox();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex">
        <button
          onClick={() => setActiveMainTab('emails')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeMainTab === 'emails'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Mail size={16} className="mr-2" />
          Correos
        </button>
        
        <button
          onClick={() => setActiveMainTab('chats')}
          className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeMainTab === 'chats'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MessageSquare size={16} className="mr-2" />
          Chats
        </button>
      </div>
    </div>
  );
};

export default MainTabs; 