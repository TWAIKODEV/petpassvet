import { 
  Appointment, 
  Patient, 
  Doctor, 
  Payment, 
  DashboardSummary,
  User
} from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'María García',
    email: 'maria.garcia@example.com',
    phone: '555-123-4567',
    birthDate: '1985-04-12',
    gender: 'female',
    address: 'Calle Principal 123, Ciudad',
    preferredContact: 'whatsapp',
    pet: {
      name: 'Luna',
      species: 'Dog',
      breed: 'Labrador',
      sex: 'female',
      birthDate: '2020-06-15',
      isNeutered: true,
      microchipNumber: 'CHIP123456',
      vaccines: [],
      healthPlans: [],
      accidents: [],
      surgeries: [],
      otherTests: []
    },
    marketing: {
      acceptsDataProtection: true,
      acceptsEmailMarketing: true,
      acceptsWhatsAppComm: true
    },
    petPass: {
      hasPetPass: false
    },
    services: {
      wantsGrooming: false,
      wantsFoodDelivery: false,
      wantsHotelService: false,
      wantsTraining: false
    },
    insuranceProvider: 'Seguros Médicos SA',
    insuranceNumber: 'SM-123456789',
    medicalHistory: ['Asma leve', 'Alergia al polen']
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@example.com',
    phone: '555-234-5678',
    birthDate: '1976-09-23',
    gender: 'male',
    address: 'Avenida Central 456, Ciudad',
    preferredContact: 'phone',
    pet: {
      name: 'Rocky',
      species: 'Dog',
      breed: 'German Shepherd',
      sex: 'male',
      birthDate: '2018-03-10',
      isNeutered: false,
      microchipNumber: 'CHIP789012',
      vaccines: [],
      healthPlans: [],
      accidents: [],
      surgeries: [],
      otherTests: []
    },
    marketing: {
      acceptsDataProtection: true,
      acceptsEmailMarketing: false,
      acceptsWhatsAppComm: true
    },
    petPass: {
      hasPetPass: false
    },
    services: {
      wantsGrooming: true,
      wantsFoodDelivery: false,
      wantsHotelService: true,
      wantsTraining: false
    },
    insuranceProvider: 'Seguros Nacionales',
    insuranceNumber: 'SN-987654321',
    medicalHistory: ['Hipertensión', 'Colesterol alto']
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    phone: '555-345-6789',
    birthDate: '1992-11-07',
    gender: 'female',
    address: 'Plaza Mayor 789, Ciudad',
    preferredContact: 'email',
    pet: {
      name: 'Milo',
      species: 'Cat',
      breed: 'Persian',
      sex: 'male',
      birthDate: '2021-01-20',
      isNeutered: true,
      microchipNumber: 'CHIP345678',
      vaccines: [],
      healthPlans: [],
      accidents: [],
      surgeries: [],
      otherTests: []
    },
    marketing: {
      acceptsDataProtection: true,
      acceptsEmailMarketing: true,
      acceptsWhatsAppComm: false
    },
    petPass: {
      hasPetPass: true
    },
    services: {
      wantsGrooming: true,
      wantsFoodDelivery: true,
      wantsHotelService: false,
      wantsTraining: false
    },
    insuranceProvider: 'Cobertura Total',
    insuranceNumber: 'CT-456789123',
    medicalHistory: ['Migraña']
  },
  {
    id: '4',
    name: 'Javier López',
    email: 'javier.lopez@example.com',
    phone: '555-456-7890',
    birthDate: '1968-03-15',
    gender: 'male',
    address: 'Calle Secundaria 321, Ciudad',
    preferredContact: 'sms',
    pet: {
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      sex: 'male',
      birthDate: '2019-08-05',
      isNeutered: true,
      microchipNumber: 'CHIP901234',
      vaccines: [],
      healthPlans: [],
      accidents: [],
      surgeries: [],
      otherTests: []
    },
    marketing: {
      acceptsDataProtection: true,
      acceptsEmailMarketing: false,
      acceptsWhatsAppComm: false
    },
    petPass: {
      hasPetPass: true
    },
    services: {
      wantsGrooming: false,
      wantsFoodDelivery: true,
      wantsHotelService: false,
      wantsTraining: true
    },
    insuranceProvider: 'Seguros Médicos SA',
    insuranceNumber: 'SM-789123456',
    medicalHistory: ['Diabetes tipo 2', 'Artritis']
  },
  {
    id: '5',
    name: 'Sofía Hernández',
    email: 'sofia.hernandez@example.com',
    phone: '555-567-8901',
    birthDate: '1998-06-30',
    gender: 'female',
    address: 'Avenida Norte 654, Ciudad',
    preferredContact: 'whatsapp',
    pet: {
      name: 'Bella',
      species: 'Cat',
      breed: 'Siamese',
      sex: 'female',
      birthDate: '2022-02-15',
      isNeutered: false,
      microchipNumber: 'CHIP567890',
      vaccines: [],
      healthPlans: [],
      accidents: [],
      surgeries: [],
      otherTests: []
    },
    marketing: {
      acceptsDataProtection: true,
      acceptsEmailMarketing: true,
      acceptsWhatsAppComm: true
    },
    petPass: {
      hasPetPass: false
    },
    services: {
      wantsGrooming: true,
      wantsFoodDelivery: false,
      wantsHotelService: false,
      wantsTraining: false
    },
    insuranceNumber: 'CT-321654987',
    medicalHistory: []
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Alejandro Ramírez',
    specialization: 'Medicina General',
    email: 'alejandro.ramirez@clinica.com',
    phone: '555-987-6543',
    schedule: {
      'monday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'tuesday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'wednesday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'thursday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
      'friday': { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] }
    }
  },
  {
    id: '2',
    name: 'Dra. Laura Gómez',
    specialization: 'Pediatría',
    email: 'laura.gomez@clinica.com',
    phone: '555-876-5432',
    schedule: {
      'monday': { start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
      'tuesday': { start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
      'wednesday': { start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
      'thursday': { start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
      'friday': { start: '10:00', end: '16:00', breaks: [{ start: '14:00', end: '15:00' }] }
    }
  },
  {
    id: '3',
    name: 'Dr. Miguel Torres',
    specialization: 'Dermatología',
    email: 'miguel.torres@clinica.com',
    phone: '555-765-4321',
    schedule: {
      'monday': { start: '11:00', end: '19:00', breaks: [{ start: '15:00', end: '16:00' }] },
      'wednesday': { start: '11:00', end: '19:00', breaks: [{ start: '15:00', end: '16:00' }] },
      'friday': { start: '11:00', end: '19:00', breaks: [{ start: '15:00', end: '16:00' }] }
    }
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    petName: 'Luna',
    breed: 'Labrador',
    age: 3,
    sex: 'female',
    petProfileUrl: '/patients/1',
    consultationKind: 'annualReview',
    consultationType: 'normal',
    serviceType: 'veterinary',
    patientId: '1',
    doctorId: '1',
    date: '2025-06-15',
    time: '10:00',
    duration: 30,
    status: 'confirmed',
    notes: 'Revisión anual'
  },
  {
    id: '2',
    petName: 'Rocky',
    breed: 'German Shepherd',
    age: 5,
    sex: 'male',
    petProfileUrl: '/patients/2',
    consultationKind: 'followUp',
    consultationType: 'insurance',
    serviceType: 'veterinary',
    patientId: '2',
    doctorId: '1',
    date: '2025-06-15',
    time: '11:00',
    duration: 30,
    status: 'confirmed',
    notes: 'Seguimiento de medicación'
  },
  {
    id: '3',
    petName: 'Milo',
    breed: 'Persian',
    age: 2,
    sex: 'male',
    petProfileUrl: '/patients/3',
    consultationKind: 'firstVisit',
    consultationType: 'normal',
    serviceType: 'veterinary',
    patientId: '3',
    doctorId: '2',
    date: '2025-06-15',
    time: '12:00',
    duration: 45,
    status: 'scheduled',
    notes: 'Primera visita'
  },
  {
    id: '4',
    petName: 'Max',
    breed: 'Golden Retriever',
    age: 4,
    sex: 'male',
    petProfileUrl: '/patients/4',
    consultationKind: 'procedure',
    consultationType: 'normal',
    serviceType: 'veterinary',
    patientId: '4',
    doctorId: '3',
    date: '2025-06-16',
    time: '14:30',
    duration: 60,
    status: 'scheduled',
    notes: 'Revisión de lesión cutánea'
  },
  {
    id: '5',
    petName: 'Bella',
    breed: 'Siamese',
    age: 1,
    sex: 'female',
    petProfileUrl: '/patients/5',
    consultationKind: 'checkUp',
    consultationType: 'normal',
    serviceType: 'veterinary',
    patientId: '5',
    doctorId: '2',
    date: '2025-06-16',
    time: '16:00',
    duration: 30,
    status: 'scheduled',
    notes: 'Control rutinario'
  },
  {
    id: '6',
    petName: 'Luna',
    breed: 'Labrador',
    age: 3,
    sex: 'female',
    petProfileUrl: '/patients/1',
    consultationKind: 'followUp',
    consultationType: 'normal',
    serviceType: 'veterinary',
    patientId: '1',
    doctorId: '1',
    date: '2025-06-17',
    time: '09:30',
    duration: 30,
    status: 'scheduled',
    notes: 'Resultados de análisis'
  }
];

const mockPayments: Payment[] = [
  {
    id: '1',
    appointmentId: '1',
    patientId: '1',
    amount: 120.00,
    date: '2025-06-15',
    method: 'insurance',
    status: 'completed',
    insuranceClaim: {
      provider: 'Seguros Médicos SA',
      claimNumber: 'CL-123456',
      status: 'approved',
      approvedAmount: 100.00
    }
  },
  {
    id: '2',
    appointmentId: '2',
    patientId: '2',
    amount: 85.00,
    date: '2025-06-15',
    method: 'credit',
    status: 'completed'
  },
  {
    id: '3',
    appointmentId: '3',
    patientId: '3',
    amount: 150.00,
    date: '2025-06-15',
    method: 'cash',
    status: 'pending'
  }
];

export const mockDashboardSummary: DashboardSummary = {
  appointmentsToday: 3,
  appointmentsWeek: 12,
  patientsTotal: 125,
  revenueToday: 355.00,
  revenueWeek: 1750.00,
  revenueMonth: 7825.00
};

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@clinica.com',
    phone: '+34 666 000 000',
    role: {
      id: 'admin',
      name: 'admin',
      displayName: 'Administrador',
      permissions: [],
      isEditable: false
    },
    department: 'Dirección',
    position: 'Administrador del Sistema',
    status: 'active',
    lastLogin: '2025-05-21T12:00:00'
  },
  {
    id: '2',
    name: 'Dr. Alejandro Ramírez',
    email: 'alejandro.ramirez@clinica.com',
    phone: '+34 666 111 111',
    role: {
      id: 'veterinarian',
      name: 'veterinarian',
      displayName: 'Veterinario',
      permissions: [],
      isEditable: true
    },
    department: 'Veterinaria',
    position: 'Veterinario Senior',
    status: 'active',
    lastLogin: '2025-05-21T11:30:00'
  },
  {
    id: '3',
    name: 'Lucía Sánchez',
    email: 'lucia.sanchez@clinica.com',
    phone: '+34 666 222 222',
    role: {
      id: 'receptionist',
      name: 'receptionist',
      displayName: 'Auxiliar Oficina',
      permissions: [],
      isEditable: true
    },
    department: 'Administración',
    position: 'Recepcionista',
    status: 'active',
    lastLogin: '2025-05-21T09:15:00'
  },
  {
    id: '4',
    name: 'Pedro Vargas',
    email: 'pedro.vargas@clinica.com',
    phone: '+34 666 333 333',
    role: {
      id: 'manager',
      name: 'manager',
      displayName: 'Manager',
      permissions: [],
      isEditable: true
    },
    department: 'Dirección',
    position: 'Gerente',
    status: 'active',
    lastLogin: '2025-05-20T16:45:00'
  }
];