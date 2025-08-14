import React, { useState } from 'react';
import { Search, Plus, Edit, Trash, Grid, List, AlertTriangle, Clock, DollarSign, Calendar, Download } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import NewTreatmentForm from '../../components/form/NewTreatmentForm';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { type NewTreatmentFormOutput } from '../../validators/formValidator';

interface Treatment {
  _id: Id<"treatments">;
  name: string;
  category: string;
  description: string;
  duration: number;
  followUpPeriod?: number;
  price: number;
  status: 'active' | 'inactive';
  species: string[];
  sex: 'male' | 'female' | 'both';
  clinicArea?: string;
  conditions: string[];
  associatedMedicines: Id<"medicines">[];
  procedures: string[];
  contraindications: string[];
  sideEffects: string[];
  notes?: string;
  minAge?: number;
  maxAge?: number;
  createdAt: number;
  updatedAt: number;
}

const categories = [
  { id: 'all', name: 'Todas las categorías' },
  { id: 'Dental', name: 'Dental' },
  { id: 'Dermatología', name: 'Dermatología' },
  { id: 'Vacunación', name: 'Vacunación' },
  { id: 'Cirugía', name: 'Cirugía' },
  { id: 'Rehabilitación', name: 'Rehabilitación' }
];

// Species options
const speciesOptions = [
  { id: 'all', name: 'Todas las especies' },
  { id: 'Perro', name: 'Perro' },
  { id: 'Gato', name: 'Gato' },
  { id: 'Conejo', name: 'Conejo' },
  { id: 'Hurón', name: 'Hurón' },
  { id: 'Ave', name: 'Ave' },
  { id: 'Reptil', name: 'Reptil' },
  { id: 'Roedor', name: 'Roedor' }
];

// Common conditions
const conditionOptions = [
  { id: 'Dermatitis', name: 'Dermatitis' },
  { id: 'Otitis', name: 'Otitis' },
  { id: 'Displasia de cadera', name: 'Displasia de cadera' },
  { id: 'Artrosis', name: 'Artrosis' },
  { id: 'Alergias cutáneas', name: 'Alergias cutáneas' },
  { id: 'Sarro dental', name: 'Sarro dental' },
  { id: 'Gingivitis', name: 'Gingivitis' },
  { id: 'Maloclusión dental', name: 'Maloclusión dental' },
  { id: 'Control reproductivo', name: 'Control reproductivo' },
  { id: 'Prevención de rabia', name: 'Prevención de rabia' }
];

// Clinic areas
const clinicAreaOptions = [
  { id: 'all', name: 'Todas las áreas' },
  { id: 'Medicina General', name: 'Medicina General' },
  { id: 'Cirugía', name: 'Cirugía' },
  { id: 'Dermatología', name: 'Dermatología' },
  { id: 'Odontología', name: 'Odontología' },
  { id: 'Rehabilitación', name: 'Rehabilitación' },
  { id: 'Medicina Preventiva', name: 'Medicina Preventiva' },
  { id: 'Cardiología', name: 'Cardiología' },
  { id: 'Neurología', name: 'Neurología' },
  { id: 'Oftalmología', name: 'Oftalmología' }
];

