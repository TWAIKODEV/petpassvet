import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Package, RefreshCw, Edit, Trash, Tag, Eye, X, DollarSign, Printer } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface Product {
  id: string;
  name: string;
  type: 'product' | 'service';
  category: string;
  description: string;
  price: number;
  tax: number;
  reference?: string;
  duration?: number;
  status: 'active' | 'inactive';
}

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Consulta General',
    type: 'service',
    category: 'Consultas',
    description: 'Consulta veterinaria general',
    price: 45.00,
    tax: 21,
    duration: 30,
    status: 'active'
  },
  {
    id: '2',
    name: 'Vacunación',
    type: 'service',
    category: 'Vacunas',
    description: 'Servicio de vacunación',
    price: 35.00,
    tax: 21,
    duration: 15,
    status: 'active'
  },
  {
    id: '3',
    name: 'Pienso Premium 12kg',
    type: 'product',
    category: 'Alimentación',
    description: 'Pienso de alta calidad para perros adultos',
    price: 65.50,
    tax: 10,
    reference: 'PP-12KG',
    status: 'active'
  },
  {
    id: '4',
    name: 'Peluquería Completa',
    type: 'service',
    category: 'Peluquería',
    description: 'Servicio completo de peluquería',
    price: 55.00,
    tax: 21,
    duration: 90,
    status: 'active'
  }
];

const ProductsServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'product' | 'service'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  // Get unique categories
  const categories = Array.from(new Set(mockProducts.map(p => p.category)));

  // Filter products based on search term and filters
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || product.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = showInactive ? true : product.status === 'active';
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const handleNewProduct = (productData: any) => {
    // Here you would typically make an API call to save the new product
    console.log('New product data:', productData);
    setShowNewProductModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos & Servicios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión del catálogo de productos y servicios
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex rounded-md shadow-sm">
            <button
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('grid')}
              title="Vista de tarjetas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('list')}
              title="Vista de lista"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
          <Button
            variant="outline"
            icon={<Download size={18} />}
            className="flex-1 sm:flex-none"
          >
            Exportar
          </Button>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => setShowNewProductModal(true)}
          >
            Nuevo Producto/Servicio
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder="Buscar productos y servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="flex-1"
          />
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'all' | 'product' | 'service')}
          >
            <option value="all">Todos los tipos</option>
            <option value="product">Productos</option>
            <option value="service">Servicios</option>
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
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
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => (
            <Card key={item.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit size={16} />}
                    >
                      Editar
                    </Button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {item.type === 'product' ? 'Producto' : 'Servicio'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {item.category}
                  </span>
                  {item.status === 'inactive' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactivo
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="text-sm font-medium text-gray-900">
                      {item.price.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">IVA</p>
                    <p className="text-sm font-medium text-gray-900">{item.tax}%</p>
                  </div>
                  {item.type === 'product' && item.reference && (
                    <div>
                      <p className="text-xs text-gray-500">Referencia</p>
                      <p className="text-sm font-medium text-gray-900">{item.reference}</p>
                    </div>
                  )}
                  {item.type === 'service' && item.duration && (
                    <div>
                      <p className="text-xs text-gray-500">Duración</p>
                      <p className="text-sm font-medium text-gray-900">{item.duration} min</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Tag size={16} />}
                    >
                      Precios Especiales
                    </Button>
                    <p className="text-sm text-gray-500">
                      {item.type === 'product' ? 'Stock disponible' : 'Disponible'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto/Servicio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IVA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ref./Duración
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {product.type === 'product' ? 'Producto' : 'Servicio'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.price.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.tax}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.type === 'product' ? product.reference : `${product.duration} min`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          title="Imprimir"
                        >
                          <Printer size={18} />
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          title="Descargar"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No se encontraron productos o servicios</h3>
              <p className="text-gray-500 mt-1">Prueba con otros términos de búsqueda o cambia los filtros</p>
            </div>
          )}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles del {selectedProduct.type === 'product' ? 'Producto' : 'Servicio'}
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Información General</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nombre</p>
                      <p className="mt-1 text-base font-medium text-gray-900">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Descripción</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tipo</p>
                        <p className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedProduct.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {selectedProduct.type === 'product' ? 'Producto' : 'Servicio'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Categoría</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.category}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Precio</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedProduct.price.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">IVA</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.tax}%</p>
                      </div>
                    </div>
                    {selectedProduct.type === 'product' && selectedProduct.reference && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Referencia</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.reference}</p>
                      </div>
                    )}
                    {selectedProduct.type === 'service' && selectedProduct.duration && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Duración</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.duration} minutos</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estado</p>
                      <p className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedProduct.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedProduct.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Información de Precios</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Precio Base</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedProduct.price.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">IVA ({selectedProduct.tax}%)</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {(selectedProduct.price * selectedProduct.tax / 100).toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Precio con IVA</p>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {(selectedProduct.price * (1 + selectedProduct.tax / 100)).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-500">Precios Especiales</p>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">No hay precios especiales configurados</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
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
                Descargar
              </Button>
              <Button
                variant="outline"
                icon={<Edit size={18} />}
              >
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedProduct(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Product/Service Modal */}
      {showNewProductModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nuevo Producto/Servicio
              </h3>
              <button
                onClick={() => setShowNewProductModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Nombre"
                        name="name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <select
                        name="type"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="product">Producto</option>
                        <option value="service">Servicio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría
                      </label>
                      <select
                        name="category"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="Consultas">Consultas</option>
                        <option value="Vacunas">Vacunas</option>
                        <option value="Cirugías">Cirugías</option>
                        <option value="Peluquería">Peluquería</option>
                        <option value="Alimentación">Alimentación</option>
                        <option value="Medicamentos">Medicamentos</option>
                        <option value="Accesorios">Accesorios</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        name="description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Descripción detallada del producto o servicio..."
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <DollarSign className="text-green-600 mr-3" size={24} />
                    <h3 className="text-lg font-medium text-gray-900">Información de Precios</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Precio Base"
                      type="number"
                      name="price"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IVA
                      </label>
                      <select
                        name="tax"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar IVA</option>
                        <option value="0">0%</option>
                        <option value="4">4%</option>
                        <option value="10">10%</option>
                        <option value="21">21%</option>
                      </select>
                    </div>
                    <Input
                      label="Coste"
                      type="number"
                      name="cost"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <Input
                      label="Margen (%)"
                      type="number"
                      name="margin"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {/* Product-specific fields */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles Específicos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="product-field">
                      <Input
                        label="Referencia"
                        name="reference"
                        placeholder="Ej: PROD-001"
                      />
                    </div>
                    <div className="product-field">
                      <Input
                        label="Código de Barras"
                        name="barcode"
                        placeholder="Ej: 8414606123456"
                      />
                    </div>
                    <div className="product-field">
                      <Input
                        label="Stock Actual"
                        type="number"
                        name="stock"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div className="product-field">
                      <Input
                        label="Stock Mínimo"
                        type="number"
                        name="minStock"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div className="service-field">
                      <Input
                        label="Duración (minutos)"
                        type="number"
                        name="duration"
                        placeholder="30"
                        min="0"
                      />
                    </div>
                    <div className="service-field">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profesional Asignado
                      </label>
                      <select
                        name="professional"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar profesional</option>
                        <option value="any">Cualquiera</option>
                        <option value="veterinarian">Solo Veterinarios</option>
                        <option value="assistant">Solo Auxiliares</option>
                        <option value="groomer">Solo Peluqueros</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        name="status"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proveedor
                      </label>
                      <select
                        name="supplier"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar proveedor</option>
                        <option value="1">VetSupplies S.L.</option>
                        <option value="2">PetFood Distribución</option>
                        <option value="3">MedVet Distribución</option>
                        <option value="4">Laboratorios Syva</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Etiquetas
                      </label>
                      <Input
                        placeholder="Ej: perro, gato, vacuna, antibiótico (separadas por comas)"
                        name="tags"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowNewProductModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Here you would typically submit the form
                  handleNewProduct({});
                }}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsServices;