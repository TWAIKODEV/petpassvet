import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, PhoneCall, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface AppointmentListProps {
  showViewAll?: boolean;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ showViewAll = true }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const appointments = useQuery(api.appointments.getAppointments) || [];

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedStatus === 'all') return true;
    return appointment.status === selectedStatus;
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    waiting: 'bg-orange-100 text-orange-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    no_show: 'bg-red-100 text-red-800',
    scheduled: 'bg-gray-100 text-gray-800'
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      waiting: 'En espera',
      in_progress: 'En proceso',
      completed: 'Completada',
      no_show: 'No asistió',
      scheduled: 'Programada'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Próximas Citas</h3>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="waiting">En espera</option>
            <option value="in_progress">En proceso</option>
          </select>
          {showViewAll && (
            <Button variant="ghost" size="sm">
              Ver todas
              <ArrowRight size={16} className="ml-1" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay citas programadas</p>
        ) : (
          filteredAppointments.slice(0, showViewAll ? 5 : undefined).map((appointment) => (
            <div key={appointment._id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{appointment.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-gray-400" />
                    <span className="font-medium">{appointment.petName}</span>
                    <span className="text-gray-500">({appointment.breed})</span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    Tipo: {appointment.consultationKind} • Duración: {appointment.duration} min
                  </div>

                  {appointment.notes && (
                    <div className="text-sm text-gray-500 italic">
                      {appointment.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status as keyof typeof statusColors]}`}>
                    {getStatusLabel(appointment.status)}
                  </span>

                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <MessageSquare size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <PhoneCall size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default AppointmentList;