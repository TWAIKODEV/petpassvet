import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InboxProvider } from './context/InboxContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/agenda/Appointments';
import Inbox from './pages/Inbox';
import Calendar from './pages/Calendar';
import Pets from './pages/Pets';
import Reports from './pages/Reports';
import Opportunities from './pages/Opportunities';
import PatientProfile from './pages/patients/PatientProfile';
import Consultation from './pages/consultorio/Consultation';
import ConsultationAppointments from './pages/consultorio/ConsultationAppointments';
import MedicalHistory from './pages/consultorio/MedicalHistory';
import Inventory from './pages/clinic/Inventory';
import Orders from './pages/clinic/Orders';
import Providers from './pages/clinic/Providers';
import ProviderProfile from './pages/clinic/ProviderProfile';
import Staff from './pages/clinic/Staff';
import Medications from './pages/clinic/Medications';
import ProductsServices from './pages/clinic/ProductsServices';
import Contabilidad from './pages/clinic/Contabilidad';
import Medicamentos from './pages/consultorio/Medicamentos';
import Tratamientos from './pages/consultorio/Tratamientos';
import Budgets from './pages/finanzas/Budgets';
import Invoices from './pages/finanzas/Invoices';
import Sales from './pages/finanzas/Sales';
import Prescriptions from './pages/finanzas/Prescriptions';
import General from './pages/informes/General';
import Financieros from './pages/informes/Financieros';
import GroomingAppointments from './pages/peluqueria/GroomingAppointments';
import GroomingAppointment from './pages/peluqueria/GroomingAppointment';
import GroomingHistory from './pages/peluqueria/GroomingHistory';
import GroomingTreatments from './pages/peluqueria/GroomingTreatments';
import SocialMediaDashboard from './pages/marketing/redes-sociales';
import WebDashboard from './pages/marketing/web';
import CampañasMK from './pages/marketing/campanas/CampañasMK';
import FunnelVentas from './pages/oportunidades/FunnelVentas';
import Leads from './pages/oportunidades/Leads';
import CampañasMK2 from './pages/oportunidades/CampañasMK';
import TiendaDashboard from './pages/tienda/Dashboard';
import TiendaInventory from './pages/tienda/Inventory';
import TiendaProducts from './pages/tienda/Products';
import TiendaPedidos from './pages/tienda/Pedidos';
import ContaPlus from './pages/erp/ContaPlus';
import Tesoreria from './pages/erp/Tesoreria';
import Impuestos from './pages/erp/Impuestos';
import Asesorias from './pages/erp/Asesorias';
import MiPerfil from './pages/rrhh/MiPerfil';
import ControlHorario from './pages/rrhh/ControlHorario';
import RegistrarEntradaSalida from './pages/rrhh/RegistrarEntradaSalida';
import Configuracion from './pages/administracion/configuracion';
import Usuarios from './pages/administracion/usuarios';
import Integrations from './pages/tools/Integrations';
import Logs from './pages/tools/Logs';
import TwitterCallback from './pages/tools/TwitterCallback';
import NewPrescriptionPage from './pages/dashboard/NewPrescriptionPage';
import { ConvexProvider } from './context/ConvexProvider';
import { InboxProvider } from './context/InboxContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import io from 'socket.io-client';
import { socketService } from './services/socketService';

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
    <ConvexClientProvider>
      <AuthProvider>
        <InboxProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <PageLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/new-prescription" element={<NewPrescriptionPage />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/opportunities" element={<Leads />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/reports" element={<Reports />} />

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
                <Route path="consultorio/citas" element={<ConsultationAppointments />} />
                <Route path="consultorio/consulta/:id" element={<Consultation />} />
                <Route path="consultorio/historiales" element={<MedicalHistory />} />
                <Route path="consultorio/tratamientos" element={<Tratamientos />} />
                <Route path="consultorio/medicamentos" element={<Medications />} />
                <Route path="consultorio/recetas" element={<Prescriptions />} />

                {/* Peluquería routes */}
                <Route path="peluqueria" element={<GroomingAppointments />} />
                <Route path="peluqueria/citas" element={<GroomingAppointments />} />
                <Route path="peluqueria/citas/:id" element={<GroomingAppointment />} />
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
                <Route path="compras/pedidos" element={<Pedidos />} />

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

                {/* Tools routes */}
                <Route path="tools">
                  <Route path="integrations" element={
                    <ProtectedRoute>
                      <Integrations />
                    </ProtectedRoute>
                  } />
                  <Route path="logs" element={
                    <ProtectedRoute>
                      <Logs />
                    </ProtectedRoute>
                  } />
                  <Route path="/tools/twitter-callback" element={<TwitterCallback />} />
                  <Route path="administracion/configuracion" element={<Configuracion />} />
                </Route>

                {/* Administration routes */}
                <Route path="administracion" element={<Placeholder pageName="Administración" />} />
                <Route path="administracion/configuracion" element={
                  <ProtectedRoute>
                    <Configuracion />
                  </ProtectedRoute>
                } />
                <Route path="administracion/usuarios" element={
                  <ProtectedRoute>
                    <Usuarios />
                  </ProtectedRoute>
                } />
                <Route path="administracion/configuracion" element={<Placeholder pageName="Configuración" />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </Router>
        </InboxProvider>
      </AuthProvider>
    </ConvexClientProvider>
  );
}

export default App;