import React from 'react';
import { useInbox } from '../../context/InboxContext';
import { UnifiedMessage } from '../../services/inboxService';
import ChannelBadge from './ChannelBadge';
import Button from '../common/Button';

const MessageList: React.FC = () => {
  const { messages, activeThread, sendMessage, loading, error } = useInbox();

  if (!activeThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Selecciona una conversación para ver los mensajes</p>
        </div>
      </div>
    );
  }

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-4">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { [key: string]: UnifiedMessage[] } = {};
  
  messages.forEach(message => {
    const date = new Date(message.timestamp).toLocaleDateString('es-ES');
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  // Handle bot action click
  const handleBotActionClick = (action: any) => {
    if (action.value) {
      sendMessage({ text: action.value });
    }
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
              {date}
            </div>
          </div>
          
          <div className="space-y-4">
            {dateMessages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                onBotActionClick={handleBotActionClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface MessageBubbleProps {
  message: UnifiedMessage;
  onBotActionClick: (action: any) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onBotActionClick }) => {
  const isOutbound = message.from.id === 'me'; // Assuming 'me' is the ID for outbound messages
  
  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isOutbound ? 'bg-blue-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' : 'bg-white text-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg'} p-3 shadow`}>
        {!isOutbound && (
          <div className="flex items-center mb-1">
            <span className="text-xs font-medium text-gray-500">{message.from.name}</span>
            <div className="ml-2">
              <ChannelBadge channel={message.channel} size="sm" />
            </div>
          </div>
        )}
        
        {message.type === 'email' && message.content.subject && (
          <div className="mb-1 font-medium">{message.content.subject}</div>
        )}
        
        <div className={`${isOutbound ? 'text-white' : 'text-gray-800'}`}>
          {message.content.text}
        </div>
        
        {/* Bot actions (buttons, inputs, selects) */}
        {message.type === 'bot' && message.content.botActions && message.content.botActions.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.content.botActions.map((action, index) => {
              if (action.type === 'button') {
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onBotActionClick(action)}
                    className="mr-2 bg-white hover:bg-gray-50"
                  >
                    {action.label}
                  </Button>
                );
              } else if (action.type === 'select') {
                return (
                  <div key={index} className="mt-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {action.label}
                    </label>
                    <select 
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      onChange={(e) => onBotActionClick({ ...action, value: e.target.value })}
                    >
                      <option value="">Seleccionar...</option>
                      {action.options?.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                );
              } else if (action.type === 'input') {
                return (
                  <div key={index} className="mt-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {action.label}
                    </label>
                    <div className="flex">
                      <input 
                        type="text" 
                        className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        placeholder={action.label}
                        id={`bot-input-${index}`}
                      />
                      <button
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                        onClick={() => {
                          const input = document.getElementById(`bot-input-${index}`) as HTMLInputElement;
                          onBotActionClick({ ...action, value: input.value });
                          input.value = '';
                        }}
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
        
        <div className={`text-xs mt-1 text-right ${isOutbound ? 'text-blue-200' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageList;