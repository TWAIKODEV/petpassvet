import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, string> = {
  '/': 'Inicio',
  '/dashboard': 'Dashboard',
  '/agenda': 'Agenda',
  '/agenda/citas': 'Agenda - Citas',
  '/agenda/calendario': 'Agenda - Calendario',
  '/pacientes': 'Pacientes',
  '/oportunidades': 'Oportunidades',
  '/oportunidades/leads': 'Oportunidades - Leads',
  '/oportunidades/funnel-ventas': 'Oportunidades - Funnel Ventas',
  '/consultorio': 'Consultorio',
  '/consultorio/historiales': 'Historiales Médicos',
  '/consultorio/tratamientos': 'Tratamientos',
  '/peluqueria': 'Peluquería',
  '/peluqueria/citas': 'Peluquería - Citas',
  '/peluqueria/historiales': 'Peluquería - Historiales',
  '/peluqueria/tratamientos': 'Peluquería - Tratamientos',
  '/tienda': 'Tienda',
  '/tienda/productos': 'Tienda - Productos',
  '/tienda/inventario': 'Tienda - Inventario',
  '/tienda/pedidos': 'Tienda - Pedidos',
  '/ventas': 'Ventas',
  '/finanzas': 'Finanzas',
  '/finanzas/facturas': 'Facturas',
  '/finanzas/presupuestos': 'Presupuestos',
  '/finanzas/caja': 'Resumen de Caja',
  '/marketing': 'Marketing',
  '/marketing/web': 'Marketing - Web',
  '/marketing/campanas': 'Marketing - Campañas MK',
  '/marketing/redes-sociales': 'Marketing - Redes Sociales',
  '/administracion': 'Administración',
  '/administracion/usuarios': 'Administración - Usuarios',
  '/administracion/configuracion': 'Administración - Configuración',
  '/clinica/personal': 'Clínica - RRHH',
  '/rrhh/personal': 'RRHH - Personal',
  '/rrhh/mi-perfil': 'RRHH - Mi Perfil',
  '/rrhh/control-horario': 'RRHH - Control de Horario',
  '/rrhh/registrar-entrada-salida': 'RRHH - Registrar Entrada/Salida',
};

const PageLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  // Get current page title based on route
  const pageTitle = pageTitles[location.pathname] || 'ClinicPro';
  
  // Update document title
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);
  
  // Check if mobile on mount and when window resizes
  const checkIfMobile = useCallback(() => {
    const isMobileView = window.innerWidth < 768;
    setIsMobile(isMobileView);
    setIsSidebarOpen(!isMobileView);
  }, []);
  
  useEffect(() => {
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      clearTimeout(timer);
    };
  }, [checkIfMobile]);
  
  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        isMobile={isMobile} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={toggleSidebar} title={pageTitle} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;