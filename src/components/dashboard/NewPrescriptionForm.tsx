import React, { useState, useRef } from 'react';
import { FileText, X, Pill, Printer, Download } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import QRCode from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValidator, type NewPrescriptionFormInput, type NewPrescriptionFormOutput } from '../../validators/formValidator';

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  owner: string;
  ownerPhone: string;
  petId?: string;
}

interface NewPrescriptionFormProps {
  onSubmit: (prescription: NewPrescriptionFormOutput) => void;
  onCancel: () => void;
  patients: Patient[];
  employees: Array<{ _id: string; firstName: string; lastName: string; position: string }>;
  medicines: Array<{ id: string; name: string; activeIngredient: string }>;
}

const NewPrescriptionForm: React.FC<NewPrescriptionFormProps> = ({ 
  onSubmit, 
  onCancel, 
  patients, 
  employees = [], 
  medicines = [] 
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [veterinarian, setVeterinarian] = useState('Dr. Juan Pérez');
  const [selectedEmployee, setSelectedEmployee] = useState<{ _id: string; firstName: string; lastName: string; position: string } | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  const form = useForm<NewPrescriptionFormInput, unknown, NewPrescriptionFormOutput>({
    resolver: zodResolver(FormValidator.newPrescription()),
    defaultValues: {
      patientId: '',
      petId: '',
      employeeId: '',
      medicines: [],
      notes: ''
    }
  });

  const { control, handleSubmit, formState: { errors }, watch, setValue } = form;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
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
    if (!selectedPatient || selectedMedicines.length === 0) return;

    const prescriptionData = {
      prescriptionNumber: prescriptionNumber,
      date: new Date().toISOString().split('T')[0],
      patientName: selectedPatient.name,
      petName: selectedPatient.name,
      petDetails: `${selectedPatient.species} ${selectedPatient.breed || ''}`,
      diagnosis: watch("notes") || '',
             medications: selectedMedicines.map(medicineId => {
         const medicine = medicines.find(m => m.id === medicineId);
         return {
           id: medicineId,
           name: medicine?.name || 'Medicamento no encontrado',
           dosage: 'Según indicaciones del veterinario',
           frequency: 'Según indicaciones del veterinario',
           duration: 'Según indicaciones del veterinario',
           notes: ''
         };
       }),
      notes: watch("notes") || '',
      doctor: veterinarian,
      clinic: {
        name: "ClinicPro",
        address: "Calle de Beatriz de Bobadilla, 9, 28040 Madrid",
        phone: "+34 912 345 678",
        email: "info@clinicpro.com"
      }
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
      date: new Date().toISOString().split('T')[0],
      patient: selectedPatient.name,
      owner: selectedPatient.owner,
      veterinarian,
      medicines: selectedMedicines
    });
  };

  const addMedicine = (medicineId: string) => {
    if (!selectedMedicines.includes(medicineId)) {
      const newSelectedMedicines = [...selectedMedicines, medicineId];
      setSelectedMedicines(newSelectedMedicines);
      setValue("medicines", newSelectedMedicines);
    }
  };

  const removeMedicine = (medicineId: string) => {
    const newSelectedMedicines = selectedMedicines.filter(id => id !== medicineId);
    setSelectedMedicines(newSelectedMedicines);
    setValue("medicines", newSelectedMedicines);
  };

  const onSubmitForm = async (values: NewPrescriptionFormOutput) => {
    if (!selectedPatient || !selectedEmployee || selectedMedicines.length === 0) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const prescriptionData: NewPrescriptionFormOutput = {
      patientId: selectedPatient.id,
      petId: selectedPatient.petId,
      employeeId: selectedEmployee._id,
      medicines: selectedMedicines,
      notes: values.notes || undefined
    };

    onSubmit(prescriptionData);
  };

  const handlePreview = () => {
    try {
      if (!selectedPatient) {
        console.error('No patient selected');
        alert('Por favor seleccione un paciente');
        return;
      }

      if (selectedMedicines.length === 0) {
        console.error('No medicines selected');
        alert('Por favor seleccione al menos un medicamento');
        return;
      }

      if (!prescriptionNumber) {
        const newNumber = `RX-${Date.now()}`;
        setPrescriptionNumber(newNumber);
        console.log('Generated prescription number:', newNumber);
      }

      console.log('Opening preview with patient:', selectedPatient);
      console.log('Selected medicines:', selectedMedicines);
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

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">

            {/* Selección de paciente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paciente *
              </label>
              <Controller
                name="patientId"
                control={control}
                render={({ field }) => (
                  <select
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
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
                    )}
                  </select>
                )}
              />
              {errors.patientId && (
                <p className="mt-1 text-xs text-red-600">{errors.patientId.message}</p>
              )}
            </div>

            {/* Especialista */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialista *
              </label>
              <Controller
                name="employeeId"
                control={control}
                render={({ field }) => (
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      const employee = employees.find(emp => emp._id === e.target.value);
                      setSelectedEmployee(employee || null);
                      setVeterinarian(employee ? `${employee.firstName} ${employee.lastName}` : '');
                    }}
                    required
                  >
                    <option value="">Seleccionar especialista</option>
                    {employees && employees.length > 0 ? employees.map(employee => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName} - {employee.position}
                      </option>
                    )) : (
                      <option value="" disabled>No hay especialistas disponibles</option>
                    )}
                  </select>
                )}
              />
              {errors.employeeId && (
                <p className="mt-1 text-xs text-red-600">{errors.employeeId.message}</p>
              )}
            </div>

            {/* Selección de medicamentos */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Medicamentos *</h4>
              <div className="border border-gray-200 rounded-lg p-4">
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addMedicine(e.target.value);
                      e.target.value = ''; // Reset select
                    }
                  }}
                >
                  <option value="">Seleccionar medicamento para añadir</option>
                  {medicines.map(medicine => (
                    <option key={medicine.id} value={medicine.id}>
                      {medicine.name} - {medicine.activeIngredient}
                    </option>
                  ))}
                </select>
              </div>
              {errors.medicines && (
                <p className="mt-1 text-xs text-red-600">{errors.medicines.message}</p>
              )}
            </div>

            {/* Lista de medicamentos seleccionados */}
            {selectedMedicines.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Medicamentos Seleccionados</h4>
                <div className="space-y-2">
                  {selectedMedicines.map((medicineId) => {
                    const medicine = medicines.find(m => m.id === medicineId);
                    return medicine ? (
                      <div key={medicineId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <Pill className="text-blue-600 mr-2" size={18} />
                          <div>
                            <div className="font-medium text-gray-900">{medicine.name}</div>
                            <div className="text-sm text-gray-600">{medicine.activeIngredient}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMedicine(medicineId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas adicionales
              </label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows={3}
                    placeholder="Instrucciones especiales, recomendaciones..."
                  />
                )}
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
                  disabled={!selectedPatient || !selectedEmployee || selectedMedicines.length === 0}
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
                  disabled={!selectedPatient || !selectedEmployee || selectedMedicines.length === 0}
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
                        <span className="font-medium">Fecha:</span> {new Date().toLocaleDateString('es-ES')}
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
                  <div className="space-y-4">
                                         {selectedMedicines.map((medicineId, index) => {
                       const medicine = medicines.find(m => m.id === medicineId);
                       return medicine ? (
                         <div key={medicineId} className="border border-gray-200 rounded-lg p-4">
                           <div className="flex items-start">
                             <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                               <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                             </div>
                             <div className="flex-1">
                               <div className="flex items-center mb-2">
                                 <Pill className="text-blue-600 mr-2" size={20} />
                                 <h4 className="text-lg font-medium text-gray-900">{medicine.name}</h4>
                               </div>
                               <div className="mt-2">
                                 <p className="text-sm text-gray-600">{medicine.activeIngredient}</p>
                                 <p className="text-sm text-gray-500 mt-1">
                                   Dosis, frecuencia y duración según indicaciones del veterinario
                                 </p>
                               </div>
                             </div>
                           </div>
                         </div>
                       ) : null;
                     })}
                  </div>
                </div>

                {/* Notas */}
                {watch("notes") && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas Adicionales</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{watch("notes")}</p>
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