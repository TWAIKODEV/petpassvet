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
  UserCircle,
  Wrench
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
    'UserCircle': <UserCircle size={20} />,
    'Wrench': <Wrench size={20} />
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
    title: 'Tools',
    href: '/tools',
    icon: 'Wrench',
    children: [
      { title: 'Integraciones', href: '/tools/integrations' },
      { title: 'Logs', href: '/tools/logs' }
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

export function AppSidebar() {
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

    if (hasChildren) {
      return (
        <SidebarMenuItem key={item.title}>
          <Collapsible 
            open={isExpanded} 
            onOpenChange={() => toggleExpanded(item.title)}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                {getIcon(item.icon)}
                <span>{item.title}</span>
                {isExpanded ? <ChevronDown className="ml-auto" size={16} /> : <ChevronRight className="ml-auto" size={16} />}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children?.map((child: {href: string, title: string}) => (
                  <SidebarMenuSubItem key={child.href}>
                    <SidebarMenuSubButton asChild>
                      <NavLink 
                        to={child.href}
                        className={({ isActive }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                      >
                        <span>{child.title}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink 
            to={item.href}
            className={({ isActive }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
          >
            {getIcon(item.icon)}
            <span>{item.title}</span>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Logo />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;