import React, { useState } from 'react';
import { X, Search, Calendar, DollarSign, FileText, Printer, Download, Receipt, Bell as BellIcon, HelpCircle, RefreshCw, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { mockPatients } from '../../data/mockData';
import { generateInvoicePDF } from '../../utils/pdfGenerator';

interface NewSaleFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const NewSaleForm: React.FC<NewSaleFormProps> = ({ onClose, onSubmit }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [needsInvoice, setNeedsInvoice] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    nif: '',
    address: '',
    invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  });
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    serviceArea: '',
    product: '',
    price: '',
    paymentMethod: '',
    notes: ''
  });

  // Check if invoice can be generated
  const canGenerateInvoice = needsInvoice && 
    invoiceData.nif.trim() !== '' && 
    invoiceData.address.trim() !== '' && 
    formData.price !== '';

  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const saleData = {
      ...formData,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      petName: selectedPatient.pet.name,
      status: 'completed',
      invoice: needsInvoice ? {
        ...invoiceData,
        clientName: selectedPatient.name,
        clientEmail: selectedPatient.email,
        clientPhone: selectedPatient.phone,
        items: [{
          description: formData.product,
          amount: parseFloat(formData.price),
          tax: parseFloat(formData.price) * 0.21
        }],
        total: parseFloat(formData.price),
        tax: parseFloat(formData.price) * 0.21,
        totalWithTax: parseFloat(formData.price) * 1.21
      } : null
    };

    onSubmit(saleData);
    onClose();

    // Navigate to invoices page if an invoice was generated
    if (needsInvoice) {
      navigate('/finanzas/facturas', { 
        state: { 
          newInvoice: true,
          invoiceNumber: invoiceData.invoiceNumber
        } 
      });
    } else {
      navigate('/finanzas/ventas', { 
        state: { 
          newSale: true,
          date: formData.date
        } 
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInvoiceDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    if (!selectedPatient || !needsInvoice) return;

    const data = {
      invoiceNumber: invoiceData.invoiceNumber,
      date: formData.date,
      clientName: selectedPatient.name,
      clientAddress: invoiceData.address,
      clientNif: invoiceData.nif,
      clientEmail: selectedPatient.email,
      clientPhone: selectedPatient.phone,
      items: [{
        description: formData.product,
        area: formData.serviceArea,
        amount: parseFloat(formData.price)
      }],
      paymentMethod: formData.paymentMethod,
      notes: formData.notes
    };

    const doc = generateInvoicePDF(data);
    doc.save(`factura-${invoiceData.invoiceNumber}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nueva Venta</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {!selectedPatient ? (
            <div className="space-y-4">
              <Input
                label="Buscar cliente"
                placeholder="Buscar por nombre del propietario, mascota, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
              />

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Resultados de la búsqueda</h3>
                <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                  {filteredPatients.map(patient => (
                    <button
                      key={patient.id}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-500">{patient.email} • {patient.phone}</p>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {patient.pet.name} • {patient.pet.breed} • {patient.pet.sex === 'male' ? 'Macho' : 'Hembra'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredPatients.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No se encontraron resultados
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Cliente Seleccionado</h3>
                    <p className="mt-1 text-sm text-blue-700">{selectedPatient.name}</p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedPatient.pet.name} • {selectedPatient.pet.breed}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                    className="text-blue-700 hover:text-blue-800 text-sm font-medium"
                  >
                    Cambiar cliente
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    icon={<Calendar size={18} />}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área de Servicio
                  </label>
                  <select
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar área</option>
                    <option value="veterinary">Veterinaria</option>
                    <option value="grooming">Peluquería</option>
                    <option value="pharmacy">Farmacia</option>
                    <option value="store">Tienda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Producto/Servicio
                  </label>
                  <select
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar producto</option>
                    <option value="consultation">Consulta General</option>
                    <option value="vaccination">Vacunación</option>
                    <option value="grooming">Peluquería</option>
                    <option value="medication">Medicamentos</option>
                    <option value="food">Alimentos</option>
                    <option value="accessories">Accesorios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio
                  </label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    icon={<DollarSign size={18} />}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar método</option>
                    <option value="cash">Efectivo</option>
                    <option value="card">Tarjeta</option>
                    <option value="transfer">Transferencia</option>
                    <option value="bizum">Bizum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Añade notas o comentarios relevantes..."
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="needsInvoice"
                      checked={needsInvoice}
                      onChange={(e) => setNeedsInvoice(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="needsInvoice" className="ml-2 block text-sm text-gray-900">
                      Generar Factura
                    </label>
                  </div>
                </div>

                {needsInvoice && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NIF/CIF
                      </label>
                      <Input
                        type="text"
                        name="nif"
                        value={invoiceData.nif}
                        onChange={handleInvoiceDataChange}
                        placeholder="B12345678"
                        required={needsInvoice}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección de Facturación
                      </label>
                      <Input
                        type="text"
                        name="address"
                        value={invoiceData.address}
                        onChange={handleInvoiceDataChange}
                        placeholder="Calle, número, código postal, ciudad"
                        required={needsInvoice}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Factura
                      </label>
                      <Input
                        type="text"
                        name="invoiceNumber"
                        value={invoiceData.invoiceNumber}
                        onChange={handleInvoiceDataChange}
                        disabled
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-6">
                {needsInvoice && (
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    icon={<FileText size={20} />}
                    onClick={() => setShowInvoicePreview(true)}
                    className="w-full"
                    disabled={!canGenerateInvoice}
                  >
                    Emitir Factura
                  </Button>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Registrar Venta
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>

        {showInvoicePreview && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Vista Previa de Factura</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Printer size={18} />}
                    onClick={handlePrintInvoice}
                  >
                    Imprimir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download size={18} />}
                    onClick={handleDownloadInvoice}
                  >
                    Descargar PDF
                  </Button>
                  <button
                    onClick={() => setShowInvoicePreview(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="bg-white p-8 shadow-sm border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Receipt size={32} className="text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">ClinicPro</h1>
                      </div>
                      <div className="mt-2 text-gray-600">
                        <p>Calle de Beatriz de Bobadilla, 9</p>
                        <p>28040 Madrid</p>
                        <p>CIF: B12345678</p>
                        <p>Tel: +34 912 345 678</p>
                        <p>Email: facturacion@clinicpro.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-semibold text-gray-900">FACTURA</h2>
                      <div className="mt-2 text-gray-600">
                        <p>Nº: {invoiceData.invoiceNumber}</p>
                        <p>Fecha: {new Date(formData.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Datos del Cliente</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{selectedPatient.name}</p>
                        <p className="text-gray-600 mt-1">{invoiceData.address}</p>
                        <p className="text-gray-600">NIF/CIF: {invoiceData.nif}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">{selectedPatient.email}</p>
                        <p className="text-gray-600">{selectedPatient.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-3 px-4 text-gray-700 font-medium">Descripción</th>
                          <th className="text-right py-3 px-4 text-gray-700 font-medium">Base Imponible</th>
                          <th className="text-right py-3 px-4 text-gray-700 font-medium">IVA (21%)</th>
                          <th className="text-right py-3 px-4 text-gray-700 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-4 px-4">
                            <p className="font-medium text-gray-900">{formData.product}</p>
                            <p className="text-sm text-gray-500">Área: {formData.serviceArea}</p>
                          </td>
                          <td className="text-right py-4 px-4 text-gray-900">
                            {parseFloat(formData.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          </td>
                          <td className="text-right py-4 px-4 text-gray-900">
                            {(parseFloat(formData.price) * 0.21).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          </td>
                          <td className="text-right py-4 px-4 text-gray-900 font-medium">
                            {(parseFloat(formData.price) * 1.21).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-900">
                          <td colSpan={2} className="py-4 px-4"></td>
                          <td className="text-right py-4 px-4 font-medium text-gray-900">Total:</td>
                          <td className="text-right py-4 px-4 font-bold text-gray-900 text-lg">
                            {(parseFloat(formData.price) * 1.21).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Información de Pago</h4>
                      <p className="text-sm text-gray-600">
                        Método de pago: {
                          formData.paymentMethod === 'cash' ? 'Efectivo' : 
                          formData.paymentMethod === 'card' ? 'Tarjeta' :
                          formData.paymentMethod === 'transfer' ? 'Transferencia' : 'Bizum'
                        }
                      </p>
                    </div>

                    {formData.notes && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Notas</h4>
                        <p className="text-sm text-gray-600">{formData.notes}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-8">
                      <p>Esta factura sirve como justificante de pago.</p>
                      <p>IVA incluido según la legislación vigente.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowInvoicePreview(false)}
                >
                  Cerrar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                >
                  Confirmar y Emitir Factura
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewSaleForm;