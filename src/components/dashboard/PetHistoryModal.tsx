import React, { useState } from 'react';
import { X, UserCheck, UserX, Calendar, Clock, DollarSign, FileText, Printer, Download, Camera, Pill, Activity, Clipboard, Stethoscope, Heart, Thermometer, Weight, Droplet, Zap, Percent, Gauge, Eye, Smile, Frown, Meh, CheckCircle, AlertCircle, CalendarClock, User, PawPrint } from 'lucide-react';
import Button from '../common/Button';

interface Visit {
  id?: string;
  date: string;
  doctor: string;
  area: string;
  service: string;
  amount: number;
  details?: {
    symptoms?: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
    nextVisit?: string;
    physicalExam?: {
      temperature?: {
        value: number;
        unit: 'C' | 'F';
      };
      weight?: {
        value: number;
        unit: 'kg' | 'lb';
      };
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
    bloodAnalysis?: {
      hemogram?: {
        date?: string;
        results?: {
          redBloodCells?: string;
          hemoglobin?: string;
          hematocrit?: string;
          mcv?: string;
          mch?: string;
          mchc?: string;
          platelets?: string;
          whiteBloodCells?: string;
          neutrophils?: string;
          lymphocytes?: string;
          monocytes?: string;
          eosinophils?: string;
          basophils?: string;
        }
      };
      biochemistry?: {
        date?: string;
        results?: {
          glucose?: string;
          urea?: string;
          creatinine?: string;
          alt?: string;
          ast?: string;
          alp?: string;
          totalProtein?: string;
          albumin?: string;
          globulin?: string;
          calcium?: string;
          phosphorus?: string;
          sodium?: string;
          potassium?: string;
          chloride?: string;
        }
      };
    };
    tests?: Array<{
      name: string;
      result: string;
      date: string;
      type?: 'laboratory' | 'radiological' | 'other';
      imageUrl?: string;
    }>;
    prescriptions?: Array<{
      name: string;
      dosage: string;
      duration: string;
    }>;
  };
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  sex: 'male' | 'female';
  birthDate: string;
  owner: {
    name: string;
    phone: string;
    email: string;
  };
  visits: Visit[];
}

interface PetHistoryModalProps {
  pet: Pet;
  onClose: () => void;
}

const PetHistoryModal: React.FC<PetHistoryModalProps> = ({ pet, onClose }) => {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [activeTab, setActiveTab] = useState<'hemogram' | 'biochemistry'>('hemogram');
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>('');

  // Example visit with complete medical case
  const exampleVisit: Visit = {
    id: 'example-1',
    date: '2025-05-22',
    doctor: 'Dra. Laura Gómez',
    area: 'Veterinaria',
    service: 'Consulta Dermatológica',
    amount: 85.00,
    details: {
      symptoms: 'Prurito intenso, eritema y alopecia en zona dorsolumbar y base de la cola. El propietario reporta que el animal se rasca constantemente desde hace 2 semanas.',
      diagnosis: 'Dermatitis alérgica por pulgas (DAPP) con infección bacteriana secundaria',
      treatment: 'Tratamiento antiparasitario con Simparica 80mg para eliminar pulgas y garrapatas. Antibioterapia con Amoxicilina-Clavulánico para tratar la infección secundaria. Baños con champú medicado Malaseb cada 3 días durante 2 semanas.',
      notes: 'Se recomienda tratamiento antiparasitario mensual para prevenir recidivas. Revisar el ambiente donde vive el animal para eliminar posibles focos de pulgas.',
      nextVisit: '2025-06-05',
      physicalExam: {
        temperature: {
          value: 38.7,
          unit: 'C'
        },
        weight: {
          value: 28.4,
          unit: 'kg'
        },
        heartRate: '90 lpm',
        respiratoryRate: '24 rpm',
        tllc: '2 segundos',
        mucous: 'normal',
        palpation: 'Sin anomalías en la palpación abdominal. Ganglios linfáticos normales.'
      },
      tests: [
        {
          name: 'Raspado cutáneo',
          result: 'Negativo para ácaros. Presencia de detritus de pulgas.',
          date: '2025-05-22',
          type: 'laboratory'
        },
        {
          name: 'Citología cutánea',
          result: 'Presencia de cocos y neutrófilos, compatible con infección bacteriana secundaria.',
          date: '2025-05-22',
          type: 'laboratory'
        },
        {
          name: 'Fotografía lesiones',
          result: 'Documentación de lesiones en zona dorsolumbar',
          date: '2025-05-22',
          type: 'other',
          imageUrl: 'https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ],
      prescriptions: [
        {
          name: 'Simparica 80mg',
          dosage: '1 comprimido',
          duration: 'Mensual (administrar hoy y repetir cada 30 días)'
        },
        {
          name: 'Amoxicilina-Clavulánico 500mg',
          dosage: '1 comprimido cada 12 horas',
          duration: '10 días'
        },
        {
          name: 'Champú Malaseb',
          dosage: 'Baño cada 3 días, dejar actuar 10 minutos',
          duration: '2 semanas'
        }
      ]
    }
  };

  const getMucousLabel = (mucous: string) => {
    const labels = {
      normal: 'Normales',
      pale: 'Pálidas',
      hyperemic: 'Hiperémicas',
      cyanotic: 'Cianóticas',
      icteric: 'Ictéricas'
    };
    return labels[mucous] || mucous;
  };

  const handleViewImage = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setShowImageModal(true);
  };

  const handlePrintVisitSummary = () => {
    if (!selectedVisit) return;
    
    // In a real app, this would generate a PDF of the visit summary
    console.log('Printing visit summary for:', selectedVisit);
    window.print();
  };

  const handleDownloadVisitSummary = () => {
    if (!selectedVisit) return;
    
    // In a real app, this would download a PDF of the visit summary
    console.log('Downloading visit summary for:', selectedVisit);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Historial de {pet.name}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {pet.species} • {pet.breed} • {pet.sex === 'male' ? 'Macho' : 'Hembra'} • {
                  new Date().getFullYear() - new Date(pet.birthDate).getFullYear()
                } años
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Información del Propietario</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-blue-900 font-medium">{pet.owner.name}</p>
                  <p className="text-sm text-blue-700">Propietario</p>
                </div>
                <div>
                  <p className="text-sm text-blue-900 font-medium">{pet.owner.phone}</p>
                  <p className="text-sm text-blue-700">Teléfono</p>
                </div>
                <div>
                  <p className="text-sm text-blue-900 font-medium">{pet.owner.email}</p>
                  <p className="text-sm text-blue-700">Email</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profesional
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Área
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Servicio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Importe
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[exampleVisit, ...pet.visits].map((visit, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(visit.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{visit.doctor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          visit.area === 'Veterinaria' ? 'bg-blue-100 text-blue-800' :
                          visit.area === 'Peluquería' ? 'bg-purple-100 text-purple-800' :
                          visit.area === 'Cirugía' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {visit.area}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{visit.service}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign size={16} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {visit.amount.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedVisit(visit)}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-lg">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </div>

      {/* Visit Details Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[55] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Detalles de la Consulta
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(selectedVisit.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} • {selectedVisit.doctor}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Printer size={16} />}
                  onClick={handlePrintVisitSummary}
                >
                  Imprimir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download size={16} />}
                  onClick={handleDownloadVisitSummary}
                >
                  Descargar
                </Button>
                <button
                  onClick={() => setSelectedVisit(null)}
                  className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {/* Visit Summary Card */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                <div className="flex items-center mb-4">
                  <FileText className="text-blue-600 mr-3" size={24} />
                  <h4 className="text-xl font-semibold text-gray-900">Ficha Resumen de Consulta</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <User className="text-gray-500 mr-2" size={16} />
                      <h5 className="text-sm font-medium text-gray-700">Propietario</h5>
                    </div>
                    <p className="text-sm text-gray-900 ml-6">{pet.owner.name}</p>
                    <p className="text-xs text-gray-500 ml-6">{pet.owner.phone}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <PawPrint className="text-gray-500 mr-2" size={16} />
                      <h5 className="text-sm font-medium text-gray-700">Mascota</h5>
                    </div>
                    <p className="text-sm text-gray-900 ml-6">{pet.name}</p>
                    <p className="text-xs text-gray-500 ml-6">
                      {pet.species} {pet.breed}, {pet.sex === 'male' ? 'Macho' : 'Hembra'}, {
                        new Date().getFullYear() - new Date(pet.birthDate).getFullYear()
                      } años
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center mb-2">
                    <Stethoscope className="text-gray-500 mr-2" size={16} />
                    <h5 className="text-sm font-medium text-gray-700">Diagnóstico</h5>
                  </div>
                  <p className="text-sm text-gray-900 ml-6">
                    {selectedVisit.details?.diagnosis || "No se registró diagnóstico"}
                  </p>
                </div>
                
                {selectedVisit.details?.tests && selectedVisit.details.tests.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center mb-2">
                      <Activity className="text-gray-500 mr-2" size={16} />
                      <h5 className="text-sm font-medium text-gray-700">Pruebas Realizadas</h5>
                    </div>
                    <ul className="text-sm text-gray-900 ml-6 list-disc pl-4">
                      {selectedVisit.details.tests.map((test, index) => (
                        <li key={index}>
                          {test.name} - {test.result}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedVisit.details?.prescriptions && selectedVisit.details.prescriptions.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center mb-2">
                      <Pill className="text-gray-500 mr-2" size={16} />
                      <h5 className="text-sm font-medium text-gray-700">Recetas Expedidas</h5>
                    </div>
                    <ul className="text-sm text-gray-900 ml-6 list-disc pl-4">
                      {selectedVisit.details.prescriptions.map((prescription, index) => (
                        <li key={index}>
                          {prescription.name} - {prescription.dosage}, {prescription.duration}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="text-gray-500 mr-2" size={16} />
                    <h5 className="text-sm font-medium text-gray-700">Solución/Tratamiento</h5>
                  </div>
                  <p className="text-sm text-gray-900 ml-6">
                    {selectedVisit.details?.treatment || "No se registró tratamiento"}
                  </p>
                </div>
                
                {selectedVisit.details?.nextVisit && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center mb-2">
                      <CalendarClock className="text-gray-500 mr-2" size={16} />
                      <h5 className="text-sm font-medium text-gray-700">Próxima Revisión</h5>
                    </div>
                    <p className="text-sm text-gray-900 ml-6">
                      {new Date(selectedVisit.details.nextVisit).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Clinical Information */}
              {selectedVisit.details && (
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200 mb-6">
                  <div className="flex items-center mb-3">
                    <Stethoscope className="text-blue-600 mr-2" size={18} />
                    <h4 className="text-md font-medium text-gray-900">Información Clínica</h4>
                  </div>
                  <div className="space-y-4">
                    {selectedVisit.details.symptoms && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Síntomas</p>
                        <p className="text-sm text-gray-600 mt-1">{selectedVisit.details.symptoms}</p>
                      </div>
                    )}
                    {selectedVisit.details.diagnosis && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Diagnóstico</p>
                        <p className="text-sm text-gray-600 mt-1">{selectedVisit.details.diagnosis}</p>
                      </div>
                    )}
                    {selectedVisit.details.treatment && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Tratamiento</p>
                        <p className="text-sm text-gray-600 mt-1">{selectedVisit.details.treatment}</p>
                      </div>
                    )}
                    {selectedVisit.details.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Notas</p>
                        <p className="text-sm text-gray-600 mt-1">{selectedVisit.details.notes}</p>
                      </div>
                    )}
                    {selectedVisit.details.nextVisit && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Próxima Visita</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(selectedVisit.details.nextVisit).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Physical Exam */}
                {selectedVisit.details?.physicalExam && (
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <div className="flex items-center mb-3">
                      <Clipboard className="text-green-600 mr-2" size={18} />
                      <h4 className="text-md font-medium text-gray-900">Examen Físico</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedVisit.details.physicalExam.temperature && (
                        <div className="flex items-center">
                          <Thermometer size={16} className="text-red-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Temperatura</p>
                            <p className="text-sm text-gray-600">
                              {selectedVisit.details.physicalExam.temperature.value}°{selectedVisit.details.physicalExam.temperature.unit}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedVisit.details.physicalExam.weight && (
                        <div className="flex items-center">
                          <Weight size={16} className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Peso</p>
                            <p className="text-sm text-gray-600">
                              {selectedVisit.details.physicalExam.weight.value} {selectedVisit.details.physicalExam.weight.unit}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedVisit.details.physicalExam.heartRate && (
                        <div className="flex items-center">
                          <Heart size={16} className="text-red-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Frecuencia Cardíaca</p>
                            <p className="text-sm text-gray-600">{selectedVisit.details.physicalExam.heartRate}</p>
                          </div>
                        </div>
                      )}
                      {selectedVisit.details.physicalExam.respiratoryRate && (
                        <div className="flex items-center">
                          <Activity size={16} className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Frecuencia Respiratoria</p>
                            <p className="text-sm text-gray-600">{selectedVisit.details.physicalExam.respiratoryRate}</p>
                          </div>
                        </div>
                      )}
                      {selectedVisit.details.physicalExam.tllc && (
                        <div className="flex items-center">
                          <Droplet size={16} className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">TLLC</p>
                            <p className="text-sm text-gray-600">{selectedVisit.details.physicalExam.tllc}</p>
                          </div>
                        </div>
                      )}
                      {selectedVisit.details.physicalExam.icc && (
                        <div className="flex items-center">
                          <Gauge size={16} className="text-orange-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">ICC</p>
                            <p className="text-sm text-gray-600">{selectedVisit.details.physicalExam.icc}</p>
                          </div>
                        </div>
                      )}
                      {selectedVisit.details.physicalExam.saturation && (
                        <div className="flex items-center">
                          <Percent size={16} className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Saturación</p>
                            <p className="text-sm text-gray-600">{selectedVisit.details.physicalExam.saturation}</p>
                          </div>
                        </div>
                      )}
                      {selectedVisit.details.physicalExam.bloodPressure && (
                        <div className="flex items-center">
                          <Zap size={16} className="text-purple-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Presión Arterial</p>
                            <p className="text-sm text-gray-600">{selectedVisit.details.physicalExam.bloodPressure}</p>
                          </div>
                        </div>
                      )}
                      {selectedVisit.details.physicalExam.mucous && (
                        <div className="flex items-center">
                          {selectedVisit.details.physicalExam.mucous === 'normal' ? (
                            <Smile size={16} className="text-green-500 mr-2" />
                          ) : selectedVisit.details.physicalExam.mucous === 'pale' ? (
                            <Meh size={16} className="text-yellow-500 mr-2" />
                          ) : (
                            <Frown size={16} className="text-red-500 mr-2" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-700">Mucosas</p>
                            <p className="text-sm text-gray-600">
                              {getMucousLabel(selectedVisit.details.physicalExam.mucous)}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedVisit.details.physicalExam.glycemia && (
                        <div className="flex items-center">
                          <Activity size={16} className="text-green-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Glicemia</p>
                            <p className="text-sm text-gray-600">{selectedVisit.details.physicalExam.glycemia}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {selectedVisit.details.physicalExam.palpation && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Palpación</p>
                        <p className="text-sm text-gray-600 mt-1">{selectedVisit.details.physicalExam.palpation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tests */}
                {selectedVisit.details?.tests && selectedVisit.details.tests.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                    <div className="flex items-center mb-3">
                      <Activity className="text-orange-600 mr-2" size={18} />
                      <h4 className="text-md font-medium text-gray-900">Pruebas Realizadas</h4>
                    </div>
                    <div className="space-y-3">
                      {selectedVisit.details.tests.map((test, index) => (
                        <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{test.name}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                Fecha: {new Date(test.date).toLocaleDateString('es-ES')}
                              </p>
                              <p className="text-sm text-gray-700 mt-1">
                                <span className="font-medium">Resultado:</span> {test.result}
                              </p>
                            </div>
                            {test.imageUrl && (
                              <button
                                onClick={() => handleViewImage(test.imageUrl!)}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                              >
                                <Camera size={14} className="mr-1" />
                                Ver imagen
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Prescriptions */}
              {selectedVisit.details?.prescriptions && selectedVisit.details.prescriptions.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200 mt-6">
                  <div className="flex items-center mb-3">
                    <Pill className="text-purple-600 mr-2" size={18} />
                    <h4 className="text-md font-medium text-gray-900">Medicamentos Recetados</h4>
                  </div>
                  <div className="space-y-3">
                    {selectedVisit.details.prescriptions.map((prescription, index) => (
                      <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-sm font-medium text-gray-900">{prescription.name}</p>
                        <div className="mt-1 grid grid-cols-2 gap-2">
                          <p className="text-xs text-gray-600">Dosis: {prescription.dosage}</p>
                          <p className="text-xs text-gray-600">Duración: {prescription.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blood Analysis */}
              {selectedVisit.details?.bloodAnalysis && (
                <div className="bg-white rounded-lg shadow p-4 border border-gray-200 mt-6">
                  <div className="flex items-center mb-3">
                    <Droplet className="text-red-600 mr-2" size={18} />
                    <h4 className="text-md font-medium text-gray-900">Análisis de Sangre</h4>
                  </div>
                  <div className="mb-4 border-b border-gray-200">
                    <div className="flex space-x-4">
                      <button
                        className={`pb-2 px-1 text-sm font-medium ${
                          activeTab === 'hemogram'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('hemogram')}
                      >
                        Hemograma
                      </button>
                      <button
                        className={`pb-2 px-1 text-sm font-medium ${
                          activeTab === 'biochemistry'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('biochemistry')}
                      >
                        Bioquímica
                      </button>
                    </div>
                  </div>

                  {activeTab === 'hemogram' && selectedVisit.details.bloodAnalysis.hemogram && (
                    <div>
                      <div className="mb-2 flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900">Hemograma</p>
                        <p className="text-xs text-gray-500">
                          Fecha: {selectedVisit.details.bloodAnalysis.hemogram.date}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.redBloodCells && (
                          <div>
                            <p className="text-sm text-gray-500">Glóbulos Rojos</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.redBloodCells}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.hemoglobin && (
                          <div>
                            <p className="text-sm text-gray-500">Hemoglobina</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.hemoglobin}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.hematocrit && (
                          <div>
                            <p className="text-sm text-gray-500">Hematocrito</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.hematocrit}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.mcv && (
                          <div>
                            <p className="text-sm text-gray-500">VCM</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.mcv}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.mch && (
                          <div>
                            <p className="text-sm text-gray-500">HCM</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.mch}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.mchc && (
                          <div>
                            <p className="text-sm text-gray-500">CHCM</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.mchc}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.platelets && (
                          <div>
                            <p className="text-sm text-gray-500">Plaquetas</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.platelets}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.whiteBloodCells && (
                          <div>
                            <p className="text-sm text-gray-500">Glóbulos Blancos</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.whiteBloodCells}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.neutrophils && (
                          <div>
                            <p className="text-sm text-gray-500">Neutrófilos</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.neutrophils}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.lymphocytes && (
                          <div>
                            <p className="text-sm text-gray-500">Linfocitos</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.lymphocytes}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.monocytes && (
                          <div>
                            <p className="text-sm text-gray-500">Monocitos</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.monocytes}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.eosinophils && (
                          <div>
                            <p className="text-sm text-gray-500">Eosinófilos</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.eosinophils}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.hemogram.results?.basophils && (
                          <div>
                            <p className="text-sm text-gray-500">Basófilos</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.hemogram.results.basophils}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'biochemistry' && selectedVisit.details.bloodAnalysis.biochemistry && (
                    <div>
                      <div className="mb-2 flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900">Bioquímica</p>
                        <p className="text-xs text-gray-500">
                          Fecha: {selectedVisit.details.bloodAnalysis.biochemistry.date}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.glucose && (
                          <div>
                            <p className="text-sm text-gray-500">Glucosa</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.glucose}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.urea && (
                          <div>
                            <p className="text-sm text-gray-500">Urea</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.urea}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.creatinine && (
                          <div>
                            <p className="text-sm text-gray-500">Creatinina</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.creatinine}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.alt && (
                          <div>
                            <p className="text-sm text-gray-500">ALT</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.alt}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.ast && (
                          <div>
                            <p className="text-sm text-gray-500">AST</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.ast}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.alp && (
                          <div>
                            <p className="text-sm text-gray-500">Fosfatasa Alcalina</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.alp}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.totalProtein && (
                          <div>
                            <p className="text-sm text-gray-500">Proteínas Totales</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.totalProtein}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.albumin && (
                          <div>
                            <p className="text-sm text-gray-500">Albúmina</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.albumin}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.globulin && (
                          <div>
                            <p className="text-sm text-gray-500">Globulina</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.globulin}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.calcium && (
                          <div>
                            <p className="text-sm text-gray-500">Calcio</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.calcium}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.phosphorus && (
                          <div>
                            <p className="text-sm text-gray-500">Fósforo</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.phosphorus}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.sodium && (
                          <div>
                            <p className="text-sm text-gray-500">Sodio</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.sodium}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.potassium && (
                          <div>
                            <p className="text-sm text-gray-500">Potasio</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.potassium}
                            </p>
                          </div>
                        )}
                        {selectedVisit.details.bloodAnalysis.biochemistry.results?.chloride && (
                          <div>
                            <p className="text-sm text-gray-500">Cloro</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedVisit.details.bloodAnalysis.biochemistry.results.chloride}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedVisit(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]">
          <div className="relative w-full max-w-4xl mx-auto">
            <button 
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full hover:bg-black hover:bg-opacity-20 transition-colors"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
            <img 
              src={currentImage} 
              alt="Imagen médica" 
              className="max-w-full max-h-[80vh] mx-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PetHistoryModal;