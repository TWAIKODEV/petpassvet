import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from './Sidebar';
import Header from './Header';
import ToastContainer from '../common/ToastContainer';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

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
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  // Get current page title based on route
  const pageTitle = pageTitles[location.pathname] || 'ClinicPro';
  
  // Update document title
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);
  
  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="p-0 m-0 md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-0">
        <div className="flex flex-col h-full">
          <Header title={pageTitle} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarInset>
      
      {/* Toast Container */}
      <ToastContainer />
    </SidebarProvider>
  );
};

export default PageLayout;