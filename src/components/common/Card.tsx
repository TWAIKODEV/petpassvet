import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClickHeader?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  footer,
  children,
  className = '',
  onClickHeader
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {(title || subtitle || icon) && (
        <div 
          className={`px-6 py-4 border-b border-gray-200 flex items-center ${onClickHeader ? 'cursor-pointer hover:bg-gray-50' : ''}`}
          onClick={onClickHeader}
        >
          {icon && <div className="mr-3 text-gray-500">{icon}</div>}
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;