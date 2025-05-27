/**
 * CIMAVET API Integration
 * 
 * This file contains functions to interact with the CIMAVET API
 * (Agencia Española de Medicamentos y Productos Sanitarios - AEMPS)
 * 
 * Note: This is a mock implementation as the actual CIMAVET API
 * requires proper authentication and authorization.
 */

interface CimavetSearchParams {
  name?: string;
  species?: string;
  activeIngredient?: string;
  dosageForm?: string;
  administrationRoute?: string;
  excipient?: string;
  atcVetCode?: string;
  holder?: string;
  indication?: string;
  contraindication?: string;
  adverseReaction?: string;
  interaction?: string;
  commercialized?: 'all' | 'yes' | 'no';
  fractioned?: 'all' | 'yes' | 'no';
  administration?: 'all' | 'exclusive' | 'control';
  prescription?: 'all' | 'yes' | 'no';
  psychotropic?: 'all' | 'yes' | 'no';
  antibiotic?: 'all' | 'yes' | 'no';
  situation?: 'all' | 'authorized' | 'suspended' | 'revoked';
  medicationType?: 'all' | 'pharmacological' | 'immunological' | 'mixed' | 'homeopathic';
}

interface CimavetMedication {
  id: string;
  name: string;
  registrationNumber: string;
  nationalCode?: string;
  activeIngredients: string[];
  holder: string;
  species: string[];
  dosageForm: string;
  administrationRoutes: string[];
  atcVetCode?: string;
  prescriptionRequired: boolean;
  psychotropic: boolean;
  antibiotic: boolean;
  commercialized: boolean;
  situation: 'authorized' | 'suspended' | 'revoked';
  medicationType: 'pharmacological' | 'immunological' | 'mixed' | 'homeopathic';
  datasheet?: string; // URL to the datasheet
  leaflet?: string; // URL to the patient leaflet
}

// Mock data for CIMAVET search results
const mockCimavetResults: CimavetMedication[] = [
  {
    id: '1',
    name: 'AMOXICILINA NORMON 250 mg COMPRIMIDOS',
    registrationNumber: '1234-ESP',
    nationalCode: '123456',
    activeIngredients: ['Amoxicilina'],
    holder: 'Laboratorios Normon, S.A.',
    species: ['Perro', 'Gato'],
    dosageForm: 'Comprimidos',
    administrationRoutes: ['Oral'],
    atcVetCode: 'QJ01CA04',
    prescriptionRequired: true,
    psychotropic: false,
    antibiotic: true,
    commercialized: true,
    situation: 'authorized',
    medicationType: 'pharmacological',
    datasheet: 'https://cimavet.aemps.es/cimavet/pdfs/ft/1234-ESP/FT_1234-ESP.pdf',
    leaflet: 'https://cimavet.aemps.es/cimavet/pdfs/p/1234-ESP/P_1234-ESP.pdf'
  },
  {
    id: '2',
    name: 'METACAM 1,5 mg/ml SUSPENSIÓN ORAL PARA PERROS',
    registrationNumber: '2345-ESP',
    nationalCode: '234567',
    activeIngredients: ['Meloxicam'],
    holder: 'Boehringer Ingelheim Vetmedica GmbH',
    species: ['Perro'],
    dosageForm: 'Suspensión oral',
    administrationRoutes: ['Oral'],
    atcVetCode: 'QM01AC06',
    prescriptionRequired: true,
    psychotropic: false,
    antibiotic: false,
    commercialized: true,
    situation: 'authorized',
    medicationType: 'pharmacological',
    datasheet: 'https://cimavet.aemps.es/cimavet/pdfs/ft/2345-ESP/FT_2345-ESP.pdf',
    leaflet: 'https://cimavet.aemps.es/cimavet/pdfs/p/2345-ESP/P_2345-ESP.pdf'
  },
  {
    id: '3',
    name: 'NOBIVAC RABIA',
    registrationNumber: '3456-ESP',
    nationalCode: '345678',
    activeIngredients: ['Virus de la rabia inactivado'],
    holder: 'Intervet International B.V.',
    species: ['Perro', 'Gato', 'Hurón'],
    dosageForm: 'Suspensión inyectable',
    administrationRoutes: ['Subcutánea'],
    atcVetCode: 'QI07AA02',
    prescriptionRequired: true,
    psychotropic: false,
    antibiotic: false,
    commercialized: true,
    situation: 'authorized',
    medicationType: 'immunological',
    datasheet: 'https://cimavet.aemps.es/cimavet/pdfs/ft/3456-ESP/FT_3456-ESP.pdf',
    leaflet: 'https://cimavet.aemps.es/cimavet/pdfs/p/3456-ESP/P_3456-ESP.pdf'
  }
];

