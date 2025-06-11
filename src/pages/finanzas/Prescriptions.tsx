import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Calendar, RefreshCw, FileText, Eye, Printer, X, Mail, MessageSquare, Phone, Plus, Pill, QrCode } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import NewPrescriptionForm from '../../components/dashboard/NewPrescriptionForm';
import * as XLSX from 'xlsx';
import { QRCodeSVG } from 'qrcode.react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const Prescriptions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [previewPrescription, setPreviewPrescription] = useState<any>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
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
  const [showNewPrescriptionForm, setShowNewPrescriptionForm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  // Get prescriptions from Convex
  const prescriptions = useQuery(api.prescriptions.getPrescriptions) || [];
  const patients = useQuery(api.patients.getPatients) || [];

  // Filter prescriptions based on search term and selected status
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = searchTerm === '' || 
      prescription.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.patient?.phone?.includes(searchTerm) ||
      prescription.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.pet?.species?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.pet?.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medicines?.some(med => med?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    // For now, we'll consider all prescriptions as 'active' since we don't have status in schema
    const matchesStatus = selectedStatus === 'all' || selectedStatus === 'active';

    return matchesSearch && matchesStatus;
  });

  const handleNewPrescription = (prescriptionData: any) => {
    console.log('New prescription data:', prescriptionData);
    setShowNewPrescriptionForm(false);
  };

  const handleDownloadPrescription = (prescription: any) => {
    const data = {
      prescriptionNumber: `RX-${prescription._id.slice(-8)}`,
      date: new Date(prescription.createdAt).toISOString().split('T')[0],
      patientName: `${prescription.patient?.firstName} ${prescription.patient?.lastName}`,
      petName: prescription.pet?.name || 'N/A',
      petDetails: prescription.pet ? 
        `${prescription.pet.species} ${prescription.pet.breed || ''}, ${prescription.pet.sex === 'male' ? 'Macho' : 'Hembra'}` : 'N/A',
      diagnosis: prescription.notes || '',
      medications: prescription.medicines?.map(med => ({
        id: med?._id,
        name: med?.name || '',
        dosage: med?.recommendedDosage || '',
        frequency: 'Según indicaciones',
        duration: med?.duration || '',
        notes: ''
      })) || [],
      notes: prescription.notes || '',
      doctor: prescription.doctorId || 'Dr. Sin especificar',
      clinic: {
        name: "ClinicPro",
        address: "Calle de Beatriz de Bobadilla, 9, 28040 Madrid",
        phone: "+34 912 345 678",
        email: "info@clinicpro.com"
      }
    };

    const doc = generatePrescriptionPDF(data);
    doc.save(`receta-RX-${prescription._id.slice(-8)}.pdf`);
  };

  const handlePrintPrescription = (prescription: any) => {
    const data = {
      prescriptionNumber: `RX-${prescription._id.slice(-8)}`,
      date: new Date(prescription.createdAt).toISOString().split('T')[0],
      patientName: `${prescription.patient?.firstName} ${prescription.patient?.lastName}`,
      petName: prescription.pet?.name || 'N/A',
      petDetails: prescription.pet ? 
        `${prescription.pet.species} ${prescription.pet.breed || ''}, ${prescription.pet.sex === 'male' ? 'Macho' : 'Hembra'}` : 'N/A',
      diagnosis: prescription.notes || '',
      medications: prescription.medicines?.map(med => ({
        id: med?._id,
        name: med?.name || '',
        dosage: med?.recommendedDosage || '',
        frequency: 'Según indicaciones',
        duration: med?.duration || '',
        notes: ''
      })) || [],
      notes: prescription.notes || '',
      doctor: prescription.doctorId || 'Dr. Sin especificar',
      clinic: {
        name: "ClinicPro",
        address: "Calle de Beatriz de Bobadilla, 9, 28040 Madrid",
        phone: "+34 912 345 678",
        email: "info@clinicpro.com"
      }
    };

    const doc = generatePrescriptionPDF(data);
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  };

  const handlePreviewPrescription = (prescription: any) => {
    setPreviewPrescription(prescription);

    // Pre-populate sharing forms with client data
    setEmailData({
      to: prescription.patient?.email || '',
      subject: `Receta Médica RX-${prescription._id.slice(-8)} - ClinicPro`,
      message: `Estimado/a ${prescription.patient?.firstName} ${prescription.patient?.lastName},\n\nAdjunto encontrará la receta médica para ${prescription.pet?.name} con número RX-${prescription._id.slice(-8)}.\n\nMedicamentos:\n${prescription.medicines?.map(med => `- ${med?.name}: ${med?.recommendedDosage}`).join('\n')}\n\nSi tiene alguna pregunta, no dude en contactarnos.\n\nSaludos cordiales,\n${prescription.doctorId}\nClinicPro`
    });

    setWhatsappData({
      number: prescription.patient?.phone || '',
      message: `Hola ${prescription.patient?.firstName}, le enviamos la receta médica para ${prescription.pet?.name} con número RX-${prescription._id.slice(-8)}.\n\nMedicamentos:\n${prescription.medicines?.map(med => `- ${med?.name}: ${med?.recommendedDosage}`).join('\n')}\n\nSaludos, ${prescription.doctorId} - ClinicPro.`
    });

    setSmsData({
      number: prescription.patient?.phone || '',
      message: `ClinicPro: Receta RX-${prescription._id.slice(-8)} para ${prescription.pet?.name}. Medicamentos: ${prescription.medicines?.map(m => m?.name).join(', ')}.`
    });
  };

  const handleSharePrescription = (method: 'email' | 'whatsapp' | 'sms') => {
    if (method === 'email') {
      setShowEmailForm(true);
    } else if (method === 'whatsapp') {
      setShowWhatsappForm(true);
    } else if (method === 'sms') {
      setShowSmsForm(true);
    }
    setShowShareOptions(false);
  };

  const handleSendEmail = () => {
    console.log('Sending email:', emailData);
    setShowEmailForm(false);
  };

  const handleSendWhatsapp = () => {
    console.log('Sending WhatsApp:', whatsappData);
    const encodedMessage = encodeURIComponent(whatsappData.message);
    const whatsappUrl = `https://wa.me/${whatsappData.number.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setShowWhatsappForm(false);
  };

  const handleSendSms = () => {
    console.log('Sending SMS:', smsData);
    const encodedMessage = encodeURIComponent(smsData.message);
    const smsUrl = `sms:${smsData.number}?body=${encodedMessage}`;
    window.location.href = smsUrl;
    setShowSmsForm(false);
  };

  const handleExportExcel = () => {
    const excelData = prescriptions.map(prescription => ({
      'Nº Receta': `RX-${prescription._id.slice(-8)}`,
      'Fecha': new Date(prescription.createdAt).toLocaleDateString('es-ES'),
      'Propietario': `${prescription.patient?.firstName} ${prescription.patient?.lastName}`,
      'Email': prescription.patient?.email,
      'Teléfono': prescription.patient?.phone,
      'Mascota': prescription.pet ? `${prescription.pet.name} (${prescription.pet.species} ${prescription.pet.breed || ''})` : 'N/A',
      'Notas': prescription.notes || '',
      'Medicamentos': prescription.medicines?.map(med => med?.name).join(', '),
      'Doctor': prescription.doctorId,
      'Estado': 'Activa'
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Recetas');
    XLSX.writeFile(wb, 'recetas.xlsx');
  };

  // Generate QR code data for Spanish pharmacy protocol
  const generateQRData = (prescription: any) => {
    const qrData = {
      prescriptionId: `RX-${prescription._id.slice(-8)}`,
      patientName: `${prescription.patient?.firstName} ${prescription.patient?.lastName}`,
      patientId: prescription.patient?._id || "N/A",
      petName: prescription.pet?.name || 'N/A',
      petSpecies: prescription.pet?.species || 'N/A',
      diagnosis: prescription.notes || '',
      medications: prescription.medicines?.map(med => ({
        name: med?.name || '',
        dosage: med?.recommendedDosage || '',
        duration: med?.duration || ''
      })) || [],
      doctor: prescription.doctorId,
      date: new Date(prescription.createdAt).toISOString().split('T')[0],
      clinic: "ClinicPro",
      clinicId: "B12345678"
    };

    return JSON.stringify(qrData);
  };

  // Status styles and labels
  const statusStyles = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    'active': 'Activa',
    'inactive': 'Inactiva'
  };

  // Share method icons
  const shareMethodIcons = {
    'email': <Mail size={16} className="text-blue-600" />,
    'whatsapp': <MessageSquare size={16} className="text-green-600" />,
    'sms': <Phone size={16} className="text-purple-600" />
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recetas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de recetas médicas
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            icon={<Download size={18} />}
            className="flex-1 sm:flex-none"
            onClick={handleExportExcel}
          >
            Exportar
          </Button>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => {
              console.log('Navigating to new prescription page');
              navigate('/dashboard/new-prescription');
            }}
          >
            Nueva Receta
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder="Buscar por receta, propietario, mascota o medicamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="flex-1"
          />
          <Input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            icon={<Calendar size={18} />}
          />
          <Input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            icon={<Calendar size={18} />}
          />
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Prescriptions Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº Receta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propietario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicamentos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrescriptions.map((prescription) => (
                <tr key={prescription._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Pill size={16} className="text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">RX-{prescription._id.slice(-8)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(prescription.createdAt).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {prescription.patient?.firstName} {prescription.patient?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{prescription.patient?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{prescription.pet?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">
                      {prescription.pet ? `${prescription.pet.species} ${prescription.pet.breed || ''}` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{prescription.notes || 'Sin notas'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {prescription.medicines?.map((med, index) => (
                        <div key={med?._id || index} className={index > 0 ? 'mt-1' : ''}>
                          {med?.name || 'Medicamento no encontrado'}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{prescription.doctorId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusStyles['active']
                    }`}>
                      {statusLabels['active']}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownloadPrescription(prescription)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Descargar PDF"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handlePrintPrescription(prescription)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Imprimir"
                      >
                        <Printer size={18} />
                      </button>
                      <button
                        onClick={() => handlePreviewPrescription(prescription)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewPrescription && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Vista Previa de Receta - RX-{previewPrescription._id.slice(-8)}
              </h3>
              <button
                onClick={() => setPreviewPrescription(null)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Propietario</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {previewPrescription.patient?.firstName} {previewPrescription.patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{previewPrescription.patient?.email}</p>
                    <p className="text-sm text-gray-500">{previewPrescription.patient?.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Mascota</h4>
                    <p className="mt-1 text-sm text-gray-900">{previewPrescription.pet?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">
                      {previewPrescription.pet ? 
                        `${previewPrescription.pet.species} ${previewPrescription.pet.breed || ''}` : 
                        'Sin información de mascota'
                      }
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Notas</h4>
                  <p className="mt-1 text-sm text-gray-900">{previewPrescription.notes || 'Sin notas'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Medicamentos</h4>
                  <div className="mt-2 space-y-4">
                    {previewPrescription.medicines?.map((medication, index) => (
                      <div key={medication?._id || index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <Pill className="text-blue-600 mr-2" size={16} />
                          <h5 className="text-sm font-medium text-gray-900">{medication?.name || 'Medicamento no encontrado'}</h5>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Dosis recomendada</p>
                            <p className="text-sm">{medication?.recommendedDosage || 'No especificada'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Duración</p>
                            <p className="text-sm">{medication?.duration || 'No especificada'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Principio activo</p>
                            <p className="text-sm">{medication?.activeIngredient || 'No especificado'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Doctor</h4>
                    <div className="mt-2 flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-900">{previewPrescription.doctorId}</p>
                        <p className="text-xs text-gray-500">Veterinario Colegiado</p>
                      </div>
                      <div className="w-32 h-16 border border-gray-300 rounded flex items-center justify-center text-gray-400">
                        [Firma]
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Código QR</h4>
                    <div className="mt-2 flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<QrCode size={16} />}
                        onClick={() => setShowQRCode(!showQRCode)}
                      >
                        {showQRCode ? 'Ocultar QR' : 'Mostrar QR'}
                      </Button>
                    </div>

                    {showQRCode && (
                      <div className="mt-4">
                        <div className="bg-white p-2 rounded-lg border border-gray-200 inline-block">
                          <QRCodeSVG 
                            value={generateQRData(previewPrescription)}
                            size={150}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          Escaneable en farmacias según protocolo español
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusStyles['active']
                    }`}>
                      {statusLabels['active']}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <div>
                <Button
                  variant="outline"
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  icon={<FileText size={18} />}
                >
                  Compartir
                </Button>
                {showShareOptions && (
                  <div className="absolute mt-2 bg-white rounded-md shadow-lg z-10">
                    <div className="p-2 space-y-1">
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => handleSharePrescription('email')}
                      >
                        <Mail size={16} className="mr-2 text-blue-600" />
                        Email
                      </button>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => handleSharePrescription('whatsapp')}
                      >
                        <MessageSquare size={16} className="mr-2 text-green-600" />
                        WhatsApp
                      </button>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => handleSharePrescription('sms')}
                      >
                        <Phone size={16} className="mr-2 text-purple-600" />
                        SMS
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  icon={<Printer size={18} />}
                  onClick={() => handlePrintPrescription(previewPrescription)}
                >
                  Imprimir
                </Button>
                <Button
                  variant="outline"
                  icon={<Download size={18} />}
                  onClick={() => handleDownloadPrescription(previewPrescription)}
                >
                  Descargar PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreviewPrescription(null)}
                >
                  Cerrar
                </Button>
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
  );
};

export default Prescriptions;