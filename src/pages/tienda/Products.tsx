import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Package, RefreshCw, Edit, Trash, Tag, Eye, X, DollarSign, ShoppingBag, Heart, Droplet, Shield } from 'lucide-react';
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
  discountPrice?: number;
  featured: boolean;
  rating: number;
  reviews: number;
  images: string[];
  status: 'active' | 'inactive';
  tags?: string[];
}

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Royal Canin Medium Adult 15kg',
    category: 'Comida',
    subcategory: 'Pienso Seco',
    description: 'Alimento completo para perros adultos de razas medianas (de 11 a 25 kg) - A partir de 12 meses hasta 7 años',
    price: 65.99,
    featured: true,
    rating: 4.8,
    reviews: 124,
    images: ['https://images.pexels.com/photos/6568501/pexels-photo-6568501.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    status: 'active',
    tags: ['perro', 'adulto', 'raza mediana']
  },
  {
    id: '2',
    name: 'Cama Ortopédica Grande',
    category: 'Accesorios',
    subcategory: 'Camas',
    description: 'Cama ortopédica con espuma viscoelástica para perros grandes. Funda lavable.',
    price: 89.95,
    discountPrice: 79.95,
    featured: true,
    rating: 4.7,
    reviews: 78,
    images: ['https://images.pexels.com/photos/6568478/pexels-photo-6568478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    status: 'active',
    tags: ['perro', 'gato', 'ortopédico', 'grande']
  },
  {
    id: '3',
    name: 'Champú Dermatológico 500ml',
    category: 'Salud & Higiene',
    subcategory: 'Champús',
    description: 'Champú dermatológico para perros con piel sensible o con problemas dermatológicos.',
    price: 18.50,
    featured: false,
    rating: 4.5,
    reviews: 56,
    images: ['https://images.pexels.com/photos/6568663/pexels-photo-6568663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    status: 'active',
    tags: ['perro', 'gato', 'dermatológico', 'piel sensible']
  },
  {
    id: '4',
    name: 'PetPass Premium (Anual)',
    category: 'PetPass',
    subcategory: 'Suscripciones',
    description: 'Plan de suscripción anual que incluye consultas ilimitadas, vacunación anual y descuentos en servicios.',
    price: 240.00,
    featured: true,
    rating: 4.9,
    reviews: 45,
    images: ['https://images.pexels.com/photos/6568536/pexels-photo-6568536.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    status: 'active',
    tags: ['suscripción', 'premium', 'anual']
  },
  {
    id: '5',
    name: 'Seguro Básico (Anual)',
    category: 'Seguros',
    subcategory: 'Seguros Básicos',
    description: 'Seguro básico anual que cubre consultas, vacunas y tratamientos básicos.',
    price: 120.00,
    featured: false,
    rating: 4.3,
    reviews: 38,
    images: ['https://images.pexels.com/photos/6568556/pexels-photo-6568556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    status: 'active',
    tags: ['seguro', 'básico', 'anual']
  },
  {
    id: '6',
    name: 'Collar Antiparasitario Perros',
    category: 'Salud & Higiene',
    subcategory: 'Antiparasitarios',
    description: 'Collar antiparasitario para perros. Protección contra pulgas y garrapatas durante 6 meses.',
    price: 25.99,
    discountPrice: 22.99,
    featured: false,
    rating: 4.6,
    reviews: 92,
    images: ['https://images.pexels.com/photos/6568615/pexels-photo-6568615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    status: 'active',
    tags: ['perro', 'antiparasitario', 'collar']
  },
  {
    id: '7',
    name: 'Transportín Plegable Mediano',
    category: 'Accesorios',
    subcategory: 'Transporte',
    description: 'Transportín plegable para mascotas de tamaño mediano. Fácil de guardar y transportar.',
    price: 45.50,
    featured: false,
    rating: 4.4,
    reviews: 67,
    images: ['https://images.pexels.com/photos/6568682/pexels-photo-6568682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    status: 'active',
    tags: ['perro', 'gato', 'transporte', 'mediano']
  },
  {
    id: '8',
    name: 'Juguete Interactivo Dispensador',
    category: 'Accesorios',
    subcategory: 'Juguetes',
    description: 'Juguete interactivo dispensador de premios. Estimula la mente de tu mascota.',
    price: 15.99,
    featured: true,
    rating: 4.7,
    reviews: 103,
    images: ['https://images.pexels.com/photos/6568581/pexels-photo-6568581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    status: 'active',
    tags: ['perro', 'gato', 'juguete', 'interactivo']
  }
];

const categoryIcons = {
  'Comida': <ShoppingBag size={20} className="text-green-600" />,
  'Accesorios': <Package size={20} className="text-purple-600" />,
  'Salud & Higiene': <Droplet size={20} className="text-teal-600" />,
  'PetPass': <Heart size={20} className="text-blue-600" />,
  'Seguros': <Shield size={20} className="text-orange-600" />
};

const TiendaProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFeatured, setSelectedFeatured] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories
  const categories = Array.from(new Set(mockProducts.map(p => p.category)));

  // Filter products based on search, category, and featured status
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesFeatured = 
      selectedFeatured === 'all' || 
      (selectedFeatured === 'featured' && product.featured) ||
      (selectedFeatured === 'regular' && !product.featured);
    
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de productos y servicios de la tienda
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
          >
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder="Buscar productos..."
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
            value={selectedFeatured}
            onChange={(e) => setSelectedFeatured(e.target.value)}
          >
            <option value="all">Todos los productos</option>
            <option value="featured">Destacados</option>
            <option value="regular">Regulares</option>
          </select>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <div className="relative">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {product.featured && (
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Destacado
                  </span>
                )}
                {product.discountPrice && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Oferta
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                  {categoryIcons[product.category]}
                  <span className="ml-1 text-xs text-gray-500">{product.category}</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.description}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    {product.discountPrice ? (
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-900">
                          {product.discountPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                    <span className="ml-1 text-xs text-gray-500">({product.reviews})</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Eye size={16} />}
                    onClick={() => setSelectedProduct(product)}
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<Edit size={16} />}
                  >
                    Editar
                  </Button>
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
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valoración
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded">
                          <img className="h-10 w-10 rounded object-cover" src={product.images[0]} alt={product.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {categoryIcons[product.category]}
                        <div className="ml-1">
                          <div className="text-sm text-gray-900">{product.category}</div>
                          <div className="text-xs text-gray-500">{product.subcategory}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.discountPrice ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.discountPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          </div>
                          <div className="text-xs text-gray-500 line-through">
                            {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="ml-1 text-sm text-gray-900">{product.rating}</span>
                        <span className="ml-1 text-xs text-gray-500">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                        {product.featured && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Destacado
                          </span>
                        )}
                      </div>
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
        </div>
      )}

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
                {/* Product Image */}
                <div>
                  <img 
                    src={selectedProduct.images[0]} 
                    alt={selectedProduct.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {selectedProduct.images.length > 1 && (
                    <div className="mt-2 flex space-x-2 overflow-x-auto">
                      {selectedProduct.images.map((image, index) => (
                        <img 
                          key={index}
                          src={image} 
                          alt={`${selectedProduct.name} - ${index + 1}`} 
                          className="h-16 w-16 object-cover rounded cursor-pointer"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Information */}
                <div>
                  <div className="flex items-center mb-2">
                    {categoryIcons[selectedProduct.category]}
                    <span className="ml-1 text-sm text-gray-500">{selectedProduct.category} • {selectedProduct.subcategory}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="ml-1 text-sm font-medium text-gray-900">{selectedProduct.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({selectedProduct.reviews} reseñas)</span>
                    </div>
                    {selectedProduct.featured && (
                      <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Destacado
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">{selectedProduct.description}</p>
                  </div>
                  
                  <div className="mb-4">
                    {selectedProduct.discountPrice ? (
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-900">
                          {selectedProduct.discountPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </span>
                        <span className="ml-2 text-lg text-gray-500 line-through">
                          {selectedProduct.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </span>
                        <span className="ml-2 text-sm text-green-600">
                          {Math.round((1 - selectedProduct.discountPrice / selectedProduct.price) * 100)}% descuento
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">
                        {selectedProduct.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </span>
                    )}
                  </div>
                  
                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Etiquetas:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Estado:</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedProduct.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedProduct.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
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
    </div>
  );
};

export default TiendaProducts;