
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Printer, Download, QrCode } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import QRCode from 'react-qr-code';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import NewPrescriptionForm from '../../components/dashboard/NewPrescriptionForm';

const NewPrescriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Receta-${prescriptionData?.number || 'Nueva'}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        .no-print {
          display: none !important;
        }
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
      }
    `
  });

  const handlePrescriptionSubmit = (prescription: any) => {
    console.log('Prescription submitted:', prescription);
    setPrescriptionData(prescription);
    setShowPreview(true);
  };

  const handleDownloadPDF = () => {
    if (prescriptionData) {
      // Aquí se integraría con tu generador de PDF
      console.log('Generating PDF for:', prescriptionData);
    }
  };

  const generateQRData = () => {
    if (!prescriptionData) return '';
    
    return JSON.stringify({
      prescriptionNumber: prescriptionData.number,
      date: prescriptionData.date,
      patient: prescriptionData.patient?.name,
      owner: prescriptionData.patient?.owner,
      veterinarian: prescriptionData.veterinarian,
      medications: prescriptionData.medications?.map((med: any) => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency
      })) || []
    });
  };

  const mockPatients = [
    {
      id: '1',
      name: 'Luna',
      species: 'Perro',
      breed: 'Labrador',
      age: 3,
      weight: 25,
      owner: 'María García',
      ownerPhone: '+34 666 777 888'
    },
    {
      id: '2',
      name: 'Rocky',
      species: 'Perro',
      breed: 'Pastor Alemán',
      age: 5,
      weight: 30,
      owner: 'Carlos Rodríguez',
      ownerPhone: '+34 666 888 999'
    },
    {
      id: '3',
      name: 'Miau',
      species: 'Gato',
      breed: 'Siamés',
      age: 2,
      weight: 4,
      owner: 'Ana López',
      ownerPhone: '+34 666 999 111'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                icon={<ArrowLeft size={18} />}
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                Volver al Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <FileText className="text-blue-600" size={24} />
                <h1 className="text-2xl font-bold text-gray-900">Nueva Receta</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showPreview ? (
          <NewPrescriptionForm
            onSubmit={handlePrescriptionSubmit}
            onCancel={() => navigate('/dashboard')}
            patients={mockPatients}
          />
        ) : (
          <div className="space-y-6">
            {/* Preview Header */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <QrCode className="text-blue-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">
                      Vista Previa - Receta {prescriptionData?.number}
                    </h2>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      icon={<FileText size={18} />}
                      onClick={() => setShowPreview(false)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      icon={<Printer size={18} />}
                      onClick={handlePrint}
                    >
                      Imprimir
                    </Button>
                    <Button
                      variant="outline"
                      icon={<Download size={18} />}
                      onClick={handleDownloadPDF}
                    >
                      Descargar PDF
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        console.log('Prescription saved successfully');
                        navigate('/finanzas/prescriptions');
                      }}
                    >
                      Guardar Receta
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Prescription Preview */}
            <Card>
              <div ref={printRef} className="prescription-print-content">
                <div className="p-8 bg-white">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">RECETA VETERINARIA</h1>
                    <div className="text-sm text-gray-600">
                      <p>ClinicPro - Clínica Veterinaria</p>
                      <p>Calle de Beatriz de Bobadilla, 9, 28040 Madrid</p>
                      <p>Tel: +34 912 345 678 • Email: info@clinicpro.com</p>
                    </div>
                  </div>

                  {/* Prescription Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Datos de la Receta</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-800">Número:</span>
                          <span className="text-blue-900">{prescriptionData?.number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-800">Fecha:</span>
                          <span className="text-blue-900">
                            {prescriptionData?.date ? new Date(prescriptionData.date).toLocaleDateString('es-ES') : ''}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-blue-800">Veterinario:</span>
                          <span className="text-blue-900">{prescriptionData?.veterinarian}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-4">Datos del Paciente</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-green-800">Paciente:</span>
                          <span className="text-green-900">{prescriptionData?.patient?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-green-800">Especie:</span>
                          <span className="text-green-900">{prescriptionData?.patient?.species}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-green-800">Raza:</span>
                          <span className="text-green-900">{prescriptionData?.patient?.breed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-green-800">Edad:</span>
                          <span className="text-green-900">{prescriptionData?.patient?.age} años</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-green-800">Propietario:</span>
                          <span className="text-green-900">{prescriptionData?.patient?.owner}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medications */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Medicamentos Prescritos</h3>
                    <div className="space-y-4">
                      {prescriptionData?.medications?.map((medication: any, index: number) => (
                        <div key={medication.id} className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                              <span className="text-white font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-semibold text-purple-900 mb-3">{medication.name}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-sm text-purple-600 font-medium">Dosis</p>
                                  <p className="text-purple-900 font-semibold">{medication.dosage}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-sm text-purple-600 font-medium">Frecuencia</p>
                                  <p className="text-purple-900 font-semibold">{medication.frequency}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-sm text-purple-600 font-medium">Duración</p>
                                  <p className="text-purple-900 font-semibold">{medication.duration}</p>
                                </div>
                              </div>
                              {medication.instructions && (
                                <div className="mt-3 bg-white rounded-lg p-3">
                                  <p className="text-sm text-purple-600 font-medium">Instrucciones</p>
                                  <p className="text-purple-900">{medication.instructions}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {prescriptionData?.notes && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas Adicionales</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <p className="text-gray-700">{prescriptionData.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Footer with QR and signature */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t-2 border-gray-200">
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Código QR de Verificación</h4>
                      <div className="flex justify-center mb-4">
                        <div className="bg-white p-4 rounded-xl shadow-lg">
                          <QRCode
                            value={generateQRData()}
                            size={150}
                            level="H"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Escanea para verificar la autenticidad de esta receta
                      </p>
                    </div>

                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Firma y Sello Profesional</h4>
                      <div className="border-2 border-dashed border-gray-400 h-32 rounded-xl flex items-center justify-center mb-4">
                        <p className="text-gray-500">Firma del veterinario</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">Colegiado: 12345</p>
                        <p className="text-xs text-gray-600">COLEGIO OFICIAL DE VETERINARIOS</p>
                        <p className="text-xs text-gray-600">Comunidad de Madrid</p>
                      </div>
                    </div>
                  </div>

                  {/* Legal footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-500">
                      Esta receta es válida únicamente para el paciente especificado y debe ser dispensada por un profesional autorizado.
                      Para cualquier consulta, contacte con la clínica veterinaria emisora.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPrescriptionPage;
