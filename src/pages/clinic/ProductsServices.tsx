import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Package, Clock, Pill, Edit, Trash, Eye, DollarSign, Activity, Building2, Tag, BarChart3, X, User, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ProductsServices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'products' | 'services' | 'medicines'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInactive, setShowInactive] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Convex queries and mutations
  const products = useQuery(api.products.getProducts) || [];
  const services = useQuery(api.services.getServices) || [];
  const medicines = useQuery(api.medicines.getMedicines) || [];
  const providers = useQuery(api.providers.getProviders) || [];

  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);

  const createService = useMutation(api.services.createService);
  const updateService = useMutation(api.services.updateService);
  const deleteService = useMutation(api.services.deleteService);

  const createMedicine = useMutation(api.medicines.createMedicine);
  const updateMedicine = useMutation(api.medicines.updateMedicine);
  const deleteMedicine = useMutation(api.medicines.deleteMedicine);

  // Combine all items with type information
  const allItems = [
    ...products.map(item => ({ ...item, itemType: 'product' as const })),
    ...services.map(item => ({ ...item, itemType: 'service' as const })),
    ...medicines.map(item => ({ ...item, itemType: 'medicine' as const })),
  ];

  // Filter items
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || 
      (selectedType === 'products' && item.itemType === 'product') ||
      (selectedType === 'services' && item.itemType === 'service') ||
      (selectedType === 'medicines' && item.itemType === 'medicine');

    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      if (item.itemType === 'product' || item.itemType === 'service') {
        matchesCategory = item.category === selectedCategory;
      } else if (item.itemType === 'medicine') {
        matchesCategory = item.type === selectedCategory;
      }
    }

    const matchesStatus = showInactive ? true : 
      (item.itemType === 'medicine' ? item.status === 'active' : item.isActive);

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const handleNewItem = () => {
    setEditingItem(null);
    setShowNewItemModal(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowNewItemModal(true);
  };

  const handleDeleteItem = async (item: any) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar ${item.name}?`)) return;

    try {
      if (item.itemType === 'product') {
        await deleteProduct({ id: item._id });
      } else if (item.itemType === 'service') {
        await deleteService({ id: item._id });
      } else if (item.itemType === 'medicine') {
        await deleteMedicine({ id: item._id });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (editingItem) {
        // Update existing item
        if (editingItem.itemType === 'product') {
          await updateProduct({ id: editingItem._id, ...formData });
        } else if (editingItem.itemType === 'service') {
          await updateService({ id: editingItem._id, ...formData });
        } else if (editingItem.itemType === 'medicine') {
          await updateMedicine({ id: editingItem._id, ...formData });
        }
      } else {
        // Create new item
        if (formData.itemType === 'product') {
          await createProduct(formData);
        } else if (formData.itemType === 'service') {
          await createService(formData);
        } else if (formData.itemType === 'medicine') {
          await createMedicine(formData);
        }
      }
      setShowNewItemModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const getPrice = (item: any) => {
    if (item.itemType === 'medicine') return item.price;
    return item.basePrice;
  };

  const getIcon = (itemType: string) => {
    switch (itemType) {
      case 'product': return <Package className="w-4 h-4" />;
      case 'service': return <Clock className="w-4 h-4" />;
      case 'medicine': return <Pill className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (itemType: string) => {
    switch (itemType) {
      case 'product': return 'Producto';
      case 'service': return 'Servicio';
      case 'medicine': return 'Medicamento';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Productos y Servicios</h1>
          <p className="text-gray-600">Gestiona tu inventario de productos, servicios y medicamentos</p>
        </div>
        <Button onClick={handleNewItem} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Item
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="products">Productos</option>
              <option value="services">Servicios</option>
              <option value="medicines">Medicamentos</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              <option value="alimentacion">Alimentación</option>
              <option value="higiene">Higiene</option>
              <option value="accesorios">Accesorios</option>
              <option value="juguetes">Juguetes</option>
              <option value="salud">Salud</option>
              <option value="consulta">Consulta</option>
              <option value="cirugia">Cirugía</option>
              <option value="vacunacion">Vacunación</option>
              <option value="peluqueria">Peluquería</option>
            </select>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showInactive"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded text-blue-600"
              />
              <label htmlFor="showInactive" className="text-sm text-gray-600">
                Mostrar inactivos
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Package className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Items Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={`${item.itemType}-${item._id}`} className="hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getIcon(item.itemType)}
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getTypeLabel(item.itemType)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                      className="p-1"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteItem(item)}
                      className="p-1 text-red-600 hover:bg-red-50"
                    >
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>{item.itemType === 'medicine' ? item.type : item.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium text-lg text-green-600">
                      €{getPrice(item).toFixed(2)}
                    </span>
                  </div>

                  {item.itemType === 'product' && (
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>Stock: {item.currentStock}</span>
                      {item.currentStock <= item.minStock && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}

                  {item.itemType === 'service' && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{item.duration} min</span>
                    </div>
                  )}

                  {item.itemType === 'medicine' && (
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>Stock: {item.stock}</span>
                      {item.stock <= item.minStock && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}

                  {item.provider && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span className="truncate">{item.provider.name}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (item.itemType === 'medicine' ? item.status === 'active' : item.isActive)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(item.itemType === 'medicine' ? item.status === 'active' : item.isActive) ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // List view
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock/Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={`${item.itemType}-${item._id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getIcon(item.itemType)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {getTypeLabel(item.itemType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.itemType === 'medicine' ? item.type : item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      €{getPrice(item).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.itemType === 'service' 
                        ? `${item.duration} min`
                        : item.itemType === 'medicine'
                        ? `${item.stock} unidades`
                        : `${item.currentStock} unidades`
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.provider?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (item.itemType === 'medicine' ? item.status === 'active' : item.isActive)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(item.itemType === 'medicine' ? item.status === 'active' : item.isActive) ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDeleteItem(item)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New/Edit Item Modal */}
      {showNewItemModal && (
        <ItemFormModal
          item={editingItem}
          providers={providers}
          onSave={handleFormSubmit}
          onClose={() => {
            setShowNewItemModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

// Item Form Modal Component
const ItemFormModal = ({ item, providers, onSave, onClose }: any) => {
  const [formData, setFormData] = useState({
    itemType: item?.itemType || 'product',
    name: item?.name || '',
    category: item?.category || item?.type || '',
    description: item?.description || '',
    basePrice: item?.basePrice || item?.price || 0,
    vat: item?.vat || 21,
    cost: item?.cost || 0,
    margin: item?.margin || 0,
    reference: item?.reference || '',
    barcode: item?.barcode || '',
    currentStock: item?.currentStock || item?.stock || 0,
    minStock: item?.minStock || 0,
    duration: item?.duration || item?.recommendedDosage || '',
    isActive: item?.isActive !== undefined ? item.isActive : item?.status === 'active' || true,
    providerId: item?.providerId || '',
    // Medicine specific fields
    activeIngredient: item?.activeIngredient || '',
    manufacturer: item?.manufacturer || '',
    dosageForm: item?.dosageForm || '',
    species: item?.species || [],
    recommendedDosage: item?.recommendedDosage || '',
    conditions: item?.conditions || [],
    contraindications: item?.contraindications || [],
    sideEffects: item?.sideEffects || [],
    interactions: item?.interactions || [],
    registrationNumber: item?.registrationNumber || '',
    atcVetCode: item?.atcVetCode || '',
    prescriptionRequired: item?.prescriptionRequired || false,
    psychotropic: item?.psychotropic || false,
    antibiotic: item?.antibiotic || false,
    administrationRoutes: item?.administrationRoutes || [],
    excipients: item?.excipients || [],
    withdrawalPeriod: item?.withdrawalPeriod || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData: any = {
      itemType: formData.itemType,
      name: formData.name,
      description: formData.description,
      providerId: formData.providerId || undefined,
    };

    if (formData.itemType === 'product') {
      // Para productos, crear un objeto específico sin itemType
      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        basePrice: formData.basePrice,
        vat: formData.vat,
        cost: formData.cost,
        margin: formData.margin,
        reference: formData.reference,
        barcode: formData.barcode,
        currentStock: formData.currentStock,
        minStock: formData.minStock,
        isActive: formData.isActive,
        providerId: formData.providerId || undefined,
      };
      onSave(productData);
      return;
    } else if (formData.itemType === 'service') {
      // Para servicios, crear un objeto específico sin itemType
      const serviceData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        basePrice: formData.basePrice,
        vat: formData.vat,
        cost: formData.cost,
        margin: formData.margin,
        duration: parseInt(formData.duration) || 30,
        isActive: formData.isActive,
        providerId: formData.providerId || undefined,
      };
      onSave(serviceData);
      return;
    } else if (formData.itemType === 'medicine') {
      // Para medicamentos, crear un objeto específico sin itemType
      const medicineData = {
        name: formData.name,
        activeIngredient: formData.activeIngredient,
        manufacturer: formData.manufacturer,
        type: formData.category,
        dosageForm: formData.dosageForm,
        species: formData.species,
        recommendedDosage: formData.recommendedDosage,
        duration: formData.duration,
        registrationNumber: formData.registrationNumber || undefined,
        reference: formData.reference || undefined,
        stock: formData.currentStock,
        minStock: formData.minStock,
        price: formData.basePrice,
        conditions: formData.conditions,
        contraindications: formData.contraindications,
        sideEffects: formData.sideEffects,
        interactions: formData.interactions,
        status: formData.isActive ? 'active' : 'inactive',
        atcVetCode: formData.atcVetCode || undefined,
        prescriptionRequired: formData.prescriptionRequired,
        psychotropic: formData.psychotropic,
        antibiotic: formData.antibiotic,
        administrationRoutes: formData.administrationRoutes,
        excipients: formData.excipients,
        withdrawalPeriod: formData.withdrawalPeriod || undefined,
        providerId: formData.providerId || undefined,
      };

      // Para medicamentos, usar el objeto específico sin campos extra
      onSave(medicineData);
      return;
    }
  };

  const renderFormFields = () => {
    switch (formData.itemType) {
      case 'product':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Precio Base"
                type="number"
                step="0.01"
                value={formData.basePrice.toString()}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                required
              />
              <Input
                label="IVA (%)"
                type="number"
                value={formData.vat.toString()}
                onChange={(e) => setFormData({ ...formData, vat: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Coste"
                type="number"
                step="0.01"
                value={formData.cost.toString()}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Margen (%)"
                type="number"
                value={formData.margin.toString()}
                onChange={(e) => setFormData({ ...formData, margin: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Referencia"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
              <Input
                label="Código de Barras"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stock Actual"
                type="number"
                value={formData.currentStock.toString()}
                onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                required
              />
              <Input
                label="Stock Mínimo"
                type="number"
                value={formData.minStock.toString()}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </>
        );

      case 'service':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Precio Base"
                type="number"
                step="0.01"
                value={formData.basePrice.toString()}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                required
              />
              <Input
                label="IVA (%)"
                type="number"
                value={formData.vat.toString()}
                onChange={(e) => setFormData({ ...formData, vat: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Coste"
                type="number"
                step="0.01"
                value={formData.cost.toString()}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
              />
              <Input
                label="Margen (%)"
                type="number"
                value={formData.margin.toString()}
                onChange={(e) => setFormData({ ...formData, margin: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <Input
              label="Duración (minutos)"
              type="number"
              value={formData.duration.toString()}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              required
            />
          </>
        );

      case 'medicine':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Principio Activo"
                placeholder="Ej: Amoxicilina"
                value={formData.activeIngredient}
                onChange={(e) => setFormData({...formData, activeIngredient: e.target.value})}
                required
              />
              <Input
                label="Fabricante"
                placeholder="Ej: Laboratorios MSD"
                value={formData.manufacturer}
                onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forma Farmacéutica</label>
                <select
                  value={formData.dosageForm}
                  onChange={(e) => setFormData({...formData, dosageForm: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Seleccionar forma</option>
                  <option value="Comprimidos">Comprimidos</option>
                  <option value="Cápsulas">Cápsulas</option>
                  <option value="Suspensión oral">Suspensión oral</option>
                  <option value="Solución oral">Solución oral</option>
                  <option value="Solución inyectable">Solución inyectable</option>
                  <option value="Pomada">Pomada</option>
                  <option value="Crema">Crema</option>
                  <option value="Gel">Gel</option>
                  <option value="Gotas">Gotas</option>
                  <option value="Spray">Spray</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <Input
                label="Posología Recomendada"
                placeholder="Ej: 10-20 mg/kg cada 12h"
                value={formData.recommendedDosage}
                onChange={(e) => setFormData({...formData, recommendedDosage: e.target.value})}
                required
              />
              <Input
                label="Duración Recomendada"
                placeholder="Ej: 7-10 días"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
              />
              <Input
                label="Número de Registro"
                placeholder="Ej: 2568 ESP"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
              />
              <Input
                label="Referencia"
                placeholder="Ej: AMX250-100"
                value={formData.reference}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
              />
              <Input
                label="Stock Actual"
                type="number"
                value={formData.currentStock.toString()}
                onChange={(e) => setFormData({...formData, currentStock: parseInt(e.target.value) || 0})}
                required
              />
              <Input
                label="Stock Mínimo"
                type="number"
                value={formData.minStock.toString()}
                onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                required
              />
              <Input
                label="Precio"
                type="number"
                step="0.01"
                value={formData.basePrice.toString()}
                onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value) || 0})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especies</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Perro', 'Gato', 'Conejo', 'Hurón', 'Ave', 'Reptil', 'Roedor', 'Équido'].map((species) => (
                  <label key={species} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.species.includes(species)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, species: [...formData.species, species]});
                        } else {
                          setFormData({...formData, species: formData.species.filter(s => s !== species)});
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">{species}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Indicaciones</label>
                <textarea
                  rows={3}
                  value={formData.conditions.join('\n')}
                  onChange={(e) => setFormData({...formData, conditions: e.target.value.split('\n').filter(c => c.trim())})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Una indicación por línea..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraindicaciones</label>
                <textarea
                  rows={3}
                  value={formData.contraindications.join('\n')}
                  onChange={(e) => setFormData({...formData, contraindications: e.target.value.split('\n').filter(c => c=> c.trim())})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Una contraindicación por línea..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Efectos Secundarios</label>
                <textarea
                  rows={3}
                  value={formData.sideEffects.join('\n')}
                  onChange={(e) => setFormData({...formData, sideEffects: e.target.value.split('\n').filter(c => c.trim())})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Un efecto secundario por línea..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interacciones</label>
                <textarea
                  rows={3}
                  value={formData.interactions.join('\n')}
                  onChange={(e) => setFormData({...formData, interactions: e.target.value.split('\n').filter(c => c.trim())})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Una interacción por línea..."
                />
              </div>
            </div>


          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {item ? 'Editar' : 'Nuevo'} {formData.itemType === 'product' ? 'Producto' : formData.itemType === 'service' ? 'Servicio' : 'Medicamento'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!item && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={formData.itemType}
                onChange={(e) => setFormData({ ...formData, itemType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="product">Producto</option>
                <option value="service">Servicio</option>
                <option value="medicine">Medicamento</option>
              </select>
            </div>
          )}

          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría/Tipo
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccionar categoría</option>
              {formData.itemType === 'product' && (
                <>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Higiene">Higiene</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Juguetes">Juguetes</option>
                  <option value="Salud">Salud</option>
                  <option value="Cuidado dental">Cuidado dental</option>
                  <option value="Camas y descanso">Camas y descanso</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Adiestramiento">Adiestramiento</option>
                  <option value="Otro">Otro</option>
                </>
              )}
              {formData.itemType === 'service' && (
                <>
                  <option value="Consulta">Consulta</option>
                  <option value="Cirugía">Cirugía</option>
                  <option value="Vacunación">Vacunación</option>
                  <option value="Peluquería">Peluquería</option>
                  <option value="Rehabilitación">Rehabilitación</option>
                  <option value="Análisis">Análisis</option>
                  <option value="Radiología">Radiología</option>
                  <option value="Hospitalización">Hospitalización</option>
                  <option value="Urgencias">Urgencias</option>
                  <option value="Otro">Otro</option>
                </>
              )}
              {formData.itemType === 'medicine' && (
                <>
                  <option value="Antibiótico">Antibiótico</option>
                  <option value="Antiinflamatorio">Antiinflamatorio</option>
                  <option value="Antialérgico">Antialérgico</option>
                  <option value="Antiparasitario">Antiparasitario</option>
                  <option value="Analgésico">Analgésico</option>
                  <option value="Hormonal">Hormonal</option>
                  <option value="Cardiovascular">Cardiovascular</option>
                  <option value="Dermatológico">Dermatológico</option>
                  <option value="Oftalmológico">Oftalmológico</option>
                  <option value="Otro">Otro</option>
                </>
              )}
            </select>
          </div>

          {formData.itemType !== 'medicine' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          )}

          {renderFormFields()}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proveedor
            </label>
            <select
              value={formData.providerId}
              onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sin proveedor</option>
              {providers.map((provider: any) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Activo
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <Button type="submit">
              {item ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductsServices;