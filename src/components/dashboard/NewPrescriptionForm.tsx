import React, { useState } from 'react';
import { X, Search, Calendar, Euro, FileText, Printer, Download, Receipt, Mail, MessageSquare, Phone, Share2, Plus, Trash, Pill, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { mockPatients } from '../../data/mockData';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import { QRCodeSVG } from 'qrcode.react';

interface NewPrescriptionFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

// Mock medications data
const mockMedications = [
  {
    id: '1',
    name: 'Amoxicilina 250mg',
    activeIngredient: 'Amoxicilina',
    manufacturer: 'Laboratorios MSD',
    type: 'Antibiótico',
    conditions: ['Infección bacteriana', 'Infección respiratoria'],
    dosageForm: 'Comprimidos',
    recommendedDosage: '1 comprimido cada 12 horas',
    duration: '7-14 días',
    contraindications: ['Alergia a penicilinas'],
    sideEffects: ['Diarrea', 'Vómitos'],
    interactions: ['No administrar con otros antibióticos'],
    aiScore: 95
  },
  {
    id: '2',
    name: 'Meloxicam 1.5mg/ml',
    activeIngredient: 'Meloxicam',
    manufacturer: 'Boehringer Ingelheim',
    type: 'Antiinflamatorio',
    conditions: ['Dolor', 'Inflamación', 'Artritis'],
    dosageForm: 'Suspensión oral',
    recommendedDosage: '0.2mg/kg el primer día, luego 0.1mg/kg',
    duration: '5-7 días',
    contraindications: ['Problemas renales', 'Úlceras gástricas'],
    sideEffects: ['Problemas digestivos'],
    interactions: ['No combinar con otros AINEs'],
    aiScore: 88
  },
  {
    id: '3',
    name: 'Apoquel 16mg',
    activeIngredient: 'Oclacitinib',
    manufacturer: 'Zoetis',
    type: 'Antialérgico',
    conditions: ['Dermatitis atópica', 'Prurito'],
    dosageForm: 'Comprimidos',
    recommendedDosage: '0.4-0.6mg/kg cada 12 horas',
    duration: 'Según respuesta',
    contraindications: ['Infecciones graves'],
    sideEffects: ['Letargia', 'Anorexia'],
    interactions: ['Inmunosupresores'],
    aiScore: 92
  },
  {
    id: '4',
    name: 'Simparica 80mg',
    activeIngredient: 'Sarolaner',
    manufacturer: 'Zoetis',
    type: 'Antiparasitario',
    conditions: ['Pulgas', 'Garrapatas', 'Ácaros'],
    dosageForm: 'Comprimidos masticables',
    recommendedDosage: '1 comprimido mensual',
    duration: 'Mensual',
    contraindications: ['Cachorros menores de 8 semanas'],
    sideEffects: ['Vómitos', 'Diarrea (poco frecuentes)'],
    interactions: ['No conocidas'],
    aiScore: 96
  },
  {
    id: '5',
    name: 'Metacam 1.5mg/ml',
    activeIngredient: 'Meloxicam',
    manufacturer: 'Boehringer Ingelheim',
    type: 'Antiinflamatorio',
    conditions: ['Dolor', 'Inflamación', 'Artritis'],
    dosageForm: 'Suspensión oral',
    recommendedDosage: '0.1mg/kg una vez al día',
    duration: '5-7 días',
    contraindications: ['Problemas renales', 'Úlceras gástricas'],
    sideEffects: ['Problemas digestivos'],
    interactions: ['No combinar con otros AINEs'],
    aiScore: 90
  }
];

const NewPrescriptionForm: React.FC<NewPrescriptionFormProps> = ({ onClose, onSubmit }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPrescriptionPreview, setShowPrescriptionPreview] = useState(false);
  const [medicationSearchTerm, setMedicationSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptionData, setPrescriptionData] = useState({
    number: `RX-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    notes: '',
  });
  const [selectedMedications, setSelectedMedications] = useState<Medication[]>([]);
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
  const [showMedicationDetails, setShowMedicationDetails] = useState<string | null>(null);

  // Check if prescription can be generated
  const canGeneratePrescription = 
    selectedPatient && 
    selectedMedications.length > 0 &&
    diagnosis.trim() !== '';

  // Filter patients based on search term
  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  // Filter medications based on search term and condition
  const filteredMedications = mockMedications.filter(medication => {
    const matchesSearch = medication.name.toLowerCase().includes(medicationSearchTerm.toLowerCase()) ||
                         medication.activeIngredient.toLowerCase().includes(medicationSearchTerm.toLowerCase());
    const matchesCondition = !selectedCondition || medication.conditions.includes(selectedCondition);
    return matchesSearch && matchesCondition;
  });

  // Get unique conditions from medications
  const conditions = Array.from(new Set(mockMedications.flatMap(med => med.conditions)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const prescriptionInfo = {
      ...formData,
      ...prescriptionData,
      diagnosis,
      medications: selectedMedications,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      petName: selectedPatient.pet.name,
      status: 'active',
      shareMethod
    };

    onSubmit(prescriptionInfo);
    onClose();

    // Navigate to a confirmation page or back to dashboard
    navigate('/dashboard', { 
      state: { 
        newPrescription: true,
        prescriptionNumber: prescriptionData.number
      } 
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrescriptionDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrescriptionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMedication = (medication: any) => {
    const newMedication: Medication = {
      id: medication.id,
      name: medication.name,
      dosage: medication.recommendedDosage,
      frequency: medication.recommendedDosage.includes('cada') ? 
        medication.recommendedDosage.split('cada')[1].trim() : 
        'Según indicaciones',
      duration: medication.duration,
      notes: ''
    };

    setSelectedMedications(prev => [...prev, newMedication]);
  };

  const handleRemoveMedication = (id: string) => {
    setSelectedMedications(prev => prev.filter(med => med.id !== id));
  };

  const handleUpdateMedication = (id: string, field: keyof Medication, value: string) => {
    setSelectedMedications(prev => 
      prev.map(med => 
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const handlePrintPrescription = () => {
    window.print();
  };

  const handleDownloadPrescription = () => {
    if (!selectedPatient) return;

    const data = {
      prescriptionNumber: prescriptionData.number,
      date: formData.date,
      patientName: selectedPatient.name,
      petName: selectedPatient.pet.name,
      petDetails: `${selectedPatient.pet.species} ${selectedPatient.pet.breed}, ${selectedPatient.pet.sex === 'male' ? 'Macho' : 'Hembra'}, ${new Date().getFullYear() - new Date(selectedPatient.pet.birthDate).getFullYear()} años`,
      diagnosis: diagnosis,
      medications: selectedMedications,
      notes: formData.notes || prescriptionData.notes,
      doctor: "Dr. Alejandro Ramírez",
      clinic: {
        name: "ClinicPro",
        address: "Calle de Beatriz de Bobadilla, 9, 28040 Madrid",
        phone: "+34 912 345 678",
        email: "info@clinicpro.com"
      }
    };

    const doc = generatePrescriptionPDF(data);
    doc.save(`receta-${prescriptionData.number}.pdf`);
  };

  const handleSharePrescription = (method: 'email' | 'whatsapp' | 'sms') => {
    setShareMethod(method);

    // Create a summary of medications for the message
    const medicationsSummary = selectedMedications.map(med => 
      `${med.name} - ${med.dosage} ${med.frequency ? `(${med.frequency})` : ''} - ${med.duration}`
    ).join('\n');

    if (method === 'email') {
      setEmailData({
        to: selectedPatient.email || '',
        subject: `Receta Médica ${prescriptionData.number} - ClinicPro`,
        message: `Estimado/a ${selectedPatient.name},\n\nAdjunto encontrará la receta médica para ${selectedPatient.pet.name} con número ${prescriptionData.number}.\n\nDiagnóstico: ${diagnosis}\n\nMedicamentos:\n${medicationsSummary}\n\nSi tiene alguna pregunta, no dude en contactarnos.\n\nSaludos cordiales,\nDr. Alejandro Ramírez\nClinicPro`
      });
      setShowEmailForm(true);
    } 
    else if (method === 'whatsapp') {
      setWhatsappData({
        number: selectedPatient.phone || '',
        message: `Hola ${selectedPatient.name}, le enviamos la receta médica para ${selectedPatient.pet.name} con número ${prescriptionData.number}.\n\nDiagnóstico: ${diagnosis}\n\nMedicamentos:\n${medicationsSummary}\n\nSaludos, Dr. Alejandro Ramírez - ClinicPro.`
      });
      setShowWhatsappForm(true);
    }
    else if (method === 'sms') {
      setSmsData({
        number: selectedPatient.phone || '',
        message: `ClinicPro: Receta ${prescriptionData.number} para ${selectedPatient.pet.name}. Diagnóstico: ${diagnosis}. Medicamentos: ${selectedMedications.map(m => m.name).join(', ')}.`
      });
      setShowSmsForm(true);
    }
  };

  const handleSendEmail = () => {
    // In a real app, this would send an email with the prescription attached
    console.log('Sending email:', emailData);

    // Close the form and proceed with form submission
    setShowEmailForm(false);
    handleSubmit(new Event('submit') as any);
  };

  const handleSendWhatsapp = () => {
    // In a real app, this would send a WhatsApp message with the prescription
    console.log('Sending WhatsApp:', whatsappData);

    // For demo purposes, we'll open a WhatsApp web link
    const encodedMessage = encodeURIComponent(whatsappData.message);
    const whatsappUrl = `https://wa.me/${whatsappData.number.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    // Close the form and proceed with form submission
    setShowWhatsappForm(false);
    handleSubmit(new Event('submit') as any);
  };

  const handleSendSms = () => {
    // In a real app, this would send an SMS with the prescription
    console.log('Sending SMS:', smsData);

    // For demo purposes, we'll try to open the native SMS app
    const encodedMessage = encodeURIComponent(smsData.message);
    const smsUrl = `sms:${smsData.number}?body=${encodedMessage}`;
    window.location.href = smsUrl;

    // Close the form and proceed with form submission
    setShowSmsForm(false);
    handleSubmit(new Event('submit') as any);
  };

  const generateQRData = (prescriptionData: any, selectedPatient: any, diagnosis: string, selectedMedications: Medication[]) => {
    return JSON.stringify({
      prescriptionNumber: prescriptionData.number,
      date: formData.date,
      patientName: selectedPatient.name,
      petName: selectedPatient.pet.name,
      diagnosis: diagnosis,
      medications: selectedMedications.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        notes: med.notes
      })),
      clinic: "ClinicPro",
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nueva Receta</h2>
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
                      <h3 className="text-sm font-medium text-blue-900">Paciente Seleccionado</h3>
                      <p className="mt-1 text-sm text-blue-700">{selectedPatient.name}</p>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {selectedPatient.pet.name} • {selectedPatient.pet.breed} • {selectedPatient.pet.sex === 'male' ? 'Macho' : 'Hembra'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPatient(null)}
                      className="text-blue-700 hover:text-blue-800 text-sm font-medium"
                    >
                      Cambiar paciente
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
                      Número de Receta
                    </label>
                    <Input
                      type="text"
                      name="number"
                      value={prescriptionData.number}
                      onChange={handlePrescriptionDataChange}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnóstico
                  </label>
                  <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Ingrese el diagnóstico del paciente..."
                    required
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Medicamentos</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Buscar medicamentos..."
                        value={medicationSearchTerm}
                        onChange={(e) => setMedicationSearchTerm(e.target.value)}
                        icon={<Search size={18} />}
                      />

                      <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={selectedCondition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                      >
                        <option value="">Todas las dolencias</option>
                        {conditions.map(condition => (
                          <option key={condition} value={condition}>{condition}</option>
                        ))}
                      </select>
                    </div>

                    <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                      {filteredMedications.map(medication => (
                        <div key={medication.id} className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{medication.name}</h4>
                              <p className="text-xs text-gray-500">{medication.activeIngredient} • {medication.manufacturer}</p>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {medication.conditions.map(condition => (
                                  <span key={condition} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {condition}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setShowMedicationDetails(medication.id === showMedicationDetails ? null : medication.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                {medication.id === showMedicationDetails ? 'Ocultar detalles' : 'Ver detalles'}
                              </button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                icon={<Plus size={16} />}
                                onClick={() => handleAddMedication(medication)}
                                disabled={selectedMedications.some(med => med.id === medication.id)}
                              >
                                Añadir
                              </Button>
                            </div>
                          </div>

                          {medication.id === showMedicationDetails && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Tipo</p>
                                  <p className="font-medium">{medication.type}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Forma</p>
                                  <p className="font-medium">{medication.dosageForm}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Posología recomendada</p>
                                  <p className="font-medium">{medication.recommendedDosage}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Duración recomendada</p>
                                  <p className="font-medium">{medication.duration}</p>
                                </div>
                              </div>
                              <div className="mt-3">
                                <p className="text-gray-500">Contraindicaciones</p>
                                <p className="font-medium">{medication.contraindications.join(', ')}</p>
                              </div>
                              <div className="mt-2">
                                <p className="text-gray-500">Efectos secundarios</p>
                                <p className="font-medium">{medication.sideEffects.join(', ')}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {filteredMedications.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                          No se encontraron medicamentos que coincidan con la búsqueda
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {selectedMedications.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Medicamentos Seleccionados</h3>
                    <div className="space-y-4">
                      {selectedMedications.map((medication, index) => (
                        <div key={medication.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-medium text-gray-700">{medication.name}</h4>
                            <button
                              type="button"
                              onClick={() => handleRemoveMedication(medication.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash size={16} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dosis
                              </label>
                              <Input
                                type="text"
                                value={medication.dosage}
                                onChange={(e) => handleUpdateMedication(medication.id, 'dosage', e.target.value)}
                                placeholder="Ej: 1 comprimido"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Frecuencia
                              </label>
                              <Input
                                type="text"
                                value={medication.frequency}
                                onChange={(e) => handleUpdateMedication(medication.id, 'frequency', e.target.value)}
                                placeholder="Ej: Cada 8 horas"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duración
                              </label>
                              <Input
                                type="text"
                                value={medication.duration}
                                onChange={(e) => handleUpdateMedication(medication.id, 'duration', e.target.value)}
                                placeholder="Ej: 7 días"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notas Adicionales
                              </label>
                              <Input
                                type="text"
                                value={medication.notes}
                                onChange={(e) => handleUpdateMedication(medication.id, 'notes', e.target.value)}
                                placeholder="Ej: Tomar con comida"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas Generales
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
                    onClick={() => setShowPrescriptionPreview(true)}
                    className="w-full"
                    disabled={!canGeneratePrescription}
                  >
                    Vista Previa de la Receta
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
                      Guardar Receta
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Prescription Preview Modal */}
        {showPrescriptionPreview && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Vista Previa de Receta</h3>
                <button
                  onClick={() => setShowPrescriptionPreview(false)}
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
                        <Stethoscope size={32} className="text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">ClinicPro</h1>
                      </div>
                      <div className="mt-2 text-gray-600">
                        <p>Calle de Beatriz de Bobadilla, 9</p>
                        <p>28040 Madrid</p>
                        <p>Tel: +34 912 345 678</p>
                        <p>Email: info@clinicpro.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-semibold text-gray-900">RECETA MÉDICA</h2>
                      <div className="mt-2 text-gray-600">
                        <p>Nº: {prescriptionData.number}</p>
                        <p>Fecha: {new Date(formData.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Datos del Propietario</h3>
                      <p className="font-medium text-gray-900">{selectedPatient.name}</p>
                      <p className="text-gray-600">{selectedPatient.email}</p>
                      <p className="text-gray-600">{selectedPatient.phone}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Datos del Paciente</h3>
                      <p className="font-medium text-gray-900">{selectedPatient.pet.name}</p>
                      <p className="text-gray-600">
                        {selectedPatient.pet.species} {selectedPatient.pet.breed}
                      </p>
                      <p className="text-gray-600">
                        {selectedPatient.pet.sex === 'male' ? 'Macho' : 'Hembra'}, {
                          new Date().getFullYear() - new Date(selectedPatient.pet.birthDate).getFullYear()
                        } años
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Diagnóstico</h3>
                    <p className="text-gray-900">{diagnosis}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Medicamentos Prescritos</h3>
                    <div className="space-y-4">
                      {selectedMedications.map((medication, index) => (
                        <div key={medication.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <Pill className="text-blue-600 mr-2" size={20} />
                            <h4 className="text-lg font-medium text-gray-900">{medication.name}</h4>
                          </div>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4```text
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
                          {medication.notes && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">Notas</p>
                              <p className="text-sm font-medium">{medication.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {formData.notes && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Notas Adicionales</h3>
                      <p className="text-gray-900">{formData.notes}</p>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="font-medium text-gray-900">Dr. Alejandro Ramírez</p>
                        <p className="text-gray-600">Veterinario Colegiado</p>
                        <p className="text-gray-600">Nº Colegiado: 12345</p>
                      </div>
                      <div className="w-32 h-16 border border-gray-300 rounded flex items-center justify-center text-gray-400">
                        [Firma]
                      </div>
                    </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Código QR</h4>
                        <div className="bg-white p-3 rounded-lg border border-gray-200 inline-block">
                          <QRCodeSVG 
                            value={generateQRData(prescriptionData, selectedPatient, diagnosis, selectedMedications)}
                            size={120}
                            level="H"
                            includeMargin={true}
                          />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          Escaneable en farmacias según protocolo español
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Compartir receta</h4>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Mail size={16} />}
                        onClick={() => handleSharePrescription('email')}
                      >
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<MessageSquare size={16} />}
                        onClick={() => handleSharePrescription('whatsapp')}
                      >
                        WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Phone size={16} />}
                        onClick={() => handleSharePrescription('sms')}
                      >
                        SMS
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      icon={<Printer size={18} />}
                      onClick={handlePrintPrescription}
                    >
                      Imprimir
                    </Button>
                    <Button
                      variant="outline"
                      icon={<Download size={18} />}
                      onClick={handleDownloadPrescription}
                    >
                      Descargar PDF
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPrescriptionPreview(false)}
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

export default NewPrescriptionForm;