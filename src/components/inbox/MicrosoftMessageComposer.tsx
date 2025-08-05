import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Send, Paperclip, X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useMicrosoftInbox } from '../../context/MicrosoftInboxContext';
import Button from '../common/Button';
import Input from '../common/Input';

interface MicrosoftMessageComposerProps {
  onClose?: () => void;
  replyTo?: {
    messageId: string;
    subject: string;
    toRecipients: string[];
  };
}

interface Recipient {
  email: string;
  name?: string;
}

interface Attachment {
  name: string;
  contentType: string;
  contentBytes: string;
}

const MicrosoftMessageComposer: React.FC<MicrosoftMessageComposerProps> = ({ 
  onClose,
  replyTo 
}) => {
  const { sendEmail, replyToEmail, loading } = useMicrosoftInbox();
  
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [toRecipients, setToRecipients] = useState<Recipient[]>(
    replyTo?.toRecipients.map(email => ({ email })) || []
  );
  const [ccRecipients, setCcRecipients] = useState<Recipient[]>([]);
  const [bccRecipients, setBccRecipients] = useState<Recipient[]>([]);
  const [newToRecipient, setNewToRecipient] = useState('');
  const [newCcRecipient, setNewCcRecipient] = useState('');
  const [newBccRecipient, setNewBccRecipient] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Extraer solo la parte base64 (remover el prefijo data:...)
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Función para convertir archivos a formato de adjuntos
  const convertAttachmentsToBase64 = async (files: File[]): Promise<Attachment[]> => {
    const attachments: Attachment[] = [];
    
    for (const file of files) {
      try {
        const contentBytes = await fileToBase64(file);
        attachments.push({
          name: file.name,
          contentType: file.type || 'application/octet-stream',
          contentBytes: contentBytes
        });
      } catch (error) {
        console.error('Error convirtiendo archivo:', error);
      }
    }
    
    return attachments;
  };

  const handleSend = useCallback(async () => {
    if (!subject.trim() || !body.trim() || toRecipients.length === 0) {
      return;
    }

    let success = false;
    
    if (replyTo) {
      success = await replyToEmail(replyTo.messageId, body);
    } else {
      // Convertir archivos a base64
      const attachmentData = await convertAttachmentsToBase64(attachments);
      
      success = await sendEmail(
        toRecipients.map(r => r.email),
        subject,
        body,
        ccRecipients.map(r => r.email),
        bccRecipients.map(r => r.email),
        attachmentData
      );
    }

    if (success) {
      setSubject('');
      setBody('');
      setToRecipients([]);
      setCcRecipients([]);
      setBccRecipients([]);
      setAttachments([]);
      setNewToRecipient('');
      setNewCcRecipient('');
      setNewBccRecipient('');
      onClose?.();
    }
  }, [subject, body, toRecipients, ccRecipients, bccRecipients, attachments, replyTo, replyToEmail, sendEmail, onClose]);

  const addRecipient = useCallback((
    recipientList: Recipient[], 
    setRecipientList: React.Dispatch<React.SetStateAction<Recipient[]>>,
    newRecipient: string,
    setNewRecipient: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (newRecipient.trim()) {
      const email = newRecipient.trim();
      const existing = recipientList.some(r => r.email === email);
      if (!existing) {
        setRecipientList([...recipientList, { email }]);
      }
      setNewRecipient('');
    }
  }, []);

  const removeRecipient = useCallback((recipient: Recipient, recipientList: Recipient[], setRecipientList: React.Dispatch<React.SetStateAction<Recipient[]>>) => {
    setRecipientList(recipientList.filter(r => r.email !== recipient.email));
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSend();
    }
  }, [handleSend]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const isSendDisabled = useMemo(() => {
    return loading || !subject.trim() || !body.trim() || toRecipients.length === 0;
  }, [loading, subject, body, toRecipients]);

  const RecipientChips = useCallback(({ 
    recipients, 
    setRecipients, 
    placeholder, 
    label,
    newRecipient,
    setNewRecipient
  }: {
    recipients: Recipient[];
    setRecipients: React.Dispatch<React.SetStateAction<Recipient[]>>;
    placeholder: string;
    label: string;
    newRecipient: string;
    setNewRecipient: React.Dispatch<React.SetStateAction<string>>;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}:
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {recipients.map((recipient, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {recipient.name || recipient.email}
            <button
              onClick={() => removeRecipient(recipient, recipients, setRecipients)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          type="email"
          placeholder={placeholder}
          value={newRecipient}
          onChange={(e) => setNewRecipient(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addRecipient(recipients, setRecipients, newRecipient, setNewRecipient)}
          className="flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => addRecipient(recipients, setRecipients, newRecipient, setNewRecipient)}
          disabled={!newRecipient.trim()}
        >
          <Plus size={14} />
        </Button>
      </div>
    </div>
  ), [addRecipient, removeRecipient]);

  return (
    <div className="bg-white border-t border-gray-200 p-6">
      <div className="space-y-4">
        {/* Destinatarios principales */}
        <RecipientChips
          recipients={toRecipients}
          setRecipients={setToRecipients}
          placeholder="Añadir destinatario..."
          label="Para"
          newRecipient={newToRecipient}
          setNewRecipient={setNewToRecipient}
        />

        {/* CC - Copia */}
        <div>
          <button
            onClick={() => setShowCc(!showCc)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-2"
          >
            {showCc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span className="ml-1">CC</span>
          </button>
          {showCc && (
            <RecipientChips
              recipients={ccRecipients}
              setRecipients={setCcRecipients}
              placeholder="Añadir copia..."
              label="Copia"
              newRecipient={newCcRecipient}
              setNewRecipient={setNewCcRecipient}
            />
          )}
        </div>

        {/* CCO - Copia oculta */}
        <div>
          <button
            onClick={() => setShowBcc(!showBcc)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800 mb-2"
          >
            {showBcc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span className="ml-1">CCO</span>
          </button>
          {showBcc && (
            <RecipientChips
              recipients={bccRecipients}
              setRecipients={setBccRecipients}
              placeholder="Añadir copia oculta..."
              label="Copia oculta"
              newRecipient={newBccRecipient}
              setNewRecipient={setNewBccRecipient}
            />
          )}
        </div>

        {/* Asunto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asunto:
          </label>
          <Input
            type="text"
            placeholder="Asunto del correo..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Archivos adjuntos */}
        {attachments.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivos adjuntos:
            </label>
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <Paperclip size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cuerpo del mensaje */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje:
          </label>
          <textarea
            rows={8}
            placeholder="Escribe tu mensaje aquí..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Presiona Ctrl+Enter para enviar
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={16} />
              <span className="text-sm">Adjuntar archivo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            {attachments.length > 0 && (
              <span className="text-xs text-gray-500">
                {attachments.length} archivo(s) adjunto(s)
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {onClose && (
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={isSendDisabled}
              icon={<Send size={16} />}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicrosoftMessageComposer; 