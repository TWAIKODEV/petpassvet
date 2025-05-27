import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, RefreshCw, FileText, Eye, Scissors } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import PetHistoryModal from '../../components/dashboard/PetHistoryModal';
import * as XLSX from 'xlsx';

// Mock data for grooming history
const mockGroomingHistory = [
  {
    id: '1',
    date: '2025-05-21',
    owner: {
      name: 'María García',
      email: 'maria.garcia@example.com',
      phone: '666777888'
    },
    pet: {
      name: 'Luna',
      species: 'Perro',
      breed: 'Labrador',
      age: 3,
      sex: 'female',
      microchip: '941000024680135'
    },
    recordCount: 8,
    lastService: 'Corte Completo',
    nextAppointment: '2025-06-21'
  },
  {
    id: '2',
    date: '2025-05-20',
    owner: {
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      phone: '666888999'
    },
    pet: {
      name: 'Rocky',
      species: 'Perro',
      breed: 'Yorkshire Terrier',
      age: 5,
      sex: 'male',
      microchip: '941000024681246'
    },
    recordCount: 12,
    lastService: 'Baño y Cepillado',
    nextAppointment: '2025-06-10'
  },
  {
    id: '3',
    date: '2025-05-19',
    owner: {
      name: 'Ana Martínez',
      email: 'ana.martinez@example.com',
      phone: '666999000'
    },
    pet: {
      name: 'Milo',
      species: 'Gato',
      breed: 'Persa',
      age: 2,
      sex: 'male',
      microchip: '941000024682357'
    },
    recordCount: 4,
    lastService: 'Corte de Uñas',
    nextAppointment: '2025-06-15'
  }
];

const GroomingHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState<any>(null);

  // Filter records based on search term (owner name, pet name, phone or microchip)
  const filteredHistory = mockGroomingHistory.filter(record => 
    record.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.owner.phone.includes(searchTerm) ||
    record.pet.microchip.includes(searchTerm)
  );

  const handleExportExcel = () => {
    const excelData = mockGroomingHistory.map(record => ({
      'Fecha Último Servicio': new Date(record.date).toLocaleDateString('es-ES'),
      'Propietario': record.owner.name,
      'Teléfono': record.owner.phone,
      'Mascota': record.pet.name,
      'Edad': `${record.pet.age} años`,
      'Sexo': record.pet.sex === 'male' ? 'Macho' : 'Hembra',
      'Microchip': record.pet.microchip,
      'Especie': record.pet.species,
      'Raza': record.pet.breed,
      'Nº Servicios': record.recordCount,
      'Último Servicio': record.lastService,
      'Próxima Cita': record.nextAppointment ? new Date(record.nextAppointment).toLocaleDateString('es-ES') : '-'
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Historial Peluquería');
    XLSX.writeFile(wb, 'historial-peluqueria.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Peluquería</h1>
          <p className="mt-1 text-sm text-gray-500">
            Consulta el historial de servicios de peluquería
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            icon={<Download size={18} />}
            onClick={handleExportExcel}
            className="flex-1 sm:flex-none"
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <div className="p-4">
          <Input
            placeholder="Buscar por nombre de mascota, propietario, teléfono o microchip..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="w-full"
          />
        </div>
      </Card>

      {/* History Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-max">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propietario
                  </th>
                  <th scope="col" className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mascota
                  </th>
                  <th scope="col" className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Edad
                  </th>
                  <th scope="col" className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sexo
                  </th>
                  <th scope="col" className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Microchip
                  </th>
                  <th scope="col" className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nº
                  </th>
                  <th scope="col" className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Servicio
                  </th>
                  <th scope="col" className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Cita
                  </th>
                  <th scope="col" className="w-24 relative px-3 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.owner.name}</div>
                      <div className="text-sm text-gray-500">{record.owner.phone}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.pet.name}</div>
                      <div className="text-sm text-gray-500">
                        {record.pet.species} {record.pet.breed}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.pet.age} años</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.pet.sex === 'male' ? 'Macho' : 'Hembra'}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{record.pet.microchip}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.recordCount}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {record.lastService}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.nextAppointment ? new Date(record.nextAppointment).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit'
                        }) : '-'}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye size={16} />}
                        onClick={() => setSelectedPet({
                          id: record.id,
                          name: record.pet.name,
                          species: record.pet.species,
                          breed: record.pet.breed,
                          sex: record.pet.sex,
                          birthDate: new Date(Date.now() - record.pet.age * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                          owner: {
                            name: record.owner.name,
                            phone: record.owner.phone,
                            email: record.owner.email
                          },
                          visits: Array(record.recordCount).fill(null).map((_, i) => ({
                            date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            doctor: 'Ana López',
                            area: 'Peluquería',
                            service: i % 3 === 0 ? 'Corte Completo' : i % 3 === 1 ? 'Baño y Cepillado' : 'Corte de Uñas',
                            amount: i % 3 === 0 ? 45.00 : i % 3 === 1 ? 30.00 : 15.00
                          }))
                        })}
                      >
                        Ver Historial
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pet History Modal */}
      {selectedPet && (
        <PetHistoryModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </div>
  );
};

export default GroomingHistory;