const Tratamientos: React.FC = () => {
  const treatments = useQuery(api.treatments.getTreatments) || [];
  const deleteTreatment = useMutation(api.treatments.deleteTreatment);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedSex, setSelectedSex] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedClinicArea, setSelectedClinicArea] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInactive, setShowInactive] = useState(false);
  const [showNewTreatmentModal, setShowNewTreatmentModal] = useState(false);
  const [showEditTreatmentModal, setShowEditTreatmentModal] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Filter treatments based on search term and filters
  const filteredTreatments = treatments.filter((treatment: Treatment) => {
    const matchesSearch = treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         treatment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || treatment.category === selectedCategory;
    const matchesSpecies = selectedSpecies === 'all' || treatment.species?.includes(selectedSpecies);
    const matchesSex = selectedSex === 'all' || treatment.sex === selectedSex || treatment.sex === 'both';
    const matchesCondition = selectedCondition === 'all' || treatment.conditions?.includes(selectedCondition);
    const matchesClinicArea = selectedClinicArea === 'all' || treatment.clinicArea === selectedClinicArea;
    const matchesStatus = showInactive ? true : treatment.status === 'active';

    return matchesSearch && matchesCategory && matchesSpecies && 
           matchesSex && matchesCondition && matchesClinicArea && matchesStatus;
  });

  const handleEditTreatment = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setShowEditTreatmentModal(true);
  };

  const handleDeleteTreatment = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (selectedTreatment) {
      await deleteTreatment({ id: selectedTreatment._id });
      setShowDeleteConfirmation(false);
      setSelectedTreatment(null);
    }
  };

  const handleNewTreatment = (treatmentData: NewTreatmentFormOutput) => {
    console.log('Nuevo tratamiento creado:', treatmentData);
    setShowNewTreatmentModal(false);
  };

  const handleUpdateTreatment = (treatmentData: NewTreatmentFormOutput) => {
    console.log('Tratamiento actualizado:', treatmentData);
    setShowEditTreatmentModal(false);
    setSelectedTreatment(null);
  };

  const handleExportExcel = () => {
    const excelData = filteredTreatments.map(treatment => ({
      'Nombre': treatment.name,
      'Categoría': treatment.category,
      'Descripción': treatment.description,
      'Duración (min)': treatment.duration,
      'Seguimiento (días)': treatment.followUpPeriod || '-',
      'Precio (€)': treatment.price,
      'Estado': treatment.status === 'active' ? 'Activo' : 'Inactivo',
      'Especies': treatment.species?.join(', ') || 'Todas',
      'Sexo': treatment.sex === 'male' ? 'Macho' : 
              treatment.sex === 'female' ? 'Hembra' : 'Ambos',
      'Dolencias': treatment.conditions?.join(', ') || '-',
      'Área Clínica': treatment.clinicArea || '-',
      'Contraindicaciones': treatment.contraindications?.join(', ') || '-',
      'Efectos Secundarios': treatment.sideEffects?.join(', ') || '-',
      'Procedimientos': treatment.procedures?.join(', ') || '-',
      'Notas': treatment.notes || '-'
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Tratamientos');
    XLSX.writeFile(wb, 'tratamientos.xlsx');

    setShowExportOptions(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Listado de Tratamientos', 105, 15, { align: 'center' });

    // Date
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 25);

    // Applied filters
    doc.setFontSize(10);
    let filtersText = 'Filtros aplicados: ';
    if (selectedCategory !== 'all') filtersText += `Categoría: ${selectedCategory}, `;
    if (selectedSpecies !== 'all') filtersText += `Especie: ${selectedSpecies}, `;
    if (selectedSex !== 'all') filtersText += `Sexo: ${selectedSex === 'male' ? 'Macho' : 'Hembra'}, `;
    if (selectedCondition !== 'all') filtersText += `Dolencia: ${selectedCondition}, `;
    if (selectedClinicArea !== 'all') filtersText += `Área: ${selectedClinicArea}, `;
    if (filtersText === 'Filtros aplicados: ') filtersText += 'Ninguno';
    else filtersText = filtersText.slice(0, -2); // Remove trailing comma

    doc.text(filtersText, 20, 30);

    // Table header
    const headers = ['Nombre', 'Categoría', 'Duración', 'Precio', 'Estado'];
    const startY = 40;
    let pageNumber = 1;

    // Helper function to add header
    const addTableHeader = (y: number) => {
      doc.setFillColor(230, 230, 230);
      doc.rect(20, y, 170, 8, 'F');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      doc.text(headers[0], 22, y + 5.5);
      doc.text(headers[1], 72, y + 5.5);
      doc.text(headers[2], 112, y + 5.5);
      doc.text(headers[3], 142, y + 5.5);
      doc.text(headers[4], 172, y + 5.5);

      return y + 8;
    };

    // Add page number
    const addPageNumber = () => {
      doc.setFontSize(8);
      doc.text(`Página ${pageNumber}`, 105, 290, { align: 'center' });
    };

    // Add footer
    const addFooter = () => {
      doc.setFontSize(8);
      doc.text('ClinicPro - Sistema de Gestión Veterinaria', 105, 285, { align: 'center' });
    };

    let y = addTableHeader(startY);

    // Table content
    filteredTreatments.forEach((treatment, index) => {
      // Check if we need a new page
      if (y > 270) {
        addPageNumber();
        addFooter();
        pageNumber++;
        doc.addPage();
        y = addTableHeader(20);
      }

      doc.setFontSize(9);
      doc.text(treatment.name.length > 25 ? treatment.name.substring(0, 22) + '...' : treatment.name, 22, y + 5);
      doc.text(treatment.category, 72, y + 5);
      doc.text(`${treatment.duration} min`, 112, y + 5);
      doc.text(`${treatment.price.toLocaleString('es-ES')} €`, 142, y + 5);
      doc.text(treatment.status === 'active' ? 'Activo' : 'Inactivo', 172, y + 5);

      // Add a light gray background for every other row
      if (index % 2 === 1) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, y, 170, 10, 'F');
      }

      y += 10;
    });

    addPageNumber();
    addFooter();

    doc.save('tratamientos.pdf');
    setShowExportOptions(false);
  };

  const handlePrint = () => {
    window.print();
    setShowExportOptions(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tratamientos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de tratamientos y protocolos médicos
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative">
            <Button
              variant="outline"
              icon={<Download size={18} />}
              className="flex-1 sm:flex-none"
              onClick={() => setShowExportOptions(!showExportOptions)}
            >
              Exportar
            </Button>
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleExportExcel}
                  >
                    Exportar a Excel
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleExportPDF}
                  >
                    Exportar a PDF
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handlePrint}
                  >
                    Imprimir
                  </button>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => setShowNewTreatmentModal(true)}
          >
            Nuevo Tratamiento
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar tratamientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              className="flex-1"
            />
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <div className="flex rounded-md shadow-sm">
              <button
                className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-600 border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                  viewMode === 'list'
                    ? 'bg-blue-50 text-blue-600 border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
            >
              {speciesOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>

            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedSex}
              onChange={(e) => setSelectedSex(e.target.value)}
            >
              <option value="all">Todos los sexos</option>
              <option value="male">Macho</option>
              <option value="female">Hembra</option>
              <option value="both">Ambos</option>
            </select>

            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              <option value="all">Todas las dolencias</option>
              {conditionOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>

            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedClinicArea}
              onChange={(e) => setSelectedClinicArea(e.target.value)}
            >
              {clinicAreaOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showInactive"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showInactive" className="ml-2 text-sm text-gray-700">
              Mostrar inactivos
            </label>
          </div>
        </div>
      </Card>

      {/* Treatments Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment) => (
            <Card key={treatment._id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{treatment.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{treatment.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit size={16} />}
                      onClick={() => handleEditTreatment(treatment)}
                    >
                      Editar
                    </Button>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => handleDeleteTreatment(treatment)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {treatment.category}
                  </span>
                  {treatment.clinicArea && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {treatment.clinicArea}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    treatment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {treatment.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Duración</p>
                    <div className="text-sm text-gray-900 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {treatment.duration} min
                      </div>
                  </div>
                  {treatment.followUpPeriod && (
                    <div>
                      <p className="text-xs text-gray-500">Seguimiento</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {treatment.followUpPeriod} días
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="text-sm font-medium text-gray-900 flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      {treatment.price.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  {treatment.species && treatment.species.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500">Especies</p>
                      <p className="text-sm font-medium text-gray-900">
                        {treatment.species.join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                {treatment.conditions && treatment.conditions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500">Dolencias</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {treatment.conditions.map((condition, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(treatment.contraindications?.length || treatment.sideEffects?.length) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <AlertTriangle size={16} className="text-yellow-500 mr-2" />
                      <h4 className="text-sm font-medium text-gray-900">Advertencias</h4>
                    </div>
                    {treatment.contraindications?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Contraindicaciones:</p>
                        <ul className="mt-1 text-xs text-gray-700 list-disc list-inside">
                          {treatment.contraindications.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {treatment.sideEffects?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Efectos secundarios:</p>
                        <ul className="mt-1 text-xs text-gray-700 list-disc list-inside">
                          {treatment.sideEffects.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Treatments List View */}
      {viewMode === 'list' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tratamiento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especies
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dolencias
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
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
                {filteredTreatments.map((treatment) => (
                  <tr key={treatment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{treatment.name}</div>
                      <div className="text-sm text-gray-500">{treatment.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {treatment.category}
                      </span>
                      {treatment.clinicArea && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {treatment.clinicArea}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Clock size={14} className="mr-1" />
                        {treatment.duration} min
                      </div>
                      {treatment.followUpPeriod && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar size={14} className="mr-1" />
                          Seguimiento: {treatment.followUpPeriod} días
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {treatment.species?.join(', ') || 'Todas'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {treatment.sex === 'male' ? 'Solo machos' : 
                         treatment.sex === 'female' ? 'Solo hembras' : 'Ambos sexos'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {treatment.conditions?.map((condition, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1 mb-1">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {treatment.price.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        treatment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {treatment.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Edit size={16} />}
                          onClick={() => handleEditTreatment(treatment)}
                        >
                          Editar
                        </Button>
                        <button 
                          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                          onClick={() => handleDeleteTreatment(treatment)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Treatment Form Modal */}
      {showNewTreatmentModal && (
        <NewTreatmentForm 
          onClose={() => setShowNewTreatmentModal(false)} 
          onSubmit={handleNewTreatment}
        />
      )}

      {/* Edit Treatment Form Modal */}
      {showEditTreatmentModal && selectedTreatment && (
        <NewTreatmentForm 
          onClose={() => {
            setShowEditTreatmentModal(false);
            setSelectedTreatment(null);
          }} 
          onSubmit={handleUpdateTreatment}
          initialData={selectedTreatment as unknown as NewTreatmentFormOutput}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && selectedTreatment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="text-center">
              <AlertTriangle size={48} className="mx-auto text-red-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Confirmar Eliminación</h3>
              <p className="mt-2 text-sm text-gray-500">
                ¿Estás seguro de que deseas eliminar el tratamiento "{selectedTreatment.name}"? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tratamientos;