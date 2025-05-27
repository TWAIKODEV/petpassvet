import React, { useState } from 'react';
import { Plus, Search, Filter, Download, AlertTriangle, Package, ArrowDown, ArrowUp, RefreshCw, Edit, Trash, Tag, Eye, X, DollarSign, ShoppingCart, Pill, ShoppingBag, Briefcase, Scissors } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  sku: string;
  barcode?: string;
  brand: string;
  supplier: string;
  location: string;
  lastUpdated: string;
  status: 'active' | 'inactive';
  area: 'medications' | 'store' | 'grooming' | 'office';
  images?: string[];
  tags?: string[];
}

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Amoxicilina 250mg',
    category: 'Antibióticos',
    subcategory: 'Comprimidos',
    description: 'Antibiótico de amplio espectro para perros y gatos',
    price: 25.50,
    cost: 15.30,
    stock: 45,
    minStock: 20,
    sku: 'MED-AMOX-250',
    barcode: '8414606123456',
    brand: 'VetPharma',
    supplier: 'VetSupplies S.L.',
    location: 'Almacén A-1',
    lastUpdated: '2025-05-20',
    status: 'active',
    area: 'medications',
    tags: ['antibiótico', 'perro', 'gato']
  },
  {
    id: '2',
    name: 'Meloxicam 1.5mg/ml',
    category: 'Antiinflamatorios',
    subcategory: 'Suspensión oral',
    description: 'Antiinflamatorio no esteroideo para perros',
    price: 18.75,
    cost: 10.25,
    stock: 32,
    minStock: 15,
    sku: 'MED-MELOX-15',
    barcode: '8414606234567',
    brand: 'VetPharma',
    supplier: 'VetSupplies S.L.',
    location: 'Almacén A-1',
    lastUpdated: '2025-05-19',
    status: 'active',
    area: 'medications',
    tags: ['antiinflamatorio', 'perro']
  },
  {
    id: '3',
    name: 'Royal Canin Medium Adult 15kg',
    category: 'Comida',
    subcategory: 'Pienso Seco',
    description: 'Alimento completo para perros adultos de razas medianas',
    price: 65.99,
    cost: 45.50,
    stock: 25,
    minStock: 10,
    sku: 'RC-MED-15KG',
    barcode: '3182550708203',
    brand: 'Royal Canin',
    supplier: 'Distribuciones PetFood',
    location: 'Almacén B-1',
    lastUpdated: '2025-05-20',
    status: 'active',
    area: 'store',
    tags: ['perro', 'adulto', 'raza mediana']
  },
  {
    id: '4',
    name: 'Cama Ortopédica Grande',
    category: 'Accesorios',
    subcategory: 'Camas',
    description: 'Cama ortopédica con espuma viscoelástica para perros grandes',
    price: 89.95,
    cost: 62.30,
    stock: 8,
    minStock: 5,
    sku: 'ACC-CAMA-ORT-L',
    brand: 'PetComfort',
    supplier: 'PetAccessories Inc.',
    location: 'Almacén B-2',
    lastUpdated: '2025-05-19',
    status: 'active',
    area: 'store',
    tags: ['perro', 'gato', 'ortopédico', 'grande']
  },
  {
    id: '5',
    name: 'Champú Dermatológico 500ml',
    category: 'Salud & Higiene',
    subcategory: 'Champús',
    description: 'Champú dermatológico para perros con piel sensible',
    price: 18.50,
    cost: 10.25,
    stock: 42,
    minStock: 15,
    sku: 'SH-DERM-500',
    barcode: '8414606754321',
    brand: 'VetDerm',
    supplier: 'Laboratorios VetCare',
    location: 'Almacén C-1',
    lastUpdated: '2025-05-18',
    status: 'active',
    area: 'grooming',
    tags: ['perro', 'gato', 'dermatológico', 'piel sensible']
  },
  {
    id: '6',
    name: 'Tijeras Profesionales',
    category: 'Herramientas',
    subcategory: 'Tijeras',
    description: 'Tijeras profesionales para peluquería canina',
    price: 45.99,
    cost: 28.50,
    stock: 12,
    minStock: 5,
    sku: 'GROOM-TIJ-PRO',
    brand: 'GroomPro',
    supplier: 'GroomingSupplies Co.',
    location: 'Almacén C-2',
    lastUpdated: '2025-05-17',
    status: 'active',
    area: 'grooming',
    tags: ['peluquería', 'herramientas']
  },
  {
    id: '7',
    name: 'Papel A4 (Cajas)',
    category: 'Material de Oficina',
    subcategory: 'Papel',
    description: 'Cajas de papel A4 para impresora',
    price: 22.50,
    cost: 15.75,
    stock: 20,
    minStock: 10,
    sku: 'OFF-PAPEL-A4',
    brand: 'OfficePaper',
    supplier: 'OfficeSupplies S.A.',
    location: 'Almacén D-1',
    lastUpdated: '2025-05-16',
    status: 'active',
    area: 'office',
    tags: ['oficina', 'papel']
  },
  {
    id: '8',
    name: 'Tóner Impresora',
    category: 'Material de Oficina',
    subcategory: 'Tóner',
    description: 'Tóner para impresora láser',
    price: 85.00,
    cost: 60.25,
    stock: 5,
    minStock: 3,
    sku: 'OFF-TONER-HP',
    brand: 'HP',
    supplier: 'OfficeSupplies S.A.',
    location: 'Almacén D-1',
    lastUpdated: '2025-05-15',
    status: 'active',
    area: 'office',
    tags: ['oficina', 'impresora']
  }
];

const TiendaInventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'medications' | 'store' | 'grooming' | 'office'>('medications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);

  // Get the appropriate products based on the active tab
  const getProducts = () => {
    return mockProducts.filter(product => product.area === activeTab);
  };

  // Get unique categories for the current tab
  const categories = Array.from(new Set(getProducts().map(p => p.category)));

  // Filter products based on search, category, status, and stock
  const filteredProducts = getProducts().filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    const matchesStock = 
      selectedStock === 'all' || 
      (selectedStock === 'low' && product.stock <= product.minStock && product.stock > 0) ||
      (selectedStock === 'out' && product.stock === 0) ||
      (selectedStock === 'ok' && product.stock > product.minStock);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  // Calculate inventory stats for the current tab
  const totalItems = getProducts().length;
  const totalValue = getProducts().reduce((sum, product) => sum + (product.cost * product.stock), 0);
  const lowStockItems = getProducts().filter(p => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStockItems = getProducts().filter(p => p.stock === 0).length;

  // Get tab title based on active tab
  const getTabTitle = () => {
    switch (activeTab) {
      case 'medications':
        return 'Inventario de Medicamentos';
      case 'store':
        return 'Inventario de Tienda';
      case 'grooming':
        return 'Inventario de Peluquería';
      case 'office':
        return 'Inventario de Oficina';
      default:
        return 'Inventario';
    }
  };

  // Get tab icon based on active tab
  const getTabIcon = () => {
    switch (activeTab) {
      case 'medications':
        return <Pill size={20} />;
      case 'store':
        return <ShoppingBag size={20} />;
      case 'grooming':
        return <Scissors size={20} />;
      case 'office':
        return <Briefcase size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  // Create a new order for a product
  const handleCreateOrder = (product: Product) => {
    setOrderProduct(product);
    setOrderQuantity(Math.max(product.minStock - product.stock, 1));
    setShowNewOrderForm(true);
  };

  // Submit the order
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderProduct) return;
    
    // Here you would typically make an API call to create a new order
    console.log('Creating order for:', orderProduct.name);
    console.log('Quantity:', orderQuantity);
    console.log('Supplier:', orderProduct.supplier);
    
    // Close the form
    setShowNewOrderForm(false);
    setOrderProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de productos y control de stock
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
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
          >
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('medications')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'medications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <Pill size={16} className="mr-2" />
            Medicamentos
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'store'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <ShoppingBag size={16} className="mr-2" />
            Tienda
          </button>
          <button
            onClick={() => setActiveTab('grooming')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'grooming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <Scissors size={16} className="mr-2" />
            Peluquería
          </button>
          <button
            onClick={() => setActiveTab('office')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'office'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <Briefcase size={16} className="mr-2" />
            Oficina
          </button>
        </nav>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Total Artículos</h3>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{totalItems}</p>
            <p className="mt-1 text-sm text-gray-500">productos en inventario</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Valor Inventario</h3>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {totalValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
            <p className="mt-1 text-sm text-gray-500">valor total del stock</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Stock Bajo</h3>
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-yellow-600">{lowStockItems}</p>
            <p className="mt-1 text-sm text-gray-500">productos por debajo del mínimo</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Sin Stock</h3>
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-red-600">{outOfStockItems}</p>
            <p className="mt-1 text-sm text-gray-500">productos agotados</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder={`Buscar ${activeTab === 'medications' ? 'medicamentos' : activeTab === 'store' ? 'productos' : activeTab === 'grooming' ? 'productos de peluquería' : 'material de oficina'}...`}
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
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
          >
            <option value="all">Todos los stocks</option>
            <option value="ok">Stock OK</option>
            <option value="low">Stock Bajo</option>
            <option value="out">Sin Stock</option>
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Products Table */}
      <Card title={getTabTitle()} icon={getTabIcon()}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                        <Package size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                    <div className="text-xs text-gray-500">{product.subcategory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{product.sku}</div>
                    {product.barcode && (
                      <div className="text-xs text-gray-500">{product.barcode}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </div>
                    <div className="text-xs text-gray-500">
                      Coste: {product.cost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : product.stock <= product.minStock
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} uds
                      </span>
                      {(product.stock <= product.minStock && product.stock > 0) && (
                        <AlertTriangle className="ml-2 h-4 w-4 text-yellow-400" />
                      )}
                      {product.stock === 0 && (
                        <AlertTriangle className="ml-2 h-4 w-4 text-red-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                        onClick={() => handleCreateOrder(product)}
                        className="text-green-600 hover:text-green-800"
                        title="Generar pedido"
                      >
                        <ShoppingCart size={18} />
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
              <Package size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron productos</h3>
            <p className="text-gray-500 mt-1">Prueba con otros términos de búsqueda o cambia los filtros</p>
          </div>
        )}
      </Card>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles del Producto
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
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Información del Producto</h4>
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
                        <p className="text-sm font-medium text-gray-500">Categoría</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Subcategoría</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.subcategory}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Marca</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.brand}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Proveedor</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.supplier}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">SKU</p>
                        <p className="mt-1 text-sm font-mono text-gray-900">{selectedProduct.sku}</p>
                      </div>
                      {selectedProduct.barcode && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Código de Barras</p>
                          <p className="mt-1 text-sm font-mono text-gray-900">{selectedProduct.barcode}</p>
                        </div>
                      )}
                    </div>
                    {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Etiquetas</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedProduct.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inventory Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Información de Inventario</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Precio de Venta</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedProduct.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Coste</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedProduct.cost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Margen</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {((selectedProduct.price - selectedProduct.cost) / selectedProduct.price * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Beneficio</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {(selectedProduct.price - selectedProduct.cost).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Stock Actual</p>
                        <p className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedProduct.stock === 0
                              ? 'bg-red-100 text-red-800'
                              : selectedProduct.stock <= selectedProduct.minStock
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {selectedProduct.stock} unidades
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Stock Mínimo</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.minStock} unidades</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Valor del Stock</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {(selectedProduct.cost * selectedProduct.stock).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ubicación</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedProduct.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Última Actualización</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedProduct.lastUpdated).toLocaleDateString('es-ES')}
                      </p>
                    </div>
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
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <Button
                variant="outline"
                icon={<ShoppingCart size={18} />}
                onClick={() => {
                  setSelectedProduct(null);
                  handleCreateOrder(selectedProduct);
                }}
              >
                Generar Pedido
              </Button>
              <div className="flex space-x-3">
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
        </div>
      )}

      {/* New Order Form Modal */}
      {showNewOrderForm && orderProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Generar Pedido
              </h3>
              <button
                onClick={() => {
                  setShowNewOrderForm(false);
                  setOrderProduct(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder}>
              <div className="p-6">
                <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Información del Producto</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-700">Producto</p>
                      <p className="text-sm font-medium text-blue-900">{orderProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">Proveedor</p>
                      <p className="text-sm font-medium text-blue-900">{orderProduct.supplier}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">Stock Actual</p>
                      <p className="text-sm font-medium text-blue-900">{orderProduct.stock} unidades</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">Stock Mínimo</p>
                      <p className="text-sm font-medium text-blue-900">{orderProduct.minStock} unidades</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad a Pedir
                    </label>
                    <Input
                      type="number"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                      min="1"
                      required
                    />
                    {orderProduct.stock < orderProduct.minStock && (
                      <p className="mt-1 text-xs text-yellow-600">
                        Se recomienda pedir al menos {orderProduct.minStock - orderProduct.stock} unidades para alcanzar el stock mínimo.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Entrega Estimada
                    </label>
                    <Input
                      type="date"
                      defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas Adicionales
                    </label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Añade notas o instrucciones especiales..."
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Coste Estimado:</p>
                      <p className="text-lg font-bold text-gray-900">
                        {(orderProduct.cost * orderQuantity).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">IVA (21%):</p>
                      <p className="text-sm text-gray-900">
                        {(orderProduct.cost * orderQuantity * 0.21).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Total:</p>
                      <p className="text-lg font-bold text-gray-900">
                        {(orderProduct.cost * orderQuantity * 1.21).toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewOrderForm(false);
                    setOrderProduct(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<ShoppingCart size={18} />}
                >
                  Crear Pedido
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiendaInventory;