import React, { useState, useRef, useCallback } from 'react';
import { Calendar, Clock, FileText, Plus, X, User, Pill, Printer, Download, QrCode } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import QRCode from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  owner: string;
  ownerPhone: string;
}

interface NewPrescriptionFormProps {
  onSubmit: (prescription: any) => void;
  onCancel: () => void;
  patients: Patient[];
}

const NewPrescriptionForm: React.FC<NewPrescriptionFormProps> = ({
  onSubmit,
  onCancel,
  patients
}) => {
  const createPrescription = useMutation(api.prescriptions.createPrescription);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState<Medication>({
    id: '',
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState(new Date().toISOString().split('T')[0]);
  const [veterinarian, setVeterinarian] = useState('Dr. Juan Pérez');
  const [notes, setNotes] = useState('');

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Receta-${prescriptionNumber || 'Nueva'}`,
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

  const handleDownloadPDF = async () => {
    if (!selectedPatient || medications.length === 0) return;

    const prescriptionData = {
      number: prescriptionNumber,
      date: prescriptionDate,
      patient: selectedPatient,
      veterinarian,
      medications,
      notes,
      qrData: generateQRData()
    };

    try {
      await generatePrescriptionPDF(prescriptionData);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const generateQRData = () => {
    if (!selectedPatient) return '';

    return JSON.stringify({
      prescriptionNumber,
      date: prescriptionDate,
      patient: selectedPatient.name,
      owner: selectedPatient.owner,
      veterinarian,
      medications: medications.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency
      }))
    });
  };

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const medication = {
        ...newMedication,
        id: Date.now().toString()
      };
      setMedications([...medications, medication]);
      setNewMedication({
        id: '',
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    }
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!selectedPatient) {
        console.error('No patient selected for prescription');
        alert('Por favor seleccione un paciente');
        return;
      }

      if (medications.length === 0) {
        console.error('No medications added to prescription');
        alert('Por favor añada al menos un medicamento');
        return;
      }

      const finalPrescriptionNumber = prescriptionNumber || `RX-${Date.now()}`;

      const prescription = {
        id: Date.now().toString(),
        number: finalPrescriptionNumber,
        date: prescriptionDate,
        patient: selectedPatient,
        veterinarian,
        medications,
        notes,
        status: 'active'
      };

      console.log('Submitting prescription:', prescription);

      await createPrescription({
        patientId: selectedPatient.id as any,
        veterinarian: veterinarian,
        medications: medications.map(med => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions || undefined,
        })),
        diagnosis: notes || undefined,
        notes: notes || undefined,
      });
      onSubmit(prescription);
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('Error al crear la receta');
    }
  };

  const handlePreview = () => {
    try {
      if (!selectedPatient) {
        console.error('No patient selected');
        alert('Por favor seleccione un paciente');
        return;
      }

      if (medications.length === 0) {
        console.error('No medications added');
        alert('Por favor añada al menos un medicamento');
        return;
      }

      if (!prescriptionNumber) {
        const newNumber = `RX-${Date.now()}`;
        setPrescriptionNumber(newNumber);
        console.log('Generated prescription number:', newNumber);
      }

      console.log('Opening preview with patient:', selectedPatient);
      console.log('Medications:', medications);
      setShowPreview(true);
    } catch (error) {
      console.error('Error opening preview:', error);
      alert('Error al abrir la vista previa');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Receta</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Receta
                </label>
                <Input
                  value={prescriptionNumber}
                  onChange={(e) => setPrescriptionNumber(e.target.value)}
                  placeholder="RX-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <Input
                  type="date"
                  value={prescriptionDate}
                  onChange={(e) => setPrescriptionDate(e.target.value)}
                />
              </div>
            </div>

            {/* Selección de paciente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paciente
              </label>
              <select
                value={selectedPatient?.id || ''}
                onChange={(e) => {
                  const patient = patients?.find(p => p.id === e.target.value);
                  setSelectedPatient(patient || null);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Seleccionar paciente...</option>
                {patients && patients.length > 0 ? patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.owner}
                  </option>
                )) : (
                  <option value="" disabled>No hay pacientes disponibles</option>
                )}</select>
            </div>

            {/* Veterinario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Veterinario
              </label>
              <Input
                value={veterinarian}
                onChange={(e) => setVeterinarian(e.target.value)}
                required
              />
            </div>

            {/* Añadir medicamentos */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Medicamentos</h4>
              <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    placeholder="Nombre del medicamento"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  />
                  <Input
                    placeholder="Dosis (ej: 250mg)"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  />
                  <Input
                    placeholder="Frecuencia (ej: cada 8h)"
                    value={newMedication.frequency}
                    onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                  />
                  <Input
                    placeholder="Duración (ej: 7 días)"
                    value={newMedication.duration}
                    onChange={(e) => setNewMedication({...newMedication, duration: e.target.value})}
                  />
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Instrucciones especiales"
                      value={newMedication.instructions}
                      onChange={(e) => setNewMedication({...newMedication, instructions: e.target.value})}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  icon={<Plus size={18} />}
                  onClick={addMedication}
                  disabled={!newMedication.name || !newMedication.dosage}
                >
                  Añadir Medicamento
                </Button>
              </div>
            </div>

            {/* Lista de medicamentos añadidos */}
            {medications && medications.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Medicamentos Añadidos</h4>
                <div className="space-y-2">
                  {medications.map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{medication.name}</div>
                        <div className="text-sm text-gray-600">
                          {medication.dosage} - {medication.frequency} - {medication.duration}
                        </div>
                        {medication.instructions && (
                          <div className="text-sm text-gray-500">{medication.instructions}</div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedication(medication.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
                placeholder="Instrucciones especiales, recomendaciones..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-between space-x-4">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  icon={<FileText size={18} />}
                  onClick={handlePreview}
                  disabled={!selectedPatient || medications.length === 0}
                >
                  Vista Previa
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedPatient || medications.length === 0}
                >
                  Crear Receta
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {/* Vista Previa Modal */}
      {showPreview && selectedPatient && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 no-print">
              <h3 className="text-lg font-medium text-gray-900">
                Vista Previa de Receta - {prescriptionNumber}
              </h3>
              <div className="flex space-x-2">
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
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Contenido de la receta para imprimir */}
            <div ref={printRef} className="prescription-print-content">
              <div className="p-8 bg-white">
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">RECETA VETERINARIA</h1>
                  <div className="mt-2 text-sm text-gray-600">
                    Clínica Veterinaria • Tel: 91 123 45 67 • Email: info@clinica.com
                  </div>
                </div>

                {/* Información de la receta */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos de la Receta</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Número:</span> {prescriptionNumber}
                      </div>
                      <div>
                        <span className="font-medium">Fecha:</span> {new Date(prescriptionDate).toLocaleDateString('es-ES')}
                      </div>
                      <div>
                        <span className="font-medium">Veterinario:</span> {veterinarian}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Paciente</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Paciente:</span> {selectedPatient.name}
                      </div>
                      <div>
                        <span className="font-medium">Especie:</span> {selectedPatient.species}
                      </div>
                      <div>
                        <span className="font-medium">Raza:</span> {selectedPatient.breed}
                      </div>
                      <div>
                        <span className="font-medium">Edad:</span> {selectedPatient.age} años
                      </div>
                      <div>
                        <span className="font-medium">Propietario:</span> {selectedPatient.owner}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medicamentos */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Medicamentos Prescritos</h3>
                  <div className="space-y-6">
                    {medications && medications.map((medication, index) => (
                      <div key={medication.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Pill className="text-blue-600 mr-2" size={20} />
                              <h4 className="text-lg font-medium text-gray-900">{medication.name}</h4>
                            </div>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Dosis</p>
                                <p className="text-sm font-medium">{medication.dosage}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Frecuencia</p>
                                <p className="text-sm font-medium">{medication.frequency}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Duración</p>
                                <p className="text-sm font-medium">{medication.duration}</p>
                              </div>
                            </div>
                            {medication.instructions && (
                              <div className="mt-3">
                                <p className="text-sm text-gray-500">Instrucciones</p>
                                <p className="text-sm">{medication.instructions}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notas */}
                {notes && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas Adicionales</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{notes}</p>
                    </div>
                  </div>
                )}

                {/* Footer con QR y firma */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Código QR</h4>
                    <div className="flex justify-center">
                      <QRCode
                        value={generateQRData()}
                        size={120}
                        level="M"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Escanea para verificar la receta
                    </p>
                  </div>

                  <div className="text-center">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Firma y Sello</h4>
                    <div className="border-2 border-dashed border-gray-300 h-24 flex items-center justify-center">
                      <p className="text-sm text-gray-500">Firma del veterinario</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-gray-600">Colegiado: 12345</p>
                      <p className="text-xs text-gray-600">COLEGIO OFICIAL DE VETERINARIOS</p>
                    </div>
                  </div>
                </div>

                {/* Información legal */}
                <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                  <p className="text-xs text-gray-500">
                    Esta receta es válida únicamente para el paciente especificado. 
                    Para cualquier consulta, contacte con la clínica veterinaria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPrescriptionForm;