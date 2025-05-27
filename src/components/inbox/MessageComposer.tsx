import React, { useState } from 'react';
import { Send, Paperclip, Image, Smile } from 'lucide-react';
import Button from '../common/Button';
import { useInbox } from '../../context/InboxContext';

interface MessageComposerProps {
  threadId: string;
  channel: 'whatsapp' | 'facebook' | 'instagram' | 'outlook' | 'sms' | 'typebot';
}

const MessageComposer: React.FC<MessageComposerProps> = ({ threadId, channel }) => {
  const { sendMessage, error } = useInbox();
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;
    
    setIsLoading(true);
    
    try {
      const content = channel === 'outlook' 
        ? { text, subject: subject || `Re: Consulta` } 
        : { text };
      
      const success = await sendMessage(content);
      
      if (success) {
        setText('');
        if (channel === 'outlook') {
          setSubject('');
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // For typebot channel, we don't show the composer as it's bot-driven
  if (channel === 'typebot') {
    return (
      <div className="border-t border-gray-200 p-4 bg-white text-center">
        <p className="text-sm text-gray-500">Esta es una conversación automatizada con un bot.</p>
        <p className="text-sm text-gray-500">Por favor, interactúa con las opciones proporcionadas por el bot.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded">
          {error}
        </div>
      )}
      
      {channel === 'outlook' && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="Asunto"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      )}
      
      <div className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            rows={3}
            placeholder={`Escribe tu ${channel === 'outlook' ? 'email' : channel === 'sms' ? 'mensaje SMS' : 'mensaje'}...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-none"
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-500"
              disabled={channel === 'sms'} // SMS doesn't support attachments
            >
              <Paperclip size={20} />
            </button>
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-500"
              disabled={channel === 'sms'} // SMS doesn't support images
            >
              <Image size={20} />
            </button>
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-500"
              disabled={channel === 'outlook' || channel === 'sms'} // Email and SMS don't support emojis in the same way
            >
              <Smile size={20} />
            </button>
          </div>
        </div>
        <Button
          type="submit"
          variant="primary"
          icon={<Send size={18} />}
          isLoading={isLoading}
          disabled={!text.trim() || isLoading}
        >
          Enviar
        </Button>
      </div>
      
      {channel === 'sms' && (
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>Caracteres: {text.length}/160</span>
          {text.length > 160 && (
            <span className="text-yellow-600">
              Este mensaje se enviará como {Math.ceil(text.length / 160)} SMS
            </span>
          )}
        </div>
      )}
    </form>
  );
};

export default MessageComposer;