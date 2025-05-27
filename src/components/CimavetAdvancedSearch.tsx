
import React, { useState } from 'react';
import { Search, Filter, X, FileText, Download, Info, Loader, AlertTriangle } from 'lucide-react';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import axios from 'axios';

interface CimavetSearchForm {
  nombreComercial: string;
  principioActivo: string;
  laboratorio: string;
  especie: string;
  formaFarmaceutica: string;
  viaAdministracion: string;
  excipiente: string;
  codigoAtcVet: string;
  indicacion: string;
  contraindicacion: string;
  reaccionAdversa: string;
  interaccion: string;
  comercializado: 'all' | 'yes' | 'no';
  fraccionado: 'all' | 'yes' | 'no';
  administracion: 'all' | 'exclusive' | 'control';
  prescripcion: 'all' | 'yes' | 'no';
  psicotropo: 'all' | 'yes' | 'no';
  antibiotico: 'all' | 'yes' | 'no';
  situacion: 'all' | 'authorized' | 'suspended' | 'revoked';
  tipoMedicamento: 'all' | 'pharmacological' | 'immunological' | 'mixed' | 'homeopathic';
  numeroRegistro: string;
}

interface CimavetResult {
  codigo: string;
  nombre: string;
  presentacion: string;
  laboratorio: string;
  principiosActivos: string[];
  especies: string[];
  situacion: string;
  comercializado: boolean;
  prescripcion: boolean;
  antibiotico: boolean;
  fichaUrl?: string;
  prospectoUrl?: string;
}

interface CimavetAdvancedSearchProps {
  onClose: () => void;
  onImport: (medication: any) => void;
}

