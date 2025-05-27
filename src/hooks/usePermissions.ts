
import { useAuth } from '../context/AuthContext';
import { Permission } from '../types';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permissionId: string): boolean => {
    if (!user) return false;
    
    // Admin siempre tiene todos los permisos
    if (user.role.name === 'admin') return true;
    
    // Verificar permisos personalizados primero
    const permissions = user.customPermissions || user.role.permissions;
    return permissions.some(permission => permission.id === permissionId);
  };

  const hasModuleAccess = (module: string, action?: string): boolean => {
    if (!user) return false;
    
    // Admin siempre tiene acceso
    if (user.role.name === 'admin') return true;
    
    const permissions = user.customPermissions || user.role.permissions;
    
    if (action) {
      return permissions.some(permission => 
        permission.module === module && permission.action === action
      );
    } else {
      return permissions.some(permission => permission.module === module);
    }
  };

  const canViewModule = (module: string): boolean => {
    return hasModuleAccess(module, 'view') || hasModuleAccess(module);
  };

  const canCreateInModule = (module: string): boolean => {
    return hasModuleAccess(module, 'create');
  };

  const canEditInModule = (module: string): boolean => {
    return hasModuleAccess(module, 'edit');
  };

  const canDeleteInModule = (module: string): boolean => {
    return hasModuleAccess(module, 'delete');
  };

  const canManageModule = (module: string): boolean => {
    return hasModuleAccess(module, 'manage');
  };

  const getUserPermissions = (): Permission[] => {
    if (!user) return [];
    return user.customPermissions || user.role.permissions;
  };

  return {
    hasPermission,
    hasModuleAccess,
    canViewModule,
    canCreateInModule,
    canEditInModule,
    canDeleteInModule,
    canManageModule,
    getUserPermissions,
    userRole: user?.role.name,
    isAdmin: user?.role.name === 'admin'
  };
};