/**
 * Search for medications in CIMAVET
 * @param params Search parameters
 * @returns Promise with search results
 */
export const searchCimavet = async (params: CimavetSearchParams): Promise<CimavetMedication[]> => {
  // In a real implementation, this would make an API call to CIMAVET
  // For now, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter mock data based on search parameters
  return mockCimavetResults.filter(med => {
    // Basic text search
    if (params.name && !med.name.toLowerCase().includes(params.name.toLowerCase())) {
      return false;
    }
    
    if (params.activeIngredient && !med.activeIngredients.some(ai => 
      ai.toLowerCase().includes(params.activeIngredient!.toLowerCase())
    )) {
      return false;
    }
    
    if (params.species && !med.species.some(s => 
      s.toLowerCase().includes(params.species!.toLowerCase())
    )) {
      return false;
    }
    
    if (params.dosageForm && !med.dosageForm.toLowerCase().includes(params.dosageForm.toLowerCase())) {
      return false;
    }
    
    if (params.administrationRoute && !med.administrationRoutes.some(ar => 
      ar.toLowerCase().includes(params.administrationRoute!.toLowerCase())
    )) {
      return false;
    }
    
    if (params.atcVetCode && !med.atcVetCode?.includes(params.atcVetCode)) {
      return false;
    }
    
    if (params.holder && !med.holder.toLowerCase().includes(params.holder.toLowerCase())) {
      return false;
    }
    
    // Boolean filters
    if (params.commercialized === 'yes' && !med.commercialized) {
      return false;
    }
    if (params.commercialized === 'no' && med.commercialized) {
      return false;
    }
    
    if (params.prescription === 'yes' && !med.prescriptionRequired) {
      return false;
    }
    if (params.prescription === 'no' && med.prescriptionRequired) {
      return false;
    }
    
    if (params.psychotropic === 'yes' && !med.psychotropic) {
      return false;
    }
    if (params.psychotropic === 'no' && med.psychotropic) {
      return false;
    }
    
    if (params.antibiotic === 'yes' && !med.antibiotic) {
      return false;
    }
    if (params.antibiotic === 'no' && med.antibiotic) {
      return false;
    }
    
    if (params.situation && params.situation !== 'all' && med.situation !== params.situation) {
      return false;
    }
    
    if (params.medicationType && params.medicationType !== 'all' && med.medicationType !== params.medicationType) {
      return false;
    }
    
    return true;
  });
};

/**
 * Get detailed information about a specific medication
 * @param id Medication ID or registration number
 * @returns Promise with medication details
 */
export const getMedicationDetails = async (id: string): Promise<CimavetMedication | null> => {
  // In a real implementation, this would make an API call to CIMAVET
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockCimavetResults.find(med => med.id === id || med.registrationNumber === id) || null;
};

/**
 * Import a medication from CIMAVET to the local database
 * @param id Medication ID or registration number
 * @returns Promise with the imported medication data
 */
export const importMedicationFromCimavet = async (id: string): Promise<any> => {
  const medication = await getMedicationDetails(id);
  
  if (!medication) {
    throw new Error('Medication not found in CIMAVET');
  }
  
  // In a real implementation, this would transform the CIMAVET data
  // to match your local database schema and save it
  
  // For now, we'll just return a transformed version of the mock data
  return {
    name: medication.name,
    activeIngredient: medication.activeIngredients[0],
    manufacturer: medication.holder,
    type: medication.antibiotic ? 'Antibiótico' : 
          medication.medicationType === 'immunological' ? 'Inmunológico' : 'Farmacológico',
    conditions: [], // This would need to be mapped from CIMAVET data
    species: medication.species,
    breeds: ['Todas'],
    sex: 'both',
    dosageForm: medication.dosageForm,
    recommendedDosage: '', // Not available in CIMAVET basic data
    duration: '', // Not available in CIMAVET basic data
    contraindications: [], // Not available in CIMAVET basic data
    sideEffects: [], // Not available in CIMAVET basic data
    interactions: [], // Not available in CIMAVET basic data
    status: 'active',
    stock: 0,
    minStock: 0,
    price: 0,
    reference: medication.nationalCode || '',
    atcVetCode: medication.atcVetCode,
    registrationNumber: medication.registrationNumber,
    prescriptionRequired: medication.prescriptionRequired,
    psychotropic: medication.psychotropic,
    antibiotic: medication.antibiotic,
    administrationRoutes: medication.administrationRoutes,
    excipients: [], // Not available in CIMAVET basic data
    withdrawalPeriod: '' // Not available in CIMAVET basic data
  };
};