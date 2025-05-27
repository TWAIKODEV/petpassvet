import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, RefreshCw, FileText, Eye } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import PetHistoryModal from '../../components/dashboard/PetHistoryModal';
import * as XLSX from 'xlsx';

// Mock data for medical history
const mockHistory = [
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
    recordCount: 12,
    petPass: true,
    healthPlan: 'Premium',
    insurance: {
      provider: 'PetSure',
      number: 'PS-123456'
    }
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
      breed: 'Pastor Alemán',
      age: 5,
      sex: 'male',
      microchip: '941000024681246'
    },
    recordCount: 8,
    petPass: false,
    healthPlan: null,
    insurance: {
      provider: 'VetProtect',
      number: 'VP-789012'
    }
  }
];

const MedicalHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState<any>(null);

  // Filter records based on search term (owner name, pet name, phone or microchip)
  const filteredHistory = mockHistory.filter(record => 
    record.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.owner.phone.includes(searchTerm) ||
    record.pet.microchip.includes(searchTerm)
  );

  const handleExportExcel = () => {
    const excelData = mockHistory.map(record => ({
      'Fecha Alta': new Date(record.date).toLocaleDateString('es-ES'),
      'Propietario': record.owner.name,
      'Teléfono': record.owner.phone,
      'Mascota': record.pet.name,
      'Edad': `${record.pet.age} años`,
      'Sexo': record.pet.sex === 'male' ? 'Macho' : 'Hembra',
      'Microchip': record.pet.microchip,
      'Especie': record.pet.species,
      'Raza': record.pet.breed,
      'Nº': record.recordCount,
      'PetPass': record.petPass ? 'Sí' : 'No',
      'Plan de Salud': record.healthPlan || '-',
      'Seguro': record.insurance.provider,
      'Nº Póliza': record.insurance.number
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Historial');
    XLSX.writeFile(wb, 'historial-medico.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial Médico</h1>
          <p className="mt-1 text-sm text-gray-500">
            Consulta el historial médico de los pacientes
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
                  <th scope="col" className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PetPass
                  </th>
                  <th scope="col" className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th scope="col" className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seguro
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.petPass 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {record.petPass ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {record.healthPlan ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {record.healthPlan}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.insurance.provider}</div>
                      <div className="text-sm text-gray-500">{record.insurance.number}</div>
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
                            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            doctor: 'Dr. Alejandro Ramírez',
                            area: 'Veterinaria',
                            service: 'Consulta General',
                            amount: 75.00
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

export default MedicalHistory;