import { NavItem } from './navigation';

export type { NavItem };

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  preferredContact: 'phone' | 'email' | 'whatsapp' | 'sms';
  bankAccount?: string;
  creditCard?: string;
  marketing: {
    acceptsDataProtection: boolean;
    acceptsEmailMarketing: boolean;
    acceptsWhatsAppComm: boolean;
  };
  petPass: {
    hasPetPass: boolean;
    plan?: 'track' | 'protect' | 'vetcare';
  };
  services: {
    wantsGrooming: boolean;
    wantsFoodDelivery: boolean;
    wantsHotelService: boolean;
    wantsTraining: boolean;
  };
  pet: {
    name: string;
    species: string;
    sex: 'male' | 'female';
    birthDate: string;
    breed: string;
    isNeutered: boolean;
    microchipNumber?: string;
    vaccines: Array<{
      name: string;
      date: string;
      nextDue?: string;
    }>;
    healthPlans: Array<{
      name: string;
      startDate: string;
      endDate: string;
    }>;
    accidents: Array<{
      date: string;
      description: string;
      treatment: string;
    }>;
    surgeries: Array<{
      date: string;
      type: string;
      notes: string;
    }>;
    otherTests: Array<{
      date: string;
      type: string;
      result: string;
    }>;
  };
  insuranceProvider?: string;
  insuranceNumber?: string;
  medicalHistory?: string[];
}

export interface Appointment {
  id: string;
  petName: string;
  breed: string;
  age: number;
  sex: 'male' | 'female';
  petProfileUrl: string;
  consultationKind: 'annualReview' | 'followUp' | 'checkUp' | 'emergency' | 'vaccination' | 'surgery' | 'dental' | 'grooming';
  consultationType: 'normal' | 'insurance' | 'emergency';
  serviceType: 'veterinary' | 'grooming' | 'rehabilitation' | 'hospitalization';
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'waiting' | 'in_progress' | 'completed' | 'no_show';
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  schedule: {
    [key: string]: {
      start: string;
      end: string;
      breaks: Array<{
        start: string;
        end: string;
      }>;
    };
  };
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  date: string;
  method: 'cash' | 'credit' | 'debit' | 'insurance' | 'other';
  status: 'pending' | 'completed' | 'refunded';
  insuranceClaim?: {
    provider: string;
    claimNumber: string;
    status: 'submitted' | 'processing' | 'approved' | 'denied';
    approvedAmount?: number;
  };
}

export interface DashboardSummary {
  appointmentsToday: number;
  appointmentsWeek: number;
  patientsTotal: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: 'view' | 'create' | 'edit' | 'delete' | 'manage';
}

export interface UserRole {
  id: string;
  name: 'admin' | 'manager' | 'veterinarian' | 'vet_assistant' | 'receptionist' | 'groomer';
  displayName: string;
  permissions: Permission[];
  isEditable: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  avatar?: string;
  customPermissions?: Permission[];
}