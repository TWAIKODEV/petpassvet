import React, { useState } from 'react';
import { 
  Calendar, 
  Activity,
  BarChart2,
  FileText,
  ArrowRight,
  ShoppingBag,
  Package,
  Heart,
  Droplet,
  Shield,
  DollarSign,
  TrendingUp,
  Search,
  RefreshCw,
  Plus,
  ShoppingCart
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import StatCard from '../../components/dashboard/StatCard';

const TiendaDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    // Here you would typically fetch new data with the selected date range
    console.log('Fetching data for range:', dateRange);
  };

  // Product families
  const productFamilies = [
    {
      title: 'PetPass',
      icon: <Heart size={20} />,
      color: 'text-blue-600 bg-blue-100',
      href: '/tienda/petpass'
    },
    {
      title: 'Comida',
      icon: <ShoppingBag size={20} />,
      color: 'text-green-600 bg-green-100',
      href: '/tienda/comida'
    },
    {
      title: 'Accesorios',
      icon: <Package size={20} />,
      color: 'text-purple-600 bg-purple-100',
      href: '/tienda/accesorios'
    },
    {
      title: 'Salud & Higiene',
      icon: <Droplet size={20} />,
      color: 'text-teal-600 bg-teal-100',
      href: '/tienda/salud-higiene'
    },
    {
      title: 'Seguros',
      icon: <Shield size={20} />,
      color: 'text-orange-600 bg-orange-100',
      href: '/tienda/seguros'
    }
  ];

  // Mock data for inventory stats
  const inventoryStats = {
    totalItems: 1245,
    stockValue: 87500,
    lowStockItems: 32,
    outOfStockItems: 8
  };

  // Mock data for sales by category
  const salesByCategory = [
    { category: 'Comida', amount: 45600, percentage: 36 },
    { category: 'Accesorios', amount: 35200, percentage: 28 },
    { category: 'Salud & Higiene', amount: 25300, percentage: 20 },
    { category: 'PetPass', amount: 12500, percentage: 10 },
    { category: 'Seguros', amount: 7400, percentage: 6 }
  ];

  // Mock data for top selling products
  const topSellingProducts = [
    { 
      id: '1',
      name: 'Royal Canin Medium Adult 15kg',
      category: 'Comida',
      price: 65.99,
      sales: 124,
      revenue: 8182.76
    },
    { 
      id: '2',
      name: 'Cama Ortopédica Grande',
      category: 'Accesorios',
      price: 89.95,
      sales: 78,
      revenue: 7016.10
    },
    { 
      id: '3',
      name: 'PetPass Premium (Anual)',
      category: 'PetPass',
      price: 240.00,
      sales: 45,
      revenue: 10800.00
    },
    { 
      id: '4',
      name: 'Champú Dermatológico 500ml',
      category: 'Salud & Higiene',
      price: 18.50,
      sales: 156,
      revenue: 2886.00
    },
    { 
      id: '5',
      name: 'Seguro Básico (Anual)',
      category: 'Seguros',
      price: 120.00,
      sales: 38,
      revenue: 4560.00
    }
  ];

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-2">
          <Input
            type="date"
            value={dateRange.from}
            onChange={(e) => handleDateChange('from', e.target.value)}
            label="Desde"
          />
          <Input
            type="date"
            value={dateRange.to}
            onChange={(e) => handleDateChange('to', e.target.value)}
            label="Hasta"
          />
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
            onClick={handleRefresh}
            className="self-end"
          >
            Actualizar
          </Button>
        </div>
      </Card>

      <Card title="Familias de Productos" icon={<BarChart2 size={20} />}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-2">
          {productFamilies.map((family, index) => (
            <a
              key={index}
              href={family.href}
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
            >
              <div className={`p-2 rounded-lg ${family.color} transition-colors`}>
                {family.icon}
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900 group-hover:text-gray-700">
                {family.title}
              </span>
              <ArrowRight size={16} className="ml-auto text-gray-400 group-hover:text-gray-600" />
            </a>
          ))}
        </div>
      </Card>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total de Artículos"
          value={inventoryStats.totalItems.toString()}
          icon={<Package size={24} />}
        />
        <StatCard
          title="Valor del Inventario"
          value={inventoryStats.stockValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          icon={<DollarSign size={24} />}
        />
        <StatCard
          title="Stock Bajo"
          value={inventoryStats.lowStockItems.toString()}
          icon={<Activity size={24} />}
        />
        <StatCard
          title="Sin Stock"
          value={inventoryStats.outOfStockItems.toString()}
          icon={<ShoppingCart size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <Card title="Ventas por Categoría" icon={<BarChart2 size={20} />}>
          <div className="p-4 space-y-4">
            {salesByCategory.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm">
                  <span>{category.category}</span>
                  <span className="font-medium">
                    {category.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} ({category.percentage}%)
                  </span>
                </div>
                <div className="mt-1 h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-green-600' :
                      index === 1 ? 'bg-blue-600' :
                      index === 2 ? 'bg-purple-600' :
                      index === 3 ? 'bg-teal-600' :
                      'bg-orange-600'
                    }`} 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Selling Products */}
        <Card title="Productos Más Vendidos" icon={<TrendingUp size={20} />}>
          <div className="p-4">
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category} • {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.sales} uds.</p>
                    <p className="text-xs text-gray-500">
                      {product.revenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Ver todos los productos →
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TiendaDashboard;