import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Pets from './pages/Pets';
import PatientProfile from './pages/patients/PatientProfile';
import Calendar from './pages/Calendar';
import Appointments from './pages/agenda/Appointments';
import Reports from './pages/Reports';
import Leads from './pages/oportunidades/Leads';
import FunnelVentas from './pages/oportunidades/FunnelVentas';
import Providers from './pages/clinic/Providers';
import ProviderProfile from './pages/clinic/ProviderProfile';
import ProductsServices from './pages/clinic/ProductsServices';
import Inventory from './pages/clinic/Inventory';
import Staff from './pages/clinic/Staff';
import Medications from './pages/clinic/Medications';
import Orders from './pages/clinic/Orders';
import GroomingAppointments from './pages/peluqueria/GroomingAppointments';
import GroomingHistory from './pages/peluqueria/GroomingHistory';
import GroomingTreatments from './pages/peluqueria/GroomingTreatments';
import Consultation from './pages/consultorio/Consultation';
import MedicalHistory from './pages/consultorio/MedicalHistory';
import Tratamientos from './pages/consultorio/Tratamientos';
import Inbox from './pages/Inbox';
import PageLayout from './components/layout/PageLayout';
import Placeholder from './components/common/Placeholder';
import Sales from './pages/finanzas/Sales';
import Invoices from './pages/finanzas/Invoices';
import Budgets from './pages/finanzas/Budgets';
import Prescriptions from './pages/finanzas/Prescriptions';
import CampañasMK from './pages/marketing/campanas/CampañasMK';
import WebDashboard from './pages/marketing/web/WebDashboard';
import SocialMediaDashboard from './pages/marketing/redes-sociales/SocialMediaDashboard';
import TiendaDashboard from './pages/tienda/Dashboard';
import TiendaInventory from './pages/tienda/Inventory';
import TiendaProducts from './pages/tienda/Products';
import Pedidos from './pages/tienda/Pedidos';
import Tesoreria from './pages/erp/Tesoreria';
import ContaPlus from './pages/erp/ContaPlus';
import Impuestos from './pages/erp/Impuestos';
import Asesorias from './pages/erp/Asesorias';
import General from './pages/informes/General';
import Financieros from './pages/informes/Financieros';
import MiPerfil from './pages/rrhh/MiPerfil';
import ControlHorario from './pages/rrhh/ControlHorario';
import RegistrarEntradaSalida from './pages/rrhh/RegistrarEntradaSalida';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <PageLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Agenda routes */}
            <Route path="agenda" element={<Calendar />} />
            <Route path="agenda/citas" element={<Appointments />} />
            <Route path="agenda/calendario" element={<Calendar />} />
            
            {/* Clients routes */}
            <Route path="clientes/propietarios" element={<Patients />} />
            <Route path="clientes/propietarios/:id" element={<PatientProfile />} />
            <Route path="clientes/mascotas" element={<Pets />} />
            
            {/* Opportunities routes */}
            <Route path="oportunidades" element={<Navigate to="/oportunidades/leads" replace />} />
            <Route path="oportunidades/leads" element={<Leads />} />
            <Route path="oportunidades/funnel-ventas" element={<FunnelVentas />} />
            
            {/* Consultorio routes */}
            <Route path="consultorio" element={<Consultation />} />
            <Route path="consultorio/historiales" element={<MedicalHistory />} />
            <Route path="consultorio/tratamientos" element={<Tratamientos />} />
            <Route path="consultorio/medicamentos" element={<Medications />} />
            <Route path="consultorio/recetas" element={<Prescriptions />} />
            
            {/* Peluquería routes */}
            <Route path="peluqueria" element={<GroomingAppointments />} />
            <Route path="peluqueria/citas" element={<GroomingAppointments />} />
            <Route path="peluqueria/historiales" element={<GroomingHistory />} />
            <Route path="peluqueria/tratamientos" element={<GroomingTreatments />} />
            
            {/* Tienda routes */}
            <Route path="tienda" element={<TiendaDashboard />} />
            <Route path="tienda/productos" element={<TiendaProducts />} />
            <Route path="tienda/inventario" element={<TiendaInventory />} />
            <Route path="tienda/pedidos" element={<Pedidos />} />
            
            {/* Sales routes */}
            <Route path="ventas" element={<Sales />} />
            <Route path="ventas/facturas" element={<Invoices />} />
            <Route path="ventas/presupuestos" element={<Budgets />} />
            
            {/* Compras routes */}
            <Route path="compras" element={<Providers />} />
            <Route path="compras/proveedores" element={<Providers />} />
            <Route path="compras/proveedores/:id" element={<ProviderProfile />} />
            <Route path="compras/productos-servicios" element={<ProductsServices />} />
            <Route path="compras/inventario" element={<Inventory />} />
            <Route path="compras/pedidos" element={<Orders />} />
            
            {/* Marketing routes */}
            <Route path="marketing" element={<WebDashboard />} />
            <Route path="marketing/web" element={<WebDashboard />} />
            <Route path="marketing/campanas" element={<CampañasMK />} />
            <Route path="marketing/redes-sociales" element={<SocialMediaDashboard />} />
            
            {/* RRHH routes */}
            <Route path="rrhh">
              <Route path="mi-perfil" element={<MiPerfil />} />
              <Route path="control-horario" element={<ControlHorario />} />
              <Route path="registrar-entrada-salida" element={<RegistrarEntradaSalida />} />
              <Route path="personal" element={<Staff />} />
            </Route>
            
            {/* ERP routes */}
            <Route path="erp">
              <Route path="tesoreria" element={<Tesoreria />} />
              <Route path="contaplus" element={<ContaPlus />} />
              <Route path="impuestos" element={<Impuestos />} />
              <Route path="asesorias" element={<Asesorias />} />
            </Route>
            
            {/* Informes routes */}
            <Route path="informes">
              <Route path="general" element={<General />} />
              <Route path="financieros" element={<Financieros />} />
            </Route>
            
            {/* Inbox route */}
            <Route path="inbox" element={<Inbox />} />
            
            {/* Administration routes */}
            <Route path="administracion" element={<Placeholder pageName="Administración" />} />
            <Route path="administracion/usuarios" element={<Placeholder pageName="Usuarios" />} />
            <Route path="administracion/configuracion" element={<Placeholder pageName="Configuración" />} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;