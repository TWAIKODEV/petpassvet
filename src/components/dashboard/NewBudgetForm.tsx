
import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, Euro, FileText, Printer, Download, Receipt, Mail, MessageSquare, Phone, Share2, Plus, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { generateBudgetPDF } from '../../utils/pdfGenerator';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface NewBudgetFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface BudgetItem {
  id: string;
  itemId: string;
  itemType: 'product' | 'service' | 'medicine';
  name: string;
  quantity: string;
  price: string;
  discount: string;
  vat: number;
}

const NewBudgetForm: React.FC<NewBudgetFormProps> = ({ onClose, onSubmit }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showBudgetPreview, setShowBudgetPreview] = useState(false);
  const [budgetData, setBudgetData] = useState({
    number: `PRES-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    notes: '',
    clientInfo: {
      nif: '',
      address: '',
    }
  });
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: Date.now().toString(),
      itemId: '',
      itemType: 'product',
      name: '',
      quantity: '1',
      price: '',
      discount: '0',
      vat: 21
    }
  ]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [shareMethod, setShareMethod] = useState<'email' | 'whatsapp' | 'sms' | null>(null);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [whatsappData, setWhatsappData] = useState({
    number: '',
    message: ''
  });
  const [smsData, setSmsData] = useState({
    number: '',
    message: ''
  });
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showWhatsappForm, setShowWhatsappForm] = useState(false);
  const [showSmsForm, setShowSmsForm] = useState(false);

  // Fetch data from database
  const patients = useQuery(api.patients.getPatients) || [];
  const budgetItemsData = useQuery(api.budgets.getBudgetItems);
  const createBudget = useMutation(api.budgets.createBudget);
  const updateBudgetShared = useMutation(api.budgets.updateBudgetShared);

  // Check if budget can be generated
  const canGenerateBudget = 
    selectedPatient && 
    budgetItems.length > 0 &&
    budgetItems.every(item => 
      item.itemId !== '' && 
      item.name.trim() !== '' && 
      item.price !== ''
    );

  const filteredPatients = patients.filter(patient => 
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.pets?.some(pet => pet.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      const budgetId = await createBudget({
        patientId: selectedPatient._id,
        date: formData.date,
        validUntil: budgetData.validUntil,
        number: budgetData.number,
        products: budgetItems.map(item => ({
          itemId: item.itemId,
          itemType: item.itemType,
          name: item.name,
          quantity: parseFloat(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
          discount: parseFloat(item.discount) || 0,
          vat: item.vat
        })),
        nif: budgetData.clientInfo.nif,
        billingAddress: budgetData.clientInfo.address,
        notes: formData.notes || budgetData.notes,
        status: 'pending',
        shared: shareMethod ? [shareMethod] : []
      });

      onSubmit({ budgetId, budgetNumber: budgetData.number });
      onClose();

      navigate('/finanzas/presupuestos', { 
        state: { 
          newBudget: true,
          budgetNumber: budgetData.number
        } 
      });
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBudgetDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBudgetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBudgetData(prev => ({
      ...prev,
      clientInfo: {
        ...prev.clientInfo,
        [name]: value
      }
    }));
  };

  const handleItemChange = (id: string, field: keyof BudgetItem, value: string | number) => {
    setBudgetItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // If itemId changes, find the selected item and update name, price, and vat
          if (field === 'itemId' && budgetItemsData) {
            const allItems = [
              ...budgetItemsData.products,
              ...budgetItemsData.services,
              ...budgetItemsData.medicines
            ];
            const selectedItem = allItems.find(i => i._id === value);
            if (selectedItem) {
              updatedItem.name = selectedItem.name;
              updatedItem.price = selectedItem.basePrice.toString();
              updatedItem.vat = selectedItem.vat;
              updatedItem.itemType = selectedItem.type;
            }
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addBudgetItem = () => {
    setBudgetItems(prev => [
      ...prev, 
      {
        id: Date.now().toString(),
        itemId: '',
        itemType: 'product',
        name: '',
        quantity: '1',
        price: '',
        discount: '0',
        vat: 21
      }
    ]);
  };

  const removeBudgetItem = (id: string) => {
    if (budgetItems.length > 1) {
      setBudgetItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handlePrintBudget = () => {
    window.print();
  };

  const handleDownloadBudget = () => {
    if (!selectedPatient) return;

    const data = {
      budgetNumber: budgetData.number,
      date: formData.date,
      validUntil: budgetData.validUntil,
      clientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      clientAddress: budgetData.clientInfo.address || selectedPatient.address || "Dirección no especificada",
      clientNif: budgetData.clientInfo.nif || "NIF no especificado",
      clientEmail: selectedPatient.email,
      clientPhone: selectedPatient.phone,
      items: budgetItems.map(item => ({
        description: item.name,
        area: item.itemType,
        quantity: parseFloat(item.quantity) || 1,
        price: parseFloat(item.price) || 0,
        discount: parseFloat(item.discount) || 0,
        vat: item.vat,
        amount: (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 1)
      })),
      notes: formData.notes || budgetData.notes
    };

    const doc = generateBudgetPDF(data);
    doc.save(`presupuesto-${budgetData.number}.pdf`);
  };

  const handleShareBudget = (method: 'email' | 'whatsapp' | 'sms') => {
    setShareMethod(method);
    
    // Calculate total amount for message
    const totalAmount = budgetItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      const discount = parseFloat(item.discount) || 0;
      const subtotal = price * quantity;
      const discountAmount = subtotal * (discount / 100);
      const afterDiscount = subtotal - discountAmount;
      const tax = afterDiscount * (item.vat / 100);
      return sum + afterDiscount + tax;
    }, 0);
    
    const formattedTotal = totalAmount.toLocaleString('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    });
    
    if (method === 'email') {
      setEmailData({
        to: selectedPatient.email || '',
        subject: `Presupuesto ${budgetData.number} - ClinicPro`,
        message: `Estimado/a ${selectedPatient.firstName} ${selectedPatient.lastName},\n\nAdjunto encontrará el presupuesto solicitado con número ${budgetData.number} por un importe total de ${formattedTotal} (IVA incluido).\n\nEl presupuesto es válido hasta el ${new Date(budgetData.validUntil).toLocaleDateString('es-ES')}.\n\nSi tiene alguna pregunta, no dude en contactarnos.\n\nSaludos cordiales,\nEquipo ClinicPro`
      });
      setShowEmailForm(true);
    } 
    else if (method === 'whatsapp') {
      setWhatsappData({
        number: selectedPatient.phone || '',
        message: `Hola ${selectedPatient.firstName}, le enviamos el presupuesto solicitado con número ${budgetData.number} por un importe de ${formattedTotal} (IVA incluido). El presupuesto es válido hasta el ${new Date(budgetData.validUntil).toLocaleDateString('es-ES')}. Saludos, ClinicPro.`
      });
      setShowWhatsappForm(true);
    }
    else if (method === 'sms') {
      setSmsData({
        number: selectedPatient.phone || '',
        message: `ClinicPro: Su presupuesto ${budgetData.number} por ${formattedTotal} está disponible hasta ${new Date(budgetData.validUntil).toLocaleDateString('es-ES')}.`
      });
      setShowSmsForm(true);
    }
  };

  const handleSendEmail = () => {
    console.log('Sending email:', emailData);
    setShowEmailForm(false);
    handleSubmit(new Event('submit') as any);
  };

  const handleSendWhatsapp = () => {
    console.log('Sending WhatsApp:', whatsappData);
    
    const encodedMessage = encodeURIComponent(whatsappData.message);
    const whatsappUrl = `https://wa.me/${whatsappData.number.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    setShowWhatsappForm(false);
    handleSubmit(new Event('submit') as any);
  };

  const handleSendSms = () => {
    console.log('Sending SMS:', smsData);
    
    const encodedMessage = encodeURIComponent(smsData.message);
    const smsUrl = `sms:${smsData.number}?body=${encodedMessage}`;
    window.location.href = smsUrl;
    
    setShowSmsForm(false);
    handleSubmit(new Event('submit') as any);
  };

  const calculateTotal = () => {
    return budgetItems.reduce((totals, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      const discount = parseFloat(item.discount) || 0;
      const subtotal = price * quantity;
      const discountAmount = subtotal * (discount / 100);
      const afterDiscount = subtotal - discountAmount;
      const tax = afterDiscount * (item.vat / 100);
      
      return {
        subtotal: totals.subtotal + afterDiscount,
        tax: totals.tax + tax,
        total: totals.total + afterDiscount + tax
      };
    }, { subtotal: 0, tax: 0, total: 0 });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nuevo Presupuesto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
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
                        key={patient._id}
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
                          <p className="text-sm text-gray-500">{patient.email} • {patient.phone}</p>
                          <div className="mt-1">
                            {patient.pets && patient.pets.length > 0 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {patient.pets[0].name} • {patient.pets[0].breed} • {patient.pets[0].sex === 'male' ? 'Macho' : 'Hembra'}
                              </span>
                            )}
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
                      <p className="mt-1 text-sm text-blue-700">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                      <div className="mt-1">
                        {selectedPatient.pets && selectedPatient.pets.length > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {selectedPatient.pets[0].name} • {selectedPatient.pets[0].breed}
                          </span>
                        )}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      Válido hasta
                    </label>
                    <Input
                      type="date"
                      name="validUntil"
                      value={budgetData.validUntil}
                      onChange={handleBudgetDataChange}
                      icon={<Calendar size={18} />}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Presupuesto
                    </label>
                    <Input
                      type="text"
                      name="number"
                      value={budgetData.number}
                      onChange={handleBudgetDataChange}
                      disabled
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Productos y Servicios</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={<Plus size={16} />}
                      onClick={addBudgetItem}
                    >
                      Añadir Artículo
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {budgetItems.map((item, index) => (
                      <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-medium text-gray-700">Artículo #{index + 1}</h4>
                          {budgetItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBudgetItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash size={16} />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tipo de Artículo
                            </label>
                            <select
                              value={item.itemType}
                              onChange={(e) => handleItemChange(item.id, 'itemType', e.target.value as 'product' | 'service' | 'medicine')}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              required
                            >
                              <option value="product">Producto</option>
                              <option value="service">Servicio</option>
                              <option value="medicine">Medicamento</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Artículo
                            </label>
                            <select
                              value={item.itemId}
                              onChange={(e) => handleItemChange(item.id, 'itemId', e.target.value)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              required
                            >
                              <option value="">Seleccionar artículo</option>
                              {budgetItemsData && (
                                <>
                                  {item.itemType === 'product' && budgetItemsData.products.map(product => (
                                    <option key={product._id} value={product._id}>
                                      {product.name} - {product.basePrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                    </option>
                                  ))}
                                  {item.itemType === 'service' && budgetItemsData.services.map(service => (
                                    <option key={service._id} value={service._id}>
                                      {service.name} - {service.basePrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                    </option>
                                  ))}
                                  {item.itemType === 'medicine' && budgetItemsData.medicines.map(medicine => (
                                    <option key={medicine._id} value={medicine._id}>
                                      {medicine.name} - {medicine.basePrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                    </option>
                                  ))}
                                </>
                              )}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Cantidad
                            </label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                              placeholder="1"
                              min="1"
                              step="1"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Precio Unitario
                            </label>
                            <Input
                              type="number"
                              value={item.price}
                              onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                              icon={<Euro size={18} />}
                              placeholder="0.00"
                              step="0.01"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Descuento (%)
                            </label>
                            <Input
                              type="number"
                              value={item.discount}
                              onChange={(e) => handleItemChange(item.id, 'discount', e.target.value)}
                              placeholder="0"
                              min="0"
                              max="100"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              IVA (%)
                            </label>
                            <Input
                              type="number"
                              value={item.vat}
                              onChange={(e) => handleItemChange(item.id, 'vat', parseFloat(e.target.value) || 0)}
                              placeholder="21"
                              min="0"
                              max="100"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NIF/CIF
                      </label>
                      <Input
                        type="text"
                        name="nif"
                        value={budgetData.clientInfo.nif}
                        onChange={handleClientInfoChange}
                        placeholder="B12345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección de Facturación
                      </label>
                      <Input
                        type="text"
                        name="address"
                        value={budgetData.clientInfo.address}
                        onChange={handleClientInfoChange}
                        placeholder="Calle, número, código postal, ciudad"
                      />
                    </div>
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

                <div className="flex flex-col gap-4 mt-6">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    icon={<FileText size={20} />}
                    onClick={() => setShowBudgetPreview(true)}
                    className="w-full"
                    disabled={!canGenerateBudget}
                  >
                    Vista Previa del Presupuesto
                  </Button>

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
                      Guardar Presupuesto
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Budget Preview Modal */}
        {showBudgetPreview && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Vista Previa de Presupuesto</h3>
                <button
                  onClick={() => setShowBudgetPreview(false)}
                  className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
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
                        <p>Email: info@clinicpro.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-semibold text-gray-900">PRESUPUESTO</h2>
                      <div className="mt-2 text-gray-600">
                        <p>Nº: {budgetData.number}</p>
                        <p>Fecha: {new Date(formData.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                        <p>Válido hasta: {new Date(budgetData.validUntil).toLocaleDateString('es-ES', {
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
                        <p className="font-medium text-gray-900">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                        <p className="text-gray-600 mt-1">{budgetData.clientInfo.address || selectedPatient.address || "Dirección no especificada"}</p>
                        <p className="text-gray-600">NIF/CIF: {budgetData.clientInfo.nif || "No especificado"}</p>
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
                          <th className="text-center py-3 px-4 text-gray-700 font-medium">Cantidad</th>
                          <th className="text-right py-3 px-4 text-gray-700 font-medium">Precio</th>
                          <th className="text-right py-3 px-4 text-gray-700 font-medium">Descuento</th>
                          <th className="text-right py-3 px-4 text-gray-700 font-medium">IVA</th>
                          <th className="text-right py-3 px-4 text-gray-700 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {budgetItems.map((item, index) => {
                          const price = parseFloat(item.price) || 0;
                          const quantity = parseFloat(item.quantity) || 1;
                          const discount = parseFloat(item.discount) || 0;
                          const subtotal = price * quantity;
                          const discountAmount = subtotal * (discount / 100);
                          const afterDiscount = subtotal - discountAmount;
                          const tax = afterDiscount * (item.vat / 100);
                          const total = afterDiscount + tax;
                          
                          return (
                            <tr key={item.id}>
                              <td className="py-4 px-4">
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500 capitalize">{item.itemType}</p>
                              </td>
                              <td className="text-center py-4 px-4 text-gray-900">
                                {quantity}
                              </td>
                              <td className="text-right py-4 px-4 text-gray-900">
                                {price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                              </td>
                              <td className="text-right py-4 px-4 text-gray-900">
                                {discount > 0 ? 
                                  `${discount}% (${discountAmount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })})` : 
                                  '0%'}
                              </td>
                              <td className="text-right py-4 px-4 text-gray-900">
                                {item.vat}%
                                <div className="text-xs text-gray-500">
                                  {tax.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                </div>
                              </td>
                              <td className="text-right py-4 px-4 text-gray-900 font-medium">
                                {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-gray-900">
                          <td colSpan={5} className="py-4 px-4 text-right font-medium text-gray-900">
                            Total General:
                          </td>
                          <td className="text-right py-4 px-4 font-bold text-gray-900 text-lg">
                            {calculateTotal().total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="mt-8 space-y-4">
                    {(formData.notes || budgetData.notes) && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Notas</h4>
                        <p className="text-sm text-gray-600">{formData.notes || budgetData.notes}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-8">
                      <p>Este presupuesto tiene validez hasta la fecha indicada.</p>
                      <p>Los precios incluyen IVA según la legislación vigente.</p>
                      <p>El presupuesto no supone compromiso de reserva.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Compartir presupuesto</h4>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Mail size={16} />}
                        onClick={() => handleShareBudget('email')}
                      >
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<MessageSquare size={16} />}
                        onClick={() => handleShareBudget('whatsapp')}
                      >
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Phone size={16} />}
                        onClick={() => handleShareBudget('sms')}
                      >
                        SMS
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      icon={<Printer size={18} />}
                      onClick={handlePrintBudget}
                    >
                      Imprimir
                    </Button>
                    <Button
                      variant="outline"
                      icon={<Download size={18} />}
                      onClick={handleDownloadBudget}
                    >
                      Descargar PDF
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowBudgetPreview(false)}
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Form Modal */}
        {showEmailForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[70]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Enviar por Email</h3>
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <Input
                  label="Destinatario"
                  type="email"
                  value={emailData.to}
                  onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                  placeholder="email@ejemplo.com"
                  icon={<Mail size={18} />}
                  required
                />
                <Input
                  label="Asunto"
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                  placeholder="Asunto del email"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={emailData.message}
                    onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Escriba su mensaje aquí..."
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowEmailForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    icon={<Mail size={18} />}
                    onClick={handleSendEmail}
                  >
                    Enviar Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Form Modal */}
        {showWhatsappForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[70]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Enviar por WhatsApp</h3>
                <button
                  onClick={() => setShowWhatsappForm(false)}
                  className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <Input
                  label="Número de teléfono"
                  type="tel"
                  value={whatsappData.number}
                  onChange={(e) => setWhatsappData({...whatsappData, number: e.target.value})}
                  placeholder="+34 666 777 888"
                  icon={<Phone size={18} />}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={whatsappData.message}
                    onChange={(e) => setWhatsappData({...whatsappData, message: e.target.value})}
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Escriba su mensaje aquí..."
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowWhatsappForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    icon={<MessageSquare size={18} />}
                    onClick={handleSendWhatsapp}
                  >
                    Enviar por WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SMS Form Modal */}
        {showSmsForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[70]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Enviar por SMS</h3>
                <button
                  onClick={() => setShowSmsForm(false)}
                  className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <Input
                  label="Número de teléfono"
                  type="tel"
                  value={smsData.number}
                  onChange={(e) => setSmsData({...smsData, number: e.target.value})}
                  placeholder="+34 666 777 888"
                  icon={<Phone size={18} />}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={smsData.message}
                    onChange={(e) => setSmsData({...smsData, message: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Escriba su mensaje aquí..."
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Máximo 160 caracteres para SMS estándar. Caracteres: {smsData.message.length}/160
                  </p>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowSmsForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    icon={<Phone size={18} />}
                    onClick={handleSendSms}
                  >
                    Enviar SMS
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewBudgetForm;
