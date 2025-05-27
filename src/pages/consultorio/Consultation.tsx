import React, { useState } from 'react';
import { Save, Printer, Download, Clock, Calendar, User, FileText, Plus, Paperclip, X, Camera, Search, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface ConsultationFormData {
  anamnesis: string;
  exploration: string;
  diagnosis: string;
  treatment: string;
  nextVisit?: string;
  notes?: string;
  physicalExam?: {
    temperature?: string;
    temperatureUnit?: 'C' | 'F';
    weight?: string;
    weightUnit?: 'kg' | 'lb';
    icc?: string;
    tllc?: string;
    heartRate?: string;
    respiratoryRate?: string;
    reflexes?: string;
    pulse?: string;
    saturation?: string;
    bloodPressure?: string;
    mucous?: 'normal' | 'pale' | 'hyperemic' | 'cyanotic' | 'icteric';
    glycemia?: string;
    palpation?: string;
  };
  specialPhysicalExam?: {
    attitude?: string;
    hydration?: string;
    nutritionalStatus?: string;
    superficialLymphNodes?: string;
    mucous?: string;
    cardiovascularSystem?: string;
    respiratorySystem?: string;
    digestiveSystem?: string;
    urinarySystem?: string;
    reproductiveSystem?: string;
    musculoskeletalSystem?: string;
    nervousSystem?: string;
    skinAndAnnexes?: string;
    eyesAndEars?: string;
  };
  testsAndSurgery?: {
    laboratoryTests: Array<{
      type: string;
      notes: string;
    }>;
    imagingTests: Array<{
      type: string;
      notes: string;
    }>;
    surgicalProcedures: Array<{
      type: string;
      notes: string;
    }>;
  };
  deworming?: {
    date: string;
    product: string;
    dose: string;
    lastDeworming: string;
    nextControl: string;
    attachment?: File;
    notes: string;
  };
  vaccinations?: {
    date: string;
    vaccine: string;
    laboratory: string; 
    lot: string;
    nextVaccination: string;
    notes: string;
  };
  prescriptions?: {
    condition: string;
    activeIngredient: string;
    manufacturer: string;
    selectedMedications: Array<{
      id: string;
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      notes: string;
    }>;
  };
}

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
  }
];

