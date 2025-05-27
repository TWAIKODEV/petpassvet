
import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredModule?: string;
  requiredAction?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredModule,
  requiredAction,
  fallback
}) => {
  const { hasPermission, hasModuleAccess, isAdmin } = usePermissions();

  // Admin siempre tiene acceso
  if (isAdmin) {
    return <>{children}</>;
  }

  let hasAccess = false;

  if (requiredPermission) {
    hasAccess = hasPermission(requiredPermission);
  } else if (requiredModule) {
    hasAccess = hasModuleAccess(requiredModule, requiredAction);
  }

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-gray-500">
            Contacta con tu administrador si necesitas acceso.
          </p>
          {fallback}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
