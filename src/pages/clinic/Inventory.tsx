
import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, AlertTriangle, Package, RefreshCw } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Convex queries
  const products = useQuery(api.products.getProducts) || [];
  const services = useQuery(api.services.getServices) || [];
  const medicines = useQuery(api.medicines.getMedicines) || [];
  const providers = useQuery(api.providers.getProviders) || [];

  // Combine all items with consistent structure
  const allItems = useMemo(() => {
    const combinedItems = [
      ...products.map(item => ({
        id: item._id,
        name: item.name,
        category: item.category,
        stock: item.currentStock,
        minStock: item.minStock,
        provider: item.provider?.name || 'Sin proveedor',
        lastUpdated: new Date(item.updatedAt).toISOString().split('T')[0],
        status: item.currentStock === 0 ? 'out' : item.currentStock <= item.minStock ? 'low' : 'ok',
        itemType: 'product' as const
      })),
      ...services.map(item => ({
        id: item._id,
        name: item.name,
        category: item.category,
        stock: item.currentStock,
        minStock: item.minStock,
        provider: item.provider?.name || 'Sin proveedor',
        lastUpdated: new Date(item.updatedAt).toISOString().split('T')[0],
        status: item.currentStock === 0 ? 'out' : item.currentStock <= item.minStock ? 'low' : 'ok',
        itemType: 'service' as const
      })),
      ...medicines.map(item => ({
        id: item._id,
        name: item.name,
        category: item.type, // medicines use 'type' field instead of 'category'
        stock: item.stock,
        minStock: item.minStock,
        provider: providers.find(p => p._id === item.providerId)?.name || 'Sin proveedor',
        lastUpdated: new Date(item.updatedAt).toISOString().split('T')[0],
        status: item.stock === 0 ? 'out' : item.stock <= item.minStock ? 'low' : 'ok',
        itemType: 'medicine' as const
      }))
    ];
    return combinedItems;
  }, [products, services, medicines, providers]);

  // Calculate statistics
  const totalStock = allItems.reduce((sum, item) => sum + item.stock, 0);
  const lowStockItems = allItems.filter(item => item.status === 'low' || item.status === 'out').length;

  // Filter items based on search term, category, and status
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.provider.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             (selectedCategory === 'products' && item.itemType === 'product') ||
                             (selectedCategory === 'services' && item.itemType === 'service') ||
                             (selectedCategory === 'medicines' && item.itemType === 'medicine');
      
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allItems, searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="mt-1 text-sm text-gray-500">
            Control de stock y materiales
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Stock Total</h3>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{totalStock.toLocaleString()}</p>
            <p className="mt-1 text-sm text-gray-500">unidades en inventario</p>
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
            <option value="products">Productos</option>
            <option value="services">Servicios</option>
            <option value="medicines">Medicamentos</option>
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="ok">Stock OK</option>
            <option value="low">Stock Bajo</option>
            <option value="out">Sin Stock</option>
          </select>
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
          >
            Limpiar
          </Button>
        </div>
      </Card>

      {/* Inventory Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Actualización
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron elementos
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={`${item.itemType}-${item.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.itemType === 'product' ? 'bg-blue-100 text-blue-800' :
                        item.itemType === 'service' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.itemType === 'product' ? 'Producto' :
                         item.itemType === 'service' ? 'Servicio' : 'Medicamento'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'ok' ? 'bg-green-100 text-green-800' :
                          item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.stock} uds
                        </span>
                        {item.status !== 'ok' && (
                          <AlertTriangle className="ml-2 h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Mín: {item.minStock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.provider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm">
                        Gestionar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
