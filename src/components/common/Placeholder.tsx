import React from 'react';

interface PlaceholderProps {
  pageName: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ pageName }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Página de {pageName}</h2>
      <p className="text-gray-600">Esta página está en desarrollo. Pronto estará disponible.</p>
    </div>
  );
};

export default Placeholder;