import React from 'react';
import { Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useMicrosoftInbox } from '../../context/MicrosoftInboxContext';

const ConnectedAccountsPanel: React.FC = () => {
  const { 
    connectedAccounts, 
    isUpdatingAccounts, 
    updateConnectedAccounts 
  } = useMicrosoftInbox();

  if (connectedAccounts.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-yellow-600 mr-2" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              No hay cuentas conectadas
            </h3>
            <p className="text-sm text-yellow-700">
              Conecta una cuenta de Microsoft para ver tus correos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">
            Cuentas Conectadas
          </h3>
        </div>
        
        <button
          onClick={updateConnectedAccounts}
          disabled={isUpdatingAccounts}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          <RefreshCw size={14} className={`mr-1 ${isUpdatingAccounts ? 'animate-spin' : ''}`} />
          {isUpdatingAccounts ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
      
      <div className="space-y-2">
        {connectedAccounts.map((account) => (
          <div
            key={account._id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Mail size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {account.name}
                </p>
                <p className="text-xs text-gray-500">
                  {account.email || account.username}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              {account.connected ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-1" />
                  <span className="text-xs font-medium">Conectada</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle size={16} className="mr-1" />
                  <span className="text-xs font-medium">Desconectada</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {isUpdatingAccounts && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-center text-blue-700">
            <RefreshCw size={14} className="animate-spin mr-2" />
            <span className="text-xs">Actualizando datos de cuentas...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedAccountsPanel; 