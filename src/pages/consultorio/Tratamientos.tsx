import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash, X, Check, Grid, List, ChevronDown, ChevronUp, AlertTriangle, Clock, DollarSign, Pill, FileText, Clipboard, Activity, Calendar, Download, Printer } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

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

// Common procedures
const procedureOptions = [
  { id: 'Ultrasonido dental', name: 'Ultrasonido dental' },
  { id: 'Pulido dental', name: 'Pulido dental' },
  { id: 'Aplicación de flúor', name: 'Aplicación de flúor' },
  { id: 'Radiografía', name: 'Radiografía' },
  { id: 'Ecografía', name: 'Ecografía' },
  { id: 'Análisis de sangre', name: 'Análisis de sangre' },
  { id: 'Biopsia', name: 'Biopsia' },
  { id: 'Cirugía menor', name: 'Cirugía menor' },
  { id: 'Anestesia general', name: 'Anestesia general' },
  { id: 'Masaje terapéutico', name: 'Masaje terapéutico' }
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
  const medicines = useQuery(api.medicines.getMedicines) || [];
  const createTreatment = useMutation(api.treatments.createTreatment);
  const updateTreatment = useMutation(api.treatments.updateTreatment);
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

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    duration: 0,
    followUpPeriod: 0,
    price: 0,
    status: 'active' as 'active' | 'inactive',
    species: [] as string[],
    sex: 'both' as 'male' | 'female' | 'both',
    clinicArea: '',
    conditions: [] as string[],
    associatedMedicines: [] as Id<"medicines">[],
    procedures: [] as string[],
    contraindications: [] as string[],
    sideEffects: [] as string[],
    notes: '',
    minAge: 0,
    maxAge: 0,
  });

  // Filter treatments based on search term and filters
  const filteredTreatments = treatments.filter(treatment => {
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
    setFormData({
      name: treatment.name,
      category: treatment.category,
      description: treatment.description,
      duration: treatment.duration,
      followUpPeriod: treatment.followUpPeriod || 0,
      price: treatment.price,
      status: treatment.status,
      species: treatment.species,
      sex: treatment.sex,
      clinicArea: treatment.clinicArea || '',
      conditions: treatment.conditions,
      associatedMedicines: treatment.associatedMedicines,
      procedures: treatment.procedures,
      contraindications: treatment.contraindications,
      sideEffects: treatment.sideEffects,
      notes: treatment.notes || '',
      minAge: treatment.minAge || 0,
      maxAge: treatment.maxAge || 0,
    });
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

  const handleNewTreatment = async () => {
    try {
      const data = {
        ...formData,
        followUpPeriod: formData.followUpPeriod || undefined,
        clinicArea: formData.clinicArea || undefined,
        notes: formData.notes || undefined,
        minAge: formData.minAge || undefined,
        maxAge: formData.maxAge || undefined,
      };
      await createTreatment(data);
      setShowNewTreatmentModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating treatment:', error);
    }
  };

  const handleUpdateTreatment = async () => {
    if (selectedTreatment) {
      try {
        const data = {
          id: selectedTreatment._id,
          ...formData,
          followUpPeriod: formData.followUpPeriod || undefined,
          clinicArea: formData.clinicArea || undefined,
          notes: formData.notes || undefined,
          minAge: formData.minAge || undefined,
          maxAge: formData.maxAge || undefined,
        };
        await updateTreatment(data);
        setShowEditTreatmentModal(false);
        resetForm();
      } catch (error) {
        console.error('Error updating treatment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      duration: 0,
      followUpPeriod: 0,
      price: 0,
      status: 'active',
      species: [],
      sex: 'both',
      clinicArea: '',
      conditions: [],
      associatedMedicines: [],
      procedures: [],
      contraindications: [],
      sideEffects: [],
      notes: '',
      minAge: 0,
      maxAge: 0,
    });
    setSelectedTreatment(null);
  };

  const handleSpeciesChange = (species: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      species: checked 
        ? [...prev.species, species]
        : prev.species.filter(s => s !== species)
    }));
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      conditions: checked 
        ? [...prev.conditions, condition]
        : prev.conditions.filter(c => c !== condition)
    }));
  };

  const handleProcedureChange = (procedure: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      procedures: checked 
        ? [...prev.procedures, procedure]
        : prev.procedures.filter(p => p !== procedure)
    }));
  };

  const handleMedicineChange = (medicineId: Id<"medicines">, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      associatedMedicines: checked 
        ? [...prev.associatedMedicines, medicineId]
        : prev.associatedMedicines.filter(m => m !== medicineId)
    }));
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
    let startY = 40;
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

  const getMedicineName = (medicineId: Id<"medicines">) => {
    const medicine = medicines.find(m => m._id === medicineId);
    return medicine ? medicine.name : 'Medicamento no encontrado';
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
                    <p className="text-sm font-medium text-gray-900 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {treatment.duration} min
                    </p>
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
                        <Clock size```python
={14} className="mr-1" />
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

      {/* New Treatment Modal */}
      {showNewTreatmentModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Nuevo Tratamiento</h2>
              <button
                onClick={() => {
                  setShowNewTreatmentModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nombre del Tratamiento"
                    placeholder="Ej: Limpieza Dental Completa"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.filter(c => c.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Descripción detallada del tratamiento..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración (minutos)
                    </label>
                    <Input
                      type="number"
                      placeholder="Ej: 30"
                      value={formData.duration.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      min="1"
                      required
                      icon={<Clock size={18} />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Período de Seguimiento (días)
                    </label>
                    <Input
                      type="number"
                      placeholder="Ej: 14"
                      value={formData.followUpPeriod?.toString() || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, followUpPeriod: parseInt(e.target.value) || undefined }))}
                      min="0"
                      icon={<Calendar size={18} />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio (€)
                    </label>
                    <Input
                      type="number"
                      placeholder="Ej: 85.00"
                      value={formData.price.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      step="0.01"
                      required
                      icon={<DollarSign size={18} />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      required
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Aplicabilidad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Especies
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                        {speciesOptions.filter(s => s.id !== 'all').map(species => (
                          <label key={species.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.species.includes(species.id)}
                              onChange={(e) => handleSpeciesChange(species.id, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{species.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sexo
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={formData.sex}
                        onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value as 'male' | 'female' | 'both' }))}
                      >
                        <option value="both">Ambos</option>
                        <option value="male">Solo machos</option>
                        <option value="female">Solo hembras</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Área Clínica
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={formData.clinicArea}
                        onChange={(e) => setFormData(prev => ({ ...prev, clinicArea: e.target.value }))}
                      >
                        <option value="">Seleccionar área</option>
                        {clinicAreaOptions.filter(a => a.id !== 'all').map(area => (
                          <option key={area.id} value={area.id}>{area.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dolencias Tratadas
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                        {conditionOptions.map(condition => (
                          <label key={condition.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.conditions.includes(condition.id)}
                              onChange={(e) => handleConditionChange(condition.id, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{condition.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Medicamentos Asociados</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar y seleccionar medicamento
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar medicamento por nombre o principio activo..."
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                          onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase();
                            const filteredMedicines = medicines.filter(medicine =>
                              medicine.name.toLowerCase().includes(searchTerm) ||
                              medicine.activeIngredient.toLowerCase().includes(searchTerm)
                            );
                            // Update filtered medicines state if needed
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Search size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        onChange={(e) => {
                          const medicineId = e.target.value as Id<"medicines">;
                          if (medicineId && !formData.associatedMedicines.includes(medicineId)) {
                            setFormData(prev => ({
                              ...prev,
                              associatedMedicines: [...prev.associatedMedicines, medicineId]
                            }));
                          }
                          e.target.value = '';
                        }}
                        value=""
                      >
                        <option value="">Seleccionar medicamento...</option>
                        {medicines
                          .filter(medicine => !formData.associatedMedicines.includes(medicine._id))
                          .map(medicine => (
                            <option key={medicine._id} value={medicine._id}>
                              {medicine.name} - {medicine.activeIngredient} ({medicine.manufacturer})
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Selected medicines */}
                    {formData.associatedMedicines.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medicamentos seleccionados
                        </label>
                        <div className="space-y-2">
                          {formData.associatedMedicines.map(medicineId => {
                            const medicine = medicines.find(m => m._id === medicineId);
                            if (!medicine) return null;
                            return (
                              <div key={medicineId} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
                                <span className="text-sm text-gray-900">
                                  <strong>{medicine.name}</strong> - {medicine.activeIngredient}
                                  <span className="text-gray-500 ml-1">({medicine.manufacturer})</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      associatedMedicines: prev.associatedMedicines.filter(id => id !== medicineId)
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Procedimientos</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {procedureOptions.map(procedure => (
                      <label key={procedure.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.procedures.includes(procedure.id)}
                          onChange={(e) => handleProcedureChange(procedure.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{procedure.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contraindicaciones y Efectos Secundarios</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraindicaciones
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Una contraindicación por línea..."
                        value={formData.contraindications.join('\n')}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          contraindications: e.target.value.split('\n').filter(line => line.trim() !== '')
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Efectos Secundarios
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Un efecto secundario por línea..."
                        value={formData.sideEffects.join('\n')}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          sideEffects: e.target.value.split('\n').filter(line => line.trim() !== '')
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas Adicionales
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Información adicional relevante..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewTreatmentModal(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleNewTreatment}
              >
                Guardar Tratamiento
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Treatment Modal */}
      {showEditTreatmentModal && selectedTreatment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Editar Tratamiento</h2>
              <button
                onClick={() => {
                  setShowEditTreatmentModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nombre del Tratamiento"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                    >
                      {categories.filter(c => c.id !== 'all').map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración (minutos)
                    </label>
                    <Input
                      type="number"
                      value={formData.duration.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      min="1"
                      required
                      icon={<Clock size={18} />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Período de Seguimiento (días)
                    </label>
                    <Input
                      type="number"
                      value={formData.followUpPeriod?.toString() || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, followUpPeriod: parseInt(e.target.value) || undefined }))}
                      min="0"
                      icon={<Calendar size={18} />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio (€)
                    </label>
                    <Input
                      type="number"
                      value={formData.price.toString()}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      step="0.01"
                      required
                      icon={<DollarSign size={18} />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      required
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Aplicabilidad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Especies
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                        {speciesOptions.filter(s => s.id !== 'all').map(species => (
                          <label key={species.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.species.includes(species.id)}
                              onChange={(e) => handleSpeciesChange(species.id, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{species.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sexo
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={formData.sex}
                        onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value as 'male' | 'female' | 'both' }))}
                      >
                        <option value="both">Ambos</option>
                        <option value="male">Solo machos</option>
                        <option value="female">Solo hembras</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Área Clínica
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={formData.clinicArea}
                        onChange={(e) => setFormData(prev => ({ ...prev, clinicArea: e.target.value }))}
                      >
                        <option value="">Seleccionar área</option>
                        {clinicAreaOptions.filter(a => a.id !== 'all').map(area => (
                          <option key={area.id} value={area.id}>{area.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dolencias Tratadas
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                        {conditionOptions.map(condition => (
                          <label key={condition.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.conditions.includes(condition.id)}
                              onChange={(e) => handleConditionChange(condition.id, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{condition.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Medicamentos Asociados</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar y seleccionar medicamento
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Buscar medicamento por nombre o principio activo..."
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                          onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase();
                            const filteredMedicines = medicines.filter(medicine =>
                              medicine.name.toLowerCase().includes(searchTerm) ||
                              medicine.activeIngredient.toLowerCase().includes(searchTerm)
                            );
                            // Update filtered medicines state if needed
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Search size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        onChange={(e) => {
                          const medicineId = e.target.value as Id<"medicines">;
                          if (medicineId && !formData.associatedMedicines.includes(medicineId)) {
                            setFormData(prev => ({
                              ...prev,
                              associatedMedicines: [...prev.associatedMedicines, medicineId]
                            }));
                          }
                          e.target.value = '';
                        }}
                        value=""
                      >
                        <option value="">Seleccionar medicamento...</option>
                        {medicines
                          .filter(medicine => !formData.associatedMedicines.includes(medicine._id))
                          .map(medicine => (
                            <option key={medicine._id} value={medicine._id}>
                              {medicine.name} - {medicine.activeIngredient} ({medicine.manufacturer})
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Selected medicines */}
                    {formData.associatedMedicines.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medicamentos seleccionados
                        </label>
                        <div className="space-y-2">
                          {formData.associatedMedicines.map(medicineId => {
                            const medicine = medicines.find(m => m._id === medicineId);
                            if (!medicine) return null;
                            return (
                              <div key={medicineId} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
                                <span className="text-sm text-gray-900">
                                  <strong>{medicine.name}</strong> - {medicine.activeIngredient}
                                  <span className="text-gray-500 ml-1">({medicine.manufacturer})</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      associatedMedicines: prev.associatedMedicines.filter(id => id !== medicineId)
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Procedimientos</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {procedureOptions.map(procedure => (
                      <label key={procedure.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.procedures.includes(procedure.id)}
                          onChange={(e) => handleProcedureChange(procedure.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{procedure.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contraindicaciones y Efectos Secundarios</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraindicaciones
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Una contraindicación por línea..."
                        value={formData.contraindications.join('\n')}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          contraindications: e.target.value.split('\n').filter(line => line.trim() !== '')
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Efectos Secundarios
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Un efecto secundario por línea..."
                        value={formData.sideEffects.join('\n')}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          sideEffects: e.target.value.split('\n').filter(line => line.trim() !== '')
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas Adicionales
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Información adicional relevante..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditTreatmentModal(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateTreatment}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
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