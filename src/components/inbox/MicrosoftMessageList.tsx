import React, { useState } from 'react';
import { Mail, Clock, Reply, Forward, Trash2, Paperclip, Download, X } from 'lucide-react';
import { useMicrosoftInbox, MicrosoftEmail } from '../../context/MicrosoftInboxContext';

const MicrosoftMessageList: React.FC = () => {
  const { 
    messages, 
    activeThread, 
    isLoadingMessages, 
    error,
    markAsRead,
    loadMessageDetails
  } = useMicrosoftInbox();

  const [previewAttachment, setPreviewAttachment] = useState<{
    attachment: NonNullable<MicrosoftEmail['attachments']>[0];
    messageId: string;
  } | null>(null);

  // Función para renderizar HTML de forma segura
  const renderHtmlContent = (htmlContent: string) => {
    return htmlContent;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return '🖼️';
    } else if (contentType.startsWith('video/')) {
      return '🎥';
    } else if (contentType.startsWith('audio/')) {
      return '🎵';
    } else if (contentType.includes('pdf')) {
      return '📄';
    } else if (contentType.includes('word') || contentType.includes('document')) {
      return '📝';
    } else if (contentType.includes('excel') || contentType.includes('spreadsheet')) {
      return '📊';
    } else if (contentType.includes('powerpoint') || contentType.includes('presentation')) {
      return '📈';
    } else if (contentType.includes('zip') || contentType.includes('rar')) {
      return '📦';
    } else {
      return '📎';
    }
  };

  const handleDownloadAttachment = (attachment: NonNullable<MicrosoftEmail['attachments']>[0]) => {
    if (attachment.contentBytes) {
      // Convertir base64 a blob
      const byteCharacters = atob(attachment.contentBytes);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: attachment.contentType });
      
      // Crear URL y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const handlePreviewAttachment = (attachment: NonNullable<MicrosoftEmail['attachments']>[0], messageId: string) => {
    setPreviewAttachment({ attachment, messageId });
  };

  const closePreview = () => {
    setPreviewAttachment(null);
  };

  const renderPreview = () => {
    if (!previewAttachment) return null;

    const { attachment } = previewAttachment;

    // Crear blob para la vista previa
    const byteCharacters = atob(attachment.contentBytes || '');
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: attachment.contentType });
    const url = window.URL.createObjectURL(blob);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getFileIcon(attachment.contentType)}</span>
              <h3 className="text-lg font-medium text-gray-900">{attachment.name}</h3>
              <span className="text-sm text-gray-500">({formatFileSize(attachment.size)})</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownloadAttachment(attachment)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Descargar archivo"
              >
                <Download size={16} />
              </button>
              <button
                onClick={closePreview}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Cerrar vista previa"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
            {attachment.contentType.startsWith('image/') ? (
              <div className="flex justify-center">
                <img 
                  src={url} 
                  alt={attachment.name}
                  className="max-w-full max-h-full object-contain"
                  onLoad={() => window.URL.revokeObjectURL(url)}
                />
              </div>
            ) : attachment.contentType.includes('pdf') ? (
              <iframe
                src={url}
                className="w-full h-[70vh] border-0"
                title={attachment.name}
                onLoad={() => window.URL.revokeObjectURL(url)}
              />
            ) : attachment.contentType.startsWith('text/') || attachment.contentType.includes('json') || attachment.contentType.includes('xml') ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto max-h-[70vh]">
                  {/* Aquí podrías mostrar el contenido del texto */}
                  Contenido del archivo: {attachment.name}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="text-6xl mb-4">{getFileIcon(attachment.contentType)}</span>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{attachment.name}</h4>
                <p className="text-gray-500 mb-4">{formatFileSize(attachment.size)}</p>
                <p className="text-sm text-gray-400 text-center">
                  Vista previa no disponible para este tipo de archivo.
                  <br />
                  Usa el botón de descarga para abrir el archivo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleMessageClick = (message: MicrosoftEmail) => {
    if (!message.isRead) {
      markAsRead(message.id);
    }
    
    // Cargar detalles del mensaje si tiene adjuntos pero no están cargados
    if (message.hasAttachments && (!message.attachments || message.attachments.length === 0)) {
      loadMessageDetails(message.id);
    }
  };

  if (!activeThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Mail size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Selecciona una conversación
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Elige un correo de la lista para ver la conversación completa
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Mail size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Error cargando mensajes
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Mail size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay mensajes
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron mensajes en esta conversación
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col bg-gray-50 h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-full">
          {messages.map((message) => {
            const sender = message.from.emailAddress;
            const isUnread = !message.isRead;
            
            return (
              <div
                key={message.id}
                onClick={() => handleMessageClick(message)}
                className={`bg-white rounded-lg shadow-sm border cursor-pointer transition-colors relative ${
                  isUnread ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {/* Línea indicadora de no leído */}
                {isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>
                )}
                
                <div className="flex items-start space-x-3 p-4">
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      isUnread ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <span className={`text-sm font-medium ${
                        isUnread ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {getInitials(sender.name || sender.address)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-medium text-gray-900 ${
                          isUnread ? 'font-bold' : ''
                        }`}>
                          {sender.name || sender.address}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {sender.address}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatDate(message.receivedDateTime)}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <Reply size={14} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <Forward size={14} />
                          </button>
                          <button className="text-gray-400 hover:text-red-600 p-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <h4 className={`text-sm font-medium text-gray-900 mb-2 ${
                        isUnread ? 'font-bold text-blue-600' : ''
                      }`}>
                        {message.subject || 'Sin asunto'}
                      </h4>
                    </div>
                    
                    {/* Archivos adjuntos mejorados */}
                    {message.hasAttachments && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Paperclip size={14} className="text-gray-400" />
                          {message.attachments && message.attachments.length > 0 ? (
                            <span className="text-xs font-medium text-gray-700">
                              Archivos adjuntos ({message.attachments.length})
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">
                              Adjuntos disponibles
                            </span>
                          )}
                        </div>
                        
                        {message.attachments && message.attachments.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={attachment.id || index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePreviewAttachment(attachment, message.id);
                                }}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-md border hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center space-x-2 min-w-0 flex-1">
                                  <span className="text-lg">{getFileIcon(attachment.contentType)}</span>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-gray-900 truncate">
                                      {attachment.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {formatFileSize(attachment.size)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 ml-2">
                                  {attachment.contentBytes && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadAttachment(attachment);
                                      }}
                                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                      title="Descargar archivo"
                                    >
                                      <Download size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              loadMessageDetails(message.id);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Cargar adjuntos
                          </button>
                        )}
                      </div>
                    )}
                    
                    {message.toRecipients.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Para:</span>
                          <div className="flex flex-wrap gap-1">
                            {message.toRecipients.map((recipient, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {recipient.emailAddress.name || recipient.emailAddress.address}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Cuerpo del correo sin scroll independiente */}
                <div className="border-t border-gray-100">
                  <div 
                    className="p-4 text-sm text-gray-700"
                    dangerouslySetInnerHTML={{ __html: renderHtmlContent(message.body.content) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Modal de vista previa */}
      {renderPreview()}
    </>
  );
};

export default MicrosoftMessageList; 