const Consultation: React.FC = () => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    anamnesis: '',
    exploration: '',
    diagnosis: '',
    treatment: '',
    physicalExam: {
      temperature: '',
      temperatureUnit: 'C',
      weight: '',
      weightUnit: 'kg',
      icc: '',
      tllc: '',
      heartRate: '',
      respiratoryRate: '',
      reflexes: '',
      pulse: '',
      saturation: '',
      bloodPressure: '',
      mucous: 'normal',
      glycemia: '',
      palpation: ''
    },
    testsAndSurgery: {
      laboratoryTests: [],
      imagingTests: [],
      surgicalProcedures: []
    }
  });

  const [activeTab, setActiveTab] = useState('medical-info');
  const [files, setFiles] = useState<File[]>([]);

  const [prescriptionFilters, setPrescriptionFilters] = useState({
    condition: '',
    activeIngredient: '',
    manufacturer: '',
    searchTerm: ''
  });

  const filteredMedications = mockMedications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(prescriptionFilters.searchTerm.toLowerCase()) ||
                         med.activeIngredient.toLowerCase().includes(prescriptionFilters.searchTerm.toLowerCase());
    const matchesCondition = !prescriptionFilters.condition || med.conditions.includes(prescriptionFilters.condition);
    const matchesIngredient = !prescriptionFilters.activeIngredient || med.activeIngredient === prescriptionFilters.activeIngredient;
    const matchesManufacturer = !prescriptionFilters.manufacturer || med.manufacturer === prescriptionFilters.manufacturer;
    return matchesSearch && matchesCondition && matchesIngredient && matchesManufacturer;
  });

  const conditions = Array.from(new Set(mockMedications.flatMap(med => med.conditions)));
  const activeIngredients = Array.from(new Set(mockMedications.map(med => med.activeIngredient)));
  const manufacturers = Array.from(new Set(mockMedications.map(med => med.manufacturer)));

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('physicalExam.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        physicalExam: {
          ...prev.physicalExam,
          [field]: value
        }
      }));
    } else if (name.includes('specialPhysicalExam.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specialPhysicalExam: {
          ...prev.specialPhysicalExam,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleTakePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Photo captured:', file);
      }
    };
    input.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Consulta Veterinaria</h1>
            <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                21/05/2025
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                10:30
              </span>
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                Dr. Alejandro Ramírez
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              icon={<Printer size={18} />}
            >
              Imprimir
            </Button>
            <Button
              variant="outline"
              icon={<Download size={18} />}
            >
              Exportar
            </Button>
            <Button
              variant="primary"
              icon={<Save size={18} />}
            >
              Guardar
            </Button>
          </div>
        </div>

        {/* Patient Info */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-blue-900">Paciente</h3>
              <p className="mt-1">
                <span className="text-lg font-medium text-blue-900">Luna</span>
                <span className="ml-2 text-sm text-blue-700">
                  (Labrador, 3 años, Hembra)
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900">Propietario</h3>
              <p className="mt-1 text-blue-900">María García</p>
              <p className="text-sm text-blue-700">666 777 888</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900">Motivo de la Consulta</h3>
              <p className="mt-1 text-blue-700">Revisión Anual + Vacunación</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('medical-info')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'medical-info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Información Médica
            </button>
            <button
              onClick={() => setActiveTab('physical-exam')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'physical-exam'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Examen Físico General
            </button>
            <button
              onClick={() => setActiveTab('special-exam')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'special-exam'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Examen Físico Especial
            </button>
            <button
              onClick={() => setActiveTab('tests-surgery')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'tests-surgery'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Pruebas & Cirugía
            </button>
            <button
              onClick={() => setActiveTab('deworming')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'deworming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Desparasitaciones
            </button>
            <button
              onClick={() => setActiveTab('vaccinations')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'vaccinations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Vacunaciones
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'prescriptions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Recetas
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'medical-info' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <div className="p-6 space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anamnesis
                  </label>
                  <textarea
                    name="anamnesis"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.anamnesis}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exploración
                  </label>
                  <textarea
                    name="exploration"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.exploration}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnóstico
                  </label>
                  <textarea
                    name="diagnosis"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tratamiento
                  </label>
                  <textarea
                    name="treatment"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.treatment}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Próxima Visita
                    </label>
                    <Input
                      type="date"
                      name="nextVisit"
                      value={formData.nextVisit}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas Adicionales
                    </label>
                    <Input
                      type="text"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Añadir notas..."
                    />
                  </div>
                </div>
              </div>
            </Card>
          </form>
        )}

        {activeTab === 'physical-exam' && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Examen Físico General</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperatura
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="physicalExam.temperature"
                      value={formData.physicalExam?.temperature || ''}
                      onChange={handleInputChange}
                      step="0.1"
                      min="35"
                      max="43"
                      className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="38.5"
                    />
                    <select
                      name="physicalExam.temperatureUnit"
                      value={formData.physicalExam?.temperatureUnit || 'C'}
                      onChange={handleInputChange}
                      className="rounded-r-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="C">°C</option>
                      <option value="F">°F</option>
                    </select>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="physicalExam.weight"
                      value={formData.physicalExam?.weight || ''}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="25.5"
                    />
                    <select
                      name="physicalExam.weightUnit"
                      value={formData.physicalExam?.weightUnit || 'kg'}
                      onChange={handleInputChange}
                      className="rounded-r-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="kg">kg</option>
                      <option value="lb">lb</option>
                    </select>
                  </div>
                </div>

                {/* ICC (Índice de Condición Corporal) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ICC (1-9)
                  </label>
                  <select
                    name="physicalExam.icc"
                    value={formData.physicalExam?.icc || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Seleccionar</option>
                    <option value="1">1 - Caquéctico</option>
                    <option value="2">2 - Muy delgado</option>
                    <option value="3">3 - Delgado</option>
                    <option value="4">4 - Bajo peso ideal</option>
                    <option value="5">5 - Peso ideal</option>
                    <option value="6">6 - Sobrepeso leve</option>
                    <option value="7">7 - Sobrepeso</option>
                    <option value="8">8 - Obeso</option>
                    <option value="9">9 - Obesidad mórbida</option>
                  </select>
                </div>

                {/* TLLC (Tiempo de Llenado Capilar) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TLLC (segundos)
                  </label>
                  <input
                    type="number"
                    name="physicalExam.tllc"
                    value={formData.physicalExam?.tllc || ''}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    step="0.5"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="2"
                  />
                </div>

                {/* Heart Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia Cardíaca (lpm)
                  </label>
                  <input
                    type="number"
                    name="physicalExam.heartRate"
                    value={formData.physicalExam?.heartRate || ''}
                    onChange={handleInputChange}
                    min="40"
                    max="220"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="80"
                  />
                </div>

                {/* Respiratory Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia Respiratoria (rpm)
                  </label>
                  <input
                    type="number"
                    name="physicalExam.respiratoryRate"
                    value={formData.physicalExam?.respiratoryRate || ''}
                    onChange={handleInputChange}
                    min="10"
                    max="60"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="20"
                  />
                </div>

                {/* Reflexes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reflejos
                  </label>
                  <select
                    name="physicalExam.reflexes"
                    value={formData.physicalExam?.reflexes || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Seleccionar</option>
                    <option value="normales">Normales</option>
                    <option value="aumentados">Aumentados</option>
                    <option value="disminuidos">Disminuidos</option>
                    <option value="ausentes">Ausentes</option>
                  </select>
                </div>

                {/* Pulse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pulso
                  </label>
                  <select
                    name="physicalExam.pulse"
                    value={formData.physicalExam?.pulse || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Seleccionar</option>
                    <option value="normal">Normal</option>
                    <option value="débil">Débil</option>
                    <option value="fuerte">Fuerte</option>
                    <option value="irregular">Irregular</option>
                    <option value="ausente">Ausente</option>
                  </select>
                </div>

                {/* Saturation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saturación O₂ (%)
                  </label>
                  <input
                    type="number"
                    name="physicalExam.saturation"
                    value={formData.physicalExam?.saturation || ''}
                    onChange={handleInputChange}
                    min="80"
                    max="100"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="95"
                  />
                </div>

                {/* Blood Pressure */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Presión Arterial (mmHg)
                  </label>
                  <input
                    type="text"
                    name="physicalExam.bloodPressure"
                    value={formData.physicalExam?.bloodPressure || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="120/80"
                  />
                </div>

                {/* Mucous */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mucosas
                  </label>
                  <select
                    name="physicalExam.mucous"
                    value={formData.physicalExam?.mucous || 'normal'}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="normal">Normales</option>
                    <option value="pale">Pálidas</option>
                    <option value="hyperemic">Hiperémicas</option>
                    <option value="cyanotic">Cianóticas</option>
                    <option value="icteric">Ictéricas</option>
                  </select>
                </div>

                {/* Glycemia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Glicemia (mg/dl)
                  </label>
                  <input
                    type="number"
                    name="physicalExam.glycemia"
                    value={formData.physicalExam?.glycemia || ''}
                    onChange={handleInputChange}
                    min="40"
                    max="400"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Palpation */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palpación y Observaciones
                </label>
                <textarea
                  name="physicalExam.palpation"
                  value={formData.physicalExam?.palpation || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Observaciones de la palpación abdominal, ganglios linfáticos, etc."
                />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'tests-surgery' && (
          <div className="space-y-6">
            {/* Laboratory Tests */}
            <Card>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Pruebas de Laboratorio</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="">Seleccionar prueba</option>
                      <option value="blood">Análisis de Sangre</option>
                      <option value="urine">Análisis de Orina</option>
                      <option value="feces">Análisis de Heces</option>
                      <option value="cytology">Citología</option>
                    </select>
                    <Button
                      variant="outline"
                      icon={<Plus size={18} />}
                    >
                      Añadir Prueba
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Imaging Tests */}
            <Card>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Pruebas de Imagen</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="">Seleccionar prueba</option>
                      <option value="xray">Radiografía</option>
                      <option value="ultrasound">Ecografía</option>
                      <option value="ct">TAC</option>
                      <option value="mri">Resonancia Magnética</option>
                    </select>
                    <Button
                      variant="outline"
                      icon={<Plus size={18} />}
                    >
                      Añadir Prueba
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Surgery/Procedures */}
            <Card>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Cirugía/Procedimientos</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                      <option value="">Seleccionar procedimiento</option>
                      <option value="sterilization">Esterilización</option>
                      <option value="dental">Limpieza Dental</option>
                      <option value="tumor">Extirpación de Tumor</option>
                      <option value="fracture">Reparación de Fractura</option>
                    </select>
                    <Button
                      variant="outline"
                      icon={<Plus size={18} />}
                    >
                      Añadir Procedimiento
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Attached Files */}
            <Card>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Archivos Adjuntos</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50">
                      <Paperclip className="w-8 h-8 text-blue-600" />
                      <span className="mt-2 text-base leading-normal text-blue-600">Seleccionar archivos</span>
                      <input type='file' className="hidden" multiple onChange={handleFileChange} />
                    </label>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Archivos seleccionados:</h4>
                      <ul className="space-y-2">
                        {files.map((file, index) => (
                          <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">{file.name}</span>
                            <button
                              onClick={() => setFiles(files.filter((_, i) => i !== index))}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'special-exam' && (
          <Card>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Actitud y Estado General */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actitud y Estado General
                  </label>
                  <textarea
                    name="specialPhysicalExam.attitude"
                    value={formData.specialPhysicalExam?.attitude}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Estado de Hidratación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado de Hidratación
                  </label>
                  <textarea
                    name="specialPhysicalExam.hydration"
                    value={formData.specialPhysicalExam?.hydration}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Estado Nutricional */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado Nutricional
                  </label>
                  <textarea
                    name="specialPhysicalExam.nutritionalStatus"
                    value={formData.specialPhysicalExam?.nutritionalStatus}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Linfonodos Superficiales */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Linfonodos Superficiales
                  </label>
                  <textarea
                    name="specialPhysicalExam.superficialLymphNodes"
                    value={formData.specialPhysicalExam?.superficialLymphNodes}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Mucosas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mucosas
                  </label>
                  <textarea
                    name="specialPhysicalExam.mucous"
                    value={formData.specialPhysicalExam?.mucous}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Sistema Cardiovascular */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sistema Cardiovascular
                  </label>
                  <textarea
                    name="specialPhysicalExam.cardiovascularSystem"
                    value={formData.specialPhysicalExam?.cardiovascularSystem}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Sistema Respiratorio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sistema Respiratorio
                  </label>
                  <textarea
                    name="specialPhysicalExam.respiratorySystem"
                    value={formData.specialPhysicalExam?.respiratorySystem}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Sistema Digestivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sistema Digestivo
                  </label>
                  <textarea
                    name="specialPhysicalExam.digestiveSystem"
                    value={formData.specialPhysicalExam?.digestiveSystem}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Sistema Urinario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sistema Urinario
                  </label>
                  <textarea
                    name="specialPhysicalExam.urinarySystem"
                    value={formData.specialPhysicalExam?.urinarySystem}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Sistema Reproductor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sistema Reproductor
                  </label>
                  <textarea
                    name="specialPhysicalExam.reproductiveSystem"
                    value={formData.specialPhysicalExam?.reproductiveSystem}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Sistema Músculo-esquelético */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sistema Músculo-esquelético
                  </label>
                  <textarea
                    name="specialPhysicalExam.musculoskeletalSystem"
                    value={formData.specialPhysicalExam?.musculoskeletalSystem}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Sistema Nervioso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sistema Nervioso
                  </label>
                  <textarea
                    
                    name="specialPhysicalExam.nervousSystem"
                    value={formData.specialPhysicalExam?.nervousSystem}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Piel y Anexos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Piel y Anexos
                  </label>
                  <textarea
                    name="specialPhysicalExam.skinAndAnnexes"
                    value={formData.specialPhysicalExam?.skinAndAnnexes}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {/* Ojos y Oídos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ojos y Oídos
                  </label>
                  <textarea
                    name="specialPhysicalExam.eyesAndEars"
                    value={formData.specialPhysicalExam?.eyesAndEars}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'deworming' && (
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Registro de Desparasitación</h2>
                <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Peso: {formData.physicalExam?.weight || '25'} Kilogramos
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Fecha desparasitación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha desparasitación
                  </label>
                  <Input
                    type="date"
                    name="deworming.date"
                    value={formData.deworming?.date}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Producto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Producto
                  </label>
                  <Input
                    type="text"
                    name="deworming.product"
                    value={formData.deworming?.product}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Dosis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosis
                  </label>
                  <Input
                    type="text"
                    name="deworming.dose"
                    value={formData.deworming?.dose}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Última desparasitación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Última desparasitación
                  </label>
                  <Input
                    type="date"
                    name="deworming.lastDeworming"
                    value={formData.deworming?.lastDeworming}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Próximo control */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Próximo control
                  </label>
                  <Input
                    type="date"
                    name="deworming.nextControl"
                    value={formData.deworming?.nextControl}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Adjunto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adjunto
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Seleccionar</span>
                          <input
                            id="file-upload"
                            name="deworming.attachment"
                            type="file"
                            className="sr-only"
                            onChange={handleInputChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  name="deworming.notes"
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.deworming?.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'vaccinations' && (
          <Card>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Registro de Vacunación</h2>
                <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Peso: {formData.physicalExam?.weight || '25'} Kilogramos
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Fecha vacunación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha vacunación
                  </label>
                  <Input
                    type="date"
                    name="vaccinations.date"
                    value={formData.vaccinations?.date}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Vacuna */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vacuna
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      name="vaccinations.vaccine"
                      value={formData.vaccinations?.vaccine}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Selecciona una vacuna</option>
                      <option value="rabia">Rabia</option>
                      <option value="polivalente">Polivalente</option>
                      <option value="leucemia">Leucemia</option>
                      <option value="triple">Triple Felina</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      Registrar vacuna
                    </Button>
                  </div>
                </div>

                {/* Laboratorio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Laboratorio
                  </label>
                  <Input
                    type="text"
                    name="vaccinations.laboratory"
                    value={formData.vaccinations?.laboratory}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Lote */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lote
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      name="vaccinations.lot"
                      value={formData.vaccinations?.lot}
                      onChange={handleInputChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Camera size={18} />}
                      onClick={handleTakePhoto}
                      title="Tomar foto de la vacuna"
                    >
                      Foto
                    </Button>
                  </div>
                </div>

                {/* Próxima vacunación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Próxima vacunación
                  </label>
                  <Input
                    type="date"
                    name="vaccinations.nextVaccination"
                    value={formData.vaccinations?.nextVaccination}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  name="vaccinations.notes"
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.vaccinations?.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            <Card>
              <div className="p-6 space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input
                    placeholder="Buscar medicamentos..."
                    value={prescriptionFilters.searchTerm}
                    onChange={(e) => setPrescriptionFilters(prev => ({
                      ...prev,
                      searchTerm: e.target.value
                    }))}
                    icon={<Search size={18} />}
                  />
                  
                  <select
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={prescriptionFilters.condition}
                    onChange={(e) => setPrescriptionFilters(prev => ({
                      ...prev,
                      condition: e.target.value
                    }))}
                  >
                    <option value="">Todas las dolencias</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>

                  <select
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={prescriptionFilters.activeIngredient}
                    onChange={(e) => setPrescriptionFilters(prev => ({
                      ...prev,
                      activeIngredient: e.target.value
                    }))}
                  >
                    <option value="">Todos los principios activos</option>
                    {activeIngredients.map(ingredient => (
                      <option key={ingredient} value={ingredient}>{ingredient}</option>
                    ))}
                  </select>

                  <select
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={prescriptionFilters.manufacturer}
                    onChange={(e) => setPrescriptionFilters(prev => ({
                      ...prev,
                      manufacturer: e.target.value
                    }))}
                  >
                    <option value="">Todos los fabricantes</option>
                    {manufacturers.map(manufacturer => (
                      <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                    ))}
                  </select>
                </div>

                {/* Medications List */}
                <div className="space-y-4">
                  {filteredMedications.map(medication => (
                    <div key={medication.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                          <p className="text-sm text-gray-500">{medication.manufacturer}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            IA Score: {medication.aiScore}%
                          </span>
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<Plus size={16} />}
                          >
                            Recetar
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Principio Activo</p>
                          <p className="text-sm font-medium text-gray-900">{medication.activeIngredient}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tipo</p>
                          <p className="text-sm font-medium text-gray-900">{medication.type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Forma</p>
                          <p className="text-sm font-medium text-gray-900">{medication.dosageForm}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs text-gray-500">Indicado para</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {medication.conditions.map(condition => (
                            <span
                              key={condition}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Posología Recomendada</p>
                          <p className="text-sm text-gray-900">{medication.recommendedDosage}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Duración Recomendada</p>
                          <p className="text-sm text-gray-900">{medication.duration}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600"
                        >
                          Ver más detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between">
            <Button variant="outline" size="lg">
              Cancelar
            </Button>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="lg"
              >
                Marcar como Atendida
              </Button>
              <Button
                variant="primary"
                size="lg"
              >
                Finalizar y Cobrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;