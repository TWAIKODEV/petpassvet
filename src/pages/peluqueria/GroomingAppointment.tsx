
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Printer, Eye, Share2, Clock, User, PawPrint, Calendar, Scissors } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface GroomingFormData {
  // Información básica
  stylistName: string;
  appointmentDate: string;
  ownerName: string;
  petName: string;
  birthDate: string;
  sex: 'male' | 'female' | 'neutered';
  
  // Información de revisión - 8 puntos de chequeo
  revision: {
    pelo: {
      normal: boolean;
      control: boolean;
      observation: string;
    };
    orejas: {
      normal: boolean;
      control: boolean;
      observation: string;
    };
    ojos: {
      normal: boolean;
      control: boolean;
      observation: string;
    };
    boca: {
      normal: boolean;
      control: boolean;
      observation: string;
    };
    colaAreaAnal: {
      normal: boolean;
      control: boolean;
      observation: string;
    };
    patasUnas: {
      normal: boolean;
      control: boolean;
      observation: string;
    };
    controlPeso: {
      peso: string;
      normal: boolean;
      control: boolean;
      observation: string;
    };
    comportamiento: {
      normal: boolean;
      control: boolean;
      observation: string;
    };
  };
  
  // Estados de comportamiento
  behavior: {
    pasivo: boolean;
    adaptado: boolean;
    curioso: boolean;
    excitado: boolean;
    desinteresado: boolean;
    separacion: boolean;
    asustado: boolean;
    agresivo: boolean;
  };
  
  // Servicios realizados
  services: {
    bano: boolean;
    corte: boolean;
    cepillado: boolean;
    corteunas: boolean;
    limpiezaorejas: boolean;
    limpiezadental: boolean;
    desenredado: boolean;
    deslanado: boolean;
  };
  
  // Observaciones generales
  generalObservations: string;
  
  // Próxima cita
  nextAppointment?: string;
}

const GroomingAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic-info');
  const [formData, setFormData] = useState<GroomingFormData>({
    stylistName: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    ownerName: '',
    petName: '',
    birthDate: '',
    sex: 'male',
    revision: {
      pelo: { normal: false, control: false, observation: 'No se evidencia ninguna alteración' },
      orejas: { normal: false, control: false, observation: 'No se manifiesta ninguna alteración' },
      ojos: { normal: false, control: false, observation: 'No se evidencia ninguna alteración' },
      boca: { normal: false, control: false, observation: 'No se evidencia ninguna alteración' },
      colaAreaAnal: { normal: false, control: false, observation: 'No se evidencia ninguna alteración' },
      patasUnas: { normal: false, control: false, observation: 'No se manifiesta ninguna alteración' },
      controlPeso: { peso: '', normal: false, control: false, observation: 'Peso normal y alimentación adecuada' },
      comportamiento: { normal: false, control: false, observation: 'Completamente adaptado a la situación' }
    },
    behavior: {
      pasivo: false,
      adaptado: false,
      curioso: false,
      excitado: false,
      desinteresado: false,
      separacion: false,
      asustado: false,
      agresivo: false
    },
    services: {
      bano: false,
      corte: false,
      cepillado: false,
      corteunas: false,
      limpiezaorejas: false,
      limpiezadental: false,
      desenredado: false,
      deslanado: false
    },
    generalObservations: ''
  });

  const tabs = [
    { id: 'basic-info', label: 'Información Básica', icon: <User size={18} /> },
    { id: 'revision', label: 'Revisión (8 puntos)', icon: <Eye size={18} /> },
    { id: 'behavior', label: 'Comportamiento', icon: <PawPrint size={18} /> },
    { id: 'services', label: 'Servicios', icon: <Scissors size={18} /> },
    { id: 'observations', label: 'Observaciones', icon: <FileText size={18} /> }
  ];

  const handleInputChange = (field: string, value: any) => {
    const fieldParts = field.split('.');
    if (fieldParts.length === 1) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (fieldParts.length === 2) {
      setFormData(prev => ({
        ...prev,
        [fieldParts[0]]: {
          ...prev[fieldParts[0] as keyof typeof prev],
          [fieldParts[1]]: value
        }
      }));
    } else if (fieldParts.length === 3) {
      setFormData(prev => ({
        ...prev,
        [fieldParts[0]]: {
          ...prev[fieldParts[0] as keyof typeof prev],
          [fieldParts[1]]: {
            ...(prev[fieldParts[0] as keyof typeof prev] as any)[fieldParts[1]],
            [fieldParts[2]]: value
          }
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Guardando datos de cita de peluquería:', formData);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = () => {
    console.log('Generando PDF...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/peluqueria/citas')}
                icon={<ArrowLeft size={18} />}
              >
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cita de Peluquería</h1>
                <p className="text-sm text-gray-500">
                  {id === 'new' ? 'Nueva cita' : `Cita #${id}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                icon={<Printer size={18} />}
              >
                Imprimir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGeneratePDF}
                icon={<FileText size={18} />}
              >
                PDF
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                icon={<Save size={18} />}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Información Básica */}
          {activeTab === 'basic-info' && (
            <Card>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-teal-600 text-white p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Centro Estético</h2>
                    <h3 className="text-lg mb-2">Higiénico para mascotas</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <PawPrint className="text-teal-600" size={16} />
                      </div>
                      <span className="font-semibold">CONTIGO CUIDADOS</span>
                    </div>
                    <p className="text-sm mt-2">www.contigocuidados.com</p>
                  </div>
                  
                  <div className="bg-yellow-400 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Bienvenido</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Id:</span>
                        <input type="text" className="border-b border-gray-400 bg-transparent text-right w-32" />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Fecha:</span>
                        <Input
                          type="date"
                          value={formData.appointmentDate}
                          onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Estilista</h3>
                    <Input
                      label="Nombre del Estilista"
                      value={formData.stylistName}
                      onChange={(e) => handleInputChange('stylistName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Propietario"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  />
                  <Input
                    label="Nombre mascota"
                    value={formData.petName}
                    onChange={(e) => handleInputChange('petName', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Fecha nacimiento"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="male"
                          checked={formData.sex === 'male'}
                          onChange={(e) => handleInputChange('sex', e.target.value)}
                          className="mr-2"
                        />
                        <span>♂ Macho</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="female"
                          checked={formData.sex === 'female'}
                          onChange={(e) => handleInputChange('sex', e.target.value)}
                          className="mr-2"
                        />
                        <span>♀ Hembra</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="neutered"
                          checked={formData.sex === 'neutered'}
                          onChange={(e) => handleInputChange('sex', e.target.value)}
                          className="mr-2"
                        />
                        <span>esterilizado</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Información Revisión */}
          {activeTab === 'revision' && (
            <Card>
              <div className="p-6">
                <div className="bg-yellow-400 p-3 mb-6">
                  <h3 className="text-lg font-bold text-gray-800">■ Información Revisión</h3>
                </div>
                
                <div className="space-y-6">
                  {Object.entries(formData.revision).map(([key, data]) => {
                    const labels = {
                      pelo: '1.- Pelo, Piel',
                      orejas: '2.- Orejas',
                      ojos: '3.- Ojos',
                      boca: '4.- Boca',
                      colaAreaAnal: '5.- Cola área anal',
                      patasUnas: '6.- Patas uñas',
                      controlPeso: '7.- Control de Peso',
                      comportamiento: '8.- Comportamiento'
                    };
                    
                    return (
                      <div key={key} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{labels[key as keyof typeof labels]}</h4>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <span className="mr-2 text-sm">Normal</span>
                              <input
                                type="checkbox"
                                checked={data.normal}
                                onChange={(e) => handleInputChange(`revision.${key}.normal`, e.target.checked)}
                                className="rounded"
                              />
                            </label>
                            <label className="flex items-center">
                              <span className="mr-2 text-sm">Controlar</span>
                              <input
                                type="checkbox"
                                checked={data.control}
                                onChange={(e) => handleInputChange(`revision.${key}.control`, e.target.checked)}
                                className="rounded"
                              />
                            </label>
                          </div>
                        </div>
                        
                        {key === 'controlPeso' && (
                          <div className="mb-3">
                            <Input
                              label="Peso (kg)"
                              type="number"
                              step="0.1"
                              value={(data as any).peso}
                              onChange={(e) => handleInputChange(`revision.${key}.peso`, e.target.value)}
                              className="w-32"
                            />
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Observación</label>
                          <textarea
                            value={data.observation}
                            onChange={(e) => handleInputChange(`revision.${key}.observation`, e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* Comportamiento */}
          {activeTab === 'behavior' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6">Evaluación del Comportamiento</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(formData.behavior).map(([key, checked]) => {
                    const labels = {
                      pasivo: 'Pasivo',
                      adaptado: 'Adaptado',
                      curioso: 'Curioso',
                      excitado: 'Excitado',
                      desinteresado: 'Desinteresado',
                      separacion: 'Separación',
                      asustado: 'Asustado',
                      agresivo: 'Agresivo'
                    };
                    
                    return (
                      <label key={key} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => handleInputChange(`behavior.${key}`, e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">{labels[key as keyof typeof labels]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* Servicios */}
          {activeTab === 'services' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6">Servicios Realizados</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.services).map(([key, checked]) => {
                    const labels = {
                      bano: 'Baño',
                      corte: 'Corte de pelo',
                      cepillado: 'Cepillado',
                      corteunas: 'Corte de uñas',
                      limpiezaorejas: 'Limpieza de orejas',
                      limpiezadental: 'Limpieza dental',
                      desenredado: 'Desenredado',
                      deslanado: 'Deslanado'
                    };
                    
                    return (
                      <label key={key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => handleInputChange(`services.${key}`, e.target.checked)}
                          className="rounded"
                        />
                        <Scissors size={16} className="text-purple-600" />
                        <span>{labels[key as keyof typeof labels]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* Observaciones */}
          {activeTab === 'observations' && (
            <Card>
              <div className="p-6 space-y-6">
                <div className="bg-yellow-400 p-3 rounded">
                  <h3 className="text-lg font-bold text-gray-800">■ OBSERVACIONES GENERALES</h3>
                </div>
                
                <div>
                  <textarea
                    value={formData.generalObservations}
                    onChange={(e) => handleInputChange('generalObservations', e.target.value)}
                    rows={8}
                    placeholder="Queremos resaltar que nuestra exploración de ocho puntos no constituye, bajo ninguna circunstancia, una evaluación clínica profesional realizada por un veterinario. Esta exploración se lleva a cabo basándose en nuestra experiencia y se limita a una apreciación externa del animal. Si durante este procedimiento observáramos alguna anomalía, se lo comunicaríamos de inmediato."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-4">
                    <Button variant="outline" type="button">
                      Descargar
                    </Button>
                    <Button variant="outline" type="button">
                      Limpiar
                    </Button>
                  </div>
                  
                  <div>
                    <Input
                      label="Próxima cita"
                      type="date"
                      value={formData.nextAppointment || ''}
                      onChange={(e) => handleInputChange('nextAppointment', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
};

export default GroomingAppointment;
