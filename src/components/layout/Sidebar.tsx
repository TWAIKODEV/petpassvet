import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NavItem } from '../../types';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Mail, 
  ShoppingCart,
  Stethoscope,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  LogOut,
  Target,
  Building2,
  Package,
  Pill,
  Globe,
  Megaphone,
  AtSign,
  Share2,
  MessageSquare,
  PawPrint,
  FileText,
  Scissors,
  ShoppingBag,
  Calculator,
  DollarSign,
  Landmark,
  PieChart,
  TruckIcon,
  UserCircle
} from 'lucide-react';
import Logo from './Logo';

const getIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    'LayoutDashboard': <LayoutDashboard size={20} />,
    'Calendar': <Calendar size={20} />,
    'Users': <Users size={20} />,
    'CreditCard': <CreditCard size={20} />,
    'BarChart3': <BarChart3 size={20} />,
    'Settings': <Settings size={20} />,
    'Mail': <Mail size={20} />,
    'ShoppingCart': <ShoppingCart size={20} />,
    'Stethoscope': <Stethoscope size={20} />,
    'Target': <Target size={20} />,
    'Building2': <Building2 size={20} />,
    'Package': <Package size={20} />,
    'Pill': <Pill size={20} />,
    'Globe': <Globe size={20} />,
    'Megaphone': <Megaphone size={20} />,
    'AtSign': <AtSign size={20} />,
    'Share2': <Share2 size={20} />,
    'MessageSquare': <MessageSquare size={20} />,
    'PawPrint': <PawPrint size={20} />,
    'FileText': <FileText size={20} />,
    'Scissors': <Scissors size={20} />,
    'ShoppingBag': <ShoppingBag size={20} />,
    'Calculator': <Calculator size={20} />,
    'DollarSign': <DollarSign size={20} />,
    'Landmark': <Landmark size={20} />,
    'PieChart': <PieChart size={20} />,
    'TruckIcon': <TruckIcon size={20} />,
    'UserCircle': <UserCircle size={20} />
  };

  return icons[iconName] || <div className="w-5 h-5" />;
};

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard'
  },
  {
    title: 'Inbox',
    href: '/inbox',
    icon: 'MessageSquare'
  },
  {
    title: 'Oportunidades',
    href: '/oportunidades',
    icon: 'Target',
    children: [
      { title: 'Leads', href: '/oportunidades/leads' },
      { title: 'Funnel Ventas', href: '/oportunidades/funnel-ventas' }
    ]
  },
  {
    title: 'Agenda',
    href: '/agenda',
    icon: 'Calendar',
    children: [
      { title: 'Citas', href: '/agenda/citas' },
      { title: 'Calendario', href: '/agenda/calendario' }
    ]
  },
  {
    title: 'Clientes',
    href: '/clientes',
    icon: 'Users',
    children: [
      { title: 'Propietarios', href: '/clientes/propietarios' },
      { title: 'Mascotas', href: '/clientes/mascotas' }
    ]
  },
  {
    title: 'Consulta',
    href: '/consultorio',
    icon: 'Stethoscope',
    children: [
      { title: 'Citas', href: '/consultorio/citas' },
      { title: 'Cita', href: '/consultorio' },
      { title: 'Historiales', href: '/consultorio/historiales' },
      { title: 'Tratamientos', href: '/consultorio/tratamientos' },
      { title: 'Medicamentos', href: '/consultorio/medicamentos' },
      { title: 'Recetas', href: '/consultorio/recetas' },
      { title: 'Nueva Receta', href: '/dashboard/new-prescription' }
    ]
  },
  {
    title: 'Peluquería',
    href: '/peluqueria',
    icon: 'Scissors',
    children: [
      { title: 'Citas', href: '/peluqueria/citas' },
      { title: 'Historiales', href: '/peluqueria/historiales' },
      { title: 'Tratamientos', href: '/peluqueria/tratamientos' }
    ]
  },
  {
    title: 'Tienda',
    href: '/tienda',
    icon: 'ShoppingBag',
    children: [
      { title: 'Dashboard', href: '/tienda' },
      { title: 'Productos', href: '/tienda/productos' },
      { title: 'Inventario', href: '/tienda/inventario' },
      { title: 'Pedidos', href: '/tienda/pedidos' }
    ]
  },
  {
    title: 'Ventas',
    href: '/ventas',
    icon: 'ShoppingCart',
    children: [
      { title: 'Caja', href: '/ventas' },
      { title: 'Facturas', href: '/ventas/facturas' },
      { title: 'Presupuestos', href: '/ventas/presupuestos' }
    ]
  },
  {
    title: 'Compras',
    href: '/compras',
    icon: 'TruckIcon',
    children: [
      { title: 'Proveedores', href: '/compras/proveedores' },
      { title: 'Productos & Servicios', href: '/compras/productos-servicios' },
      { title: 'Inventario', href: '/compras/inventario' },
      { title: 'Pedidos', href: '/compras/pedidos' }
    ]
  },
  {
    title: 'Marketing',
    href: '/marketing',
    icon: 'Megaphone',
    children: [
      { title: 'Web', href: '/marketing/web' },
      { title: 'Campañas MK', href: '/marketing/campanas' },
      { title: 'Redes Sociales', href: '/marketing/redes-sociales' }
    ]
  },
  {
    title: 'RRHH',
    href: '/rrhh',
    icon: 'Users',
    children: [
      { title: 'Mi Perfil', href: '/rrhh/mi-perfil' },
      { title: 'Control de Horario', href: '/rrhh/control-horario' },
      { title: 'Registrar Entrada/Salida', href: '/rrhh/registrar-entrada-salida' },
      { title: 'Personal', href: '/rrhh/personal' }
    ]
  },
  {
    title: 'ERP',
    href: '/erp',
    icon: 'Landmark',
    children: [
      { title: 'Tesorería', href: '/erp/tesoreria' },
      { title: 'Contabilidad', href: '/erp/contaplus' },
      { title: 'Impuestos', href: '/erp/impuestos' },
      { title: 'Asesorías', href: '/erp/asesorias' }
    ]
  },
  {
    title: 'Informes',
    href: '/informes',
    icon: 'PieChart',
    children: [
      { title: 'General', href: '/informes/general' },
      { title: 'Financieros', href: '/informes/financieros' }
    ]
  },
  {
    title: 'Administración',
    href: '/administracion',
    icon: 'Settings',
    children: [
      { title: 'Usuarios', href: '/administracion/usuarios' },
      { title: 'Configuración', href: '/administracion/configuracion' }
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobile, setIsOpen }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { logout } = useAuth();

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const renderNavItem = (item: NavItem) => {
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.title} className="mb-1">
        <NavLink
          to={item.href}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-900'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleExpanded(item.title);
            } else if (isMobile) {
              setIsOpen(false);
            }
          }}
        >
          <span className="mr-3">{getIcon(item.icon)}</span>
          <span className="flex-1">{item.title}</span>
          {hasChildren && (
            <span className="ml-auto">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </NavLink>

        {hasChildren && isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children.map(child => (
              <NavLink
                key={child.href}
                to={child.href}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                {child.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${!isMobile && 'lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Logo />
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {navItems.map(renderNavItem)}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;