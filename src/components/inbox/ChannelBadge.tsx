import React from 'react';
import { Mail, MessageSquare, Phone, Instagram, Facebook, Bot } from 'lucide-react';

interface ChannelBadgeProps {
  channel: 'whatsapp' | 'facebook' | 'instagram' | 'outlook' | 'sms' | 'typebot';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ChannelBadge: React.FC<ChannelBadgeProps> = ({ 
  channel, 
  size = 'md',
  showLabel = false
}) => {
  const channelConfig = {
    whatsapp: {
      icon: <MessageSquare size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />,
      label: 'WhatsApp',
      color: 'text-green-600 bg-green-100'
    },
    facebook: {
      icon: <Facebook size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />,
      label: 'Facebook',
      color: 'text-blue-800 bg-blue-100'
    },
    instagram: {
      icon: <Instagram size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />,
      label: 'Instagram',
      color: 'text-pink-600 bg-pink-100'
    },
    outlook: {
      icon: <Mail size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />,
      label: 'Email',
      color: 'text-blue-600 bg-blue-100'
    },
    sms: {
      icon: <Phone size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />,
      label: 'SMS',
      color: 'text-purple-600 bg-purple-100'
    },
    typebot: {
      icon: <Bot size={size === 'sm' ? 14 : size === 'md' ? 16 : 20} />,
      label: 'Typebot',
      color: 'text-teal-600 bg-teal-100'
    }
  };

  const config = channelConfig[channel];
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full ${config.color}`}>
      {config.icon}
      {showLabel && <span className="ml-1 text-xs font-medium">{config.label}</span>}
    </div>
  );
};

export default ChannelBadge;