const CimavetAdvancedSearch: React.FC<CimavetAdvancedSearchProps> = ({ onClose, onImport }) => {
  const [form, setForm] = useState<CimavetSearchForm>({
    nombreComercial: '',
    principioActivo: '',
    laboratorio: '',
    especie: '',
    formaFarmaceutica: '',
    viaAdministracion: '',
    excipiente: '',
    codigoAtcVet: '',
    indicacion: '',
    contraindicacion: '',
    reaccionAdversa: '',
    interaccion: '',
    comercializado: 'all',
    fraccionado: 'all',
    administracion: 'all',
    prescripcion: 'all',
    psicotropo: 'all',
    antibiotico: 'all',
    situacion: 'all',
    tipoMedicamento: 'all',
    numeroRegistro: ''
  });

  const [results, setResults] = useState<CimavetResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildSearchParams = () => {
    const params: any = {};
    
    // Mapear campos del formulario a parámetros de la API
    if (form.nombreComercial.trim()) params.nombre = form.nombreComercial.trim();
    if (form.principioActivo.trim()) params.principioActivo = form.principioActivo.trim();
    if (form.laboratorio.trim()) params.fabricante = form.laboratorio.trim();
    if (form.numeroRegistro.trim()) params.numeroRegistro = form.numeroRegistro.trim();
    if (form.codigoAtcVet.trim()) params.codigoAtcVet = form.codigoAtcVet.trim();
    if (form.especie.trim()) params.especie = form.especie.trim();
    if (form.formaFarmaceutica.trim()) params.formaFarmaceutica = form.formaFarmaceutica.trim();
    if (form.viaAdministracion.trim()) params.viaAdministracion = form.viaAdministracion.trim();
    if (form.excipiente.trim()) params.excipiente = form.excipiente.trim();
    if (form.indicacion.trim()) params.indicacion = form.indicacion.trim();
    if (form.contraindicacion.trim()) params.contraindicacion = form.contraindicacion.trim();
    if (form.reaccionAdversa.trim()) params.reaccionAdversa = form.reaccionAdversa.trim();
    if (form.interaccion.trim()) params.interaccion = form.interaccion.trim();

    // Mapear tipos de medicamento
    if (form.tipoMedicamento !== 'all') {
      const tipoMap = {
        'pharmacological': 'Farmacológico',
        'immunological': 'Inmunológico', 
        'mixed': 'Mixto',
        'homeopathic': 'Homeopático'
      };
      params.tipo = tipoMap[form.tipoMedicamento as keyof typeof tipoMap];
    }

    // Mapear filtros booleanos
    if (form.comercializado !== 'all') {
      params.comercializado = form.comercializado === 'yes' ? 'S' : 'N';
    }
    if (form.prescripcion !== 'all') {
      params.prescripcion = form.prescripcion === 'yes' ? 'S' : 'N';
    }
    if (form.antibiotico !== 'all') {
      params.antibiotico = form.antibiotico === 'yes' ? 'S' : 'N';
    }
    if (form.psicotropo !== 'all') {
      params.psicotropo = form.psicotropo === 'yes' ? 'S' : 'N';
    }

    // Mapear situación
    if (form.situacion !== 'all') {
      const situacionMap = {
        'authorized': 'Autorizado',
        'suspended': 'Suspendido',
        'revoked': 'Revocado'
      };
      params.situacion = situacionMap[form.situacion as keyof typeof situacionMap];
    }

    return params;
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Leer configuración desde las Secrets de Replit
      const apiUrl = process.env.CIMAVET_API_URL || 'https://cimavet.aemps.es/cimavet/rest/buscar';
      const apiKey = process.env.CIMAVET_API_KEY;
      
      const params = buildSearchParams();
      
      // Configurar headers
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'VetClinic/1.0'
      };
      
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      console.log('Realizando búsqueda en CIMAVET con parámetros:', params);

      const response = await axios.get(apiUrl, {
        params: params,
        headers: headers,
        timeout: 30000, // 30 segundos de timeout
        validateStatus: (status) => status < 500 // Aceptar códigos de estado menores a 500
      });

      if (response.status === 200 && response.data) {
        // Procesar respuesta de la API
        let medicamentos = [];
        
        if (Array.isArray(response.data)) {
          medicamentos = response.data;
        } else if (response.data.medicamentos && Array.isArray(response.data.medicamentos)) {
          medicamentos = response.data.medicamentos;
        } else if (response.data.resultados && Array.isArray(response.data.resultados)) {
          medicamentos = response.data.resultados;
        }

        // Mapear resultados al formato esperado
        const mappedResults: CimavetResult[] = medicamentos.map((med: any) => ({
          codigo: med.numeroRegistro || med.codigo || med.nregistro || '',
          nombre: med.nombre || med.nombreComercial || '',
          presentacion: med.presentacion || med.descripcion || '',
          laboratorio: med.laboratorio || med.titular || med.fabricante || '',
          principiosActivos: Array.isArray(med.principiosActivos) 
            ? med.principiosActivos 
            : med.principioActivo 
              ? [med.principioActivo]
              : [],
          especies: Array.isArray(med.especies) 
            ? med.especies 
            : med.especie 
              ? [med.especie]
              : [],
          situacion: med.situacion || 'Autorizado',
          comercializado: med.comercializado === 'S' || med.comercializado === true || med.comercializado === 'Sí',
          prescripcion: med.prescripcion === 'S' || med.prescripcion === true || med.prescripcion === 'Sí',
          antibiotico: med.antibiotico === 'S' || med.antibiotico === true || med.antibiotico === 'Sí',
          fichaUrl: med.fichaUrl || med.urlFicha,
          prospectoUrl: med.prospectoUrl || med.urlProspecto
        }));

        setResults(mappedResults);
        
        if (mappedResults.length === 0) {
          setError('No se encontraron medicamentos que coincidan con los criterios de búsqueda.');
        }
      } else {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error en búsqueda CIMAVET:', error);
      
      let errorMessage = 'Error al conectar con la API de CIMAVET.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Tiempo de espera agotado. La API de CIMAVET no responde.';
      } else if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Servicio no encontrado. Verifique la URL de la API.';
        } else if (error.response.status === 401) {
          errorMessage = 'No autorizado. Verifique la clave de API.';
        } else if (error.response.status === 429) {
          errorMessage = 'Demasiadas solicitudes. Intente de nuevo en unos minutos.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Error del servidor de CIMAVET. Intente más tarde.';
        } else {
          errorMessage = `Error HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con la API de CIMAVET. Verifique su conexión a internet.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm({
      nombreComercial: '',
      principioActivo: '',
      laboratorio: '',
      especie: '',
      formaFarmaceutica: '',
      viaAdministracion: '',
      excipiente: '',
      codigoAtcVet: '',
      indicacion: '',
      contraindicacion: '',
      reaccionAdversa: '',
      interaccion: '',
      comercializado: 'all',
      fraccionado: 'all',
      administracion: 'all',
      prescripcion: 'all',
      psicotropo: 'all',
      antibiotico: 'all',
      situacion: 'all',
      tipoMedicamento: 'all',
      numeroRegistro: ''
    });
    setResults([]);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Search size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Buscador Avanzado CIMAVET</h2>
              <p className="text-sm text-gray-600">Centro de Información online de Medicamentos de la AEMPS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {/* Formulario de búsqueda */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Criterios de Búsqueda</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Filter size={16} />}
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? 'Búsqueda Simple' : 'Búsqueda Avanzada'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearForm}
                  >
                    Limpiar
                  </Button>
                </div>
              </div>

              {/* Campos principales vinculados a la API */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de Medicamento *
                  </label>
                  <Input
                    name="nombreComercial"
                    value={form.nombreComercial}
                    onChange={handleChange}
                    placeholder="Ej: Amoxicilina"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Principio Activo *
                  </label>
                  <Input
                    name="principioActivo"
                    value={form.principioActivo}
                    onChange={handleChange}
                    placeholder="Ej: Amoxicilina"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fabricante *
                  </label>
                  <Input
                    name="laboratorio"
                    value={form.laboratorio}
                    onChange={handleChange}
                    placeholder="Ej: Pfizer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Medicamento *
                  </label>
                  <select
                    name="tipoMedicamento"
                    value={form.tipoMedicamento}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="all">— Todos los tipos —</option>
                    <option value="pharmacological">Farmacológico</option>
                    <option value="immunological">Inmunológico</option>
                    <option value="mixed">Mixto</option>
                    <option value="homeopathic">Homeopático</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Registro *
                  </label>
                  <Input
                    name="numeroRegistro"
                    value={form.numeroRegistro}
                    onChange={handleChange}
                    placeholder="Ej: 1234-ESP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código ATC-Vet *
                  </label>
                  <Input
                    name="codigoAtcVet"
                    value={form.codigoAtcVet}
                    onChange={handleChange}
                    placeholder="Ej: QJ01CA04"
                  />
                </div>
              </div>

              {/* Campos avanzados */}
              {showAdvanced && (
                <>
                  <div className="border-t pt-4 mb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Información del Medicamento</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Especie de Destino
                        </label>
                        <select
                          name="especie"
                          value={form.especie}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="">— Todas las especies —</option>
                          <option value="perro">Perro</option>
                          <option value="gato">Gato</option>
                          <option value="bovino">Bovino</option>
                          <option value="porcino">Porcino</option>
                          <option value="ovino">Ovino</option>
                          <option value="equino">Equino</option>
                          <option value="aves">Aves</option>
                          <option value="conejos">Conejos</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Forma Farmacéutica
                        </label>
                        <Input
                          name="formaFarmaceutica"
                          value={form.formaFarmaceutica}
                          onChange={handleChange}
                          placeholder="Ej: Comprimidos"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vía de Administración
                        </label>
                        <Input
                          name="viaAdministracion"
                          value={form.viaAdministracion}
                          onChange={handleChange}
                          placeholder="Ej: Oral"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Excipiente
                        </label>
                        <Input
                          name="excipiente"
                          value={form.excipiente}
                          onChange={handleChange}
                          placeholder="Nombre del excipiente"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Información Clínica</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Indicación
                        </label>
                        <Input
                          name="indicacion"
                          value={form.indicacion}
                          onChange={handleChange}
                          placeholder="Indicación terapéutica"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contraindicación
                        </label>
                        <Input
                          name="contraindicacion"
                          value={form.contraindicacion}
                          onChange={handleChange}
                          placeholder="Contraindicación"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reacción Adversa
                        </label>
                        <Input
                          name="reaccionAdversa"
                          value={form.reaccionAdversa}
                          onChange={handleChange}
                          placeholder="Reacción adversa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Interacción
                        </label>
                        <Input
                          name="interaccion"
                          value={form.interaccion}
                          onChange={handleChange}
                          placeholder="Interacción medicamentosa"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-800 mb-3">Filtros Adicionales</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comercializado
                        </label>
                        <select
                          name="comercializado"
                          value={form.comercializado}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="all">Todos</option>
                          <option value="yes">Sí</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prescripción
                        </label>
                        <select
                          name="prescripcion"
                          value={form.prescripcion}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="all">Todos</option>
                          <option value="yes">Con prescripción</option>
                          <option value="no">Sin prescripción</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Antibiótico
                        </label>
                        <select
                          name="antibiotico"
                          value={form.antibiotico}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="all">Todos</option>
                          <option value="yes">Sí</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Situación
                        </label>
                        <select
                          name="situacion"
                          value={form.situacion}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="all">Todas</option>
                          <option value="authorized">Autorizado</option>
                          <option value="suspended">Suspendido</option>
                          <option value="revoked">Revocado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-center mt-6">
                <Button
                  variant="primary"
                  icon={loading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-8"
                >
                  {loading ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Mostrar errores */}
          {error && (
            <Card className="mb-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle size={20} className="text-red-600 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Error en la búsqueda</h4>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Resultados */}
          {results.length > 0 && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Resultados ({results.length} medicamentos encontrados)
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Download size={16} />}
                  >
                    Exportar Resultados
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Código
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre Comercial
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Presentación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Laboratorio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.map((medication) => (
                        <tr key={medication.codigo} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                            {medication.codigo}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{medication.nombre}</div>
                            <div className="text-sm text-gray-500">
                              {medication.principiosActivos.join(', ')}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {medication.presentacion}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {medication.laboratorio}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                medication.situacion === 'Autorizado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {medication.situacion}
                              </span>
                              {medication.comercializado && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Comercializado
                                </span>
                              )}
                              {medication.prescripcion && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Prescripción
                                </span>
                              )}
                              {medication.antibiotico && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Antibiótico
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => onImport(medication)}
                              >
                                Importar
                              </Button>
                              {medication.fichaUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  icon={<FileText size={14} />}
                                  onClick={() => window.open(medication.fichaUrl, '_blank')}
                                >
                                  Ficha
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<Info size={14} />}
                                onClick={() => window.open(`https://cimavet.aemps.es/cimavet/medicamento.do?nregistro=${medication.codigo}`, '_blank')}
                              >
                                Ver en CIMAVET
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}

          {/* Estado vacío */}
          {!loading && results.length === 0 && !error && (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Buscar medicamentos en CIMAVET
              </h3>
              <p className="text-gray-500 mb-4">
                Utilice los criterios de búsqueda para encontrar medicamentos veterinarios autorizados en España
              </p>
              <p className="text-sm text-gray-400">
                Los campos marcados con * están vinculados directamente a la API de CIMAVET
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CimavetAdvancedSearch;
