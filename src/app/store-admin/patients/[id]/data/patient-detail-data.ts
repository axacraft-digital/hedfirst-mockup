import { type PatientDetail, calculateBmi } from "./patient-detail-types"

/**
 * Mock patient detail data for the Patient Overview page
 * Based on Jacob Henderson from the production screenshot
 */

// Jacob Henderson - Primary demo patient (Peptide + Weight)
const jacobHenderson: PatientDetail = {
  id: "usr_pat_jacob",
  status: "ACTIVE",
  createdAt: "2025-11-16T16:54:00Z",
  generalInfo: {
    firstName: "Jacob",
    lastName: "Henderson",
    dateOfBirth: "1996-03-15",
    email: "jacob.henderson@email.com",
    phone: "+1 555-987-6543",
    sexAtBirth: "Male",
    raceEthnicity: "White",
    primaryLanguage: "English",
    preferredMedicalLanguage: "English",
    preferredContactMethod: "SMS Text",
    assignedProviderId: "usr_doc002",
    assignedProviderName: "Dr. Nicole Baldwin",
    emailSubscribed: true,
    smsSubscribed: false,
  },
  healthInfo: {
    heightFeet: 5,
    heightInches: 7,
    weightLbs: 160,
    bmi: 25.1,
  },
  demographicInfo: {
    educationLevel: "Bachelor's degree",
    employmentStatus: "Employed full time",
    maritalStatus: "Single",
    householdSize: 1,
    primaryOccupation: "Accountant",
  },
  healthRiskFactors: {
    nicotineUsage: "Never used",
    nicotineFrequency: null,
    nicotineType: null,
    alcoholUse: "Yes",
    alcoholFrequency: "1-2 drinks per week",
  },
  healthcareInfo: {
    mostRecentPrimaryCareProvider: null,
    providerName: null,
    providerEmail: null,
    providerPhone: null,
    preferredLocalPharmacy: null,
    pharmacyAddress: null,
    allergiesOrSubstances: null,
  },
  emergencyContact: {
    name: "Larry Henderson",
    relationship: "Parent",
    phone: "+14073588849",
  },
  shippingAddress: {
    streetAddress: "2518 Toddville Rd",
    apartment: null,
    city: "Charlotte",
    state: "North Carolina",
    zipCode: "28214",
    country: "USA",
  },
  idVerification: {
    selfiePhoto: "/patient-photo-1.jpeg",
    idFrontPhoto: "/patient-license-front.jpeg",
    idBackPhoto: "/patient-license-back.jpeg",
    verifiedAt: "2024-08-15T11:00:00Z",
  },
}

// Sarah Chen - Hair loss patient (long treatment history)
const sarahChen: PatientDetail = {
  id: "usr_pat001",
  status: "ACTIVE",
  createdAt: "2024-06-15T10:30:00Z",
  generalInfo: {
    firstName: "Sarah",
    lastName: "Chen",
    dateOfBirth: "1988-07-22",
    email: "sarah.chen@email.com",
    phone: "+1 555-123-4001",
    sexAtBirth: "Female",
    raceEthnicity: "Asian",
    primaryLanguage: "English",
    preferredMedicalLanguage: "English",
    preferredContactMethod: "Email",
    assignedProviderId: "usr_doc001",
    assignedProviderName: "Dr. Michelle Chen",
    emailSubscribed: true,
    smsSubscribed: true,
  },
  healthInfo: {
    heightFeet: 5,
    heightInches: 6,
    weightLbs: 145,
    bmi: calculateBmi(5, 6, 145),
  },
  demographicInfo: {
    educationLevel: "Master's degree",
    employmentStatus: "Employed full time",
    maritalStatus: "Married",
    householdSize: 3,
    primaryOccupation: "Marketing Manager",
  },
  healthRiskFactors: {
    nicotineUsage: "Never used",
    nicotineFrequency: null,
    nicotineType: null,
    alcoholUse: "Yes",
    alcoholFrequency: "Social drinker",
  },
  healthcareInfo: {
    mostRecentPrimaryCareProvider: "Dr. James Miller",
    providerName: "Dr. James Miller",
    providerEmail: "jmiller@austinmedical.com",
    providerPhone: "+1 512-555-0100",
    preferredLocalPharmacy: "CVS Pharmacy",
    pharmacyAddress: "100 Congress Ave, Austin, TX 78701",
    allergiesOrSubstances: "Penicillin",
  },
  emergencyContact: {
    name: "David Chen",
    relationship: "Spouse",
    phone: "+1 555-123-4002",
  },
  shippingAddress: {
    streetAddress: "123 Oak Street",
    apartment: "Apt 4B",
    city: "Austin",
    state: "Texas",
    zipCode: "78701",
    country: "USA",
  },
  idVerification: {
    selfiePhoto: "/patient-photo-1.jpeg",
    idFrontPhoto: "/patient-license-front.jpeg",
    idBackPhoto: "/patient-license-back.jpeg",
    verifiedAt: "2024-06-15T11:00:00Z",
  },
}

// Michael Torres - New patient (Awaiting Review, sexual wellness)
const michaelTorres: PatientDetail = {
  id: "usr_pat002",
  status: "PENDING",
  createdAt: "2025-12-01T09:15:00Z",
  generalInfo: {
    firstName: "Michael",
    lastName: "Torres",
    dateOfBirth: "1982-11-08",
    email: "michael.torres@email.com",
    phone: "+1 555-123-4002",
    sexAtBirth: "Male",
    raceEthnicity: "Hispanic",
    primaryLanguage: "English",
    preferredMedicalLanguage: "English",
    preferredContactMethod: "Phone",
    assignedProviderId: "usr_doc003",
    assignedProviderName: "Dr. Priya Patel",
    emailSubscribed: true,
    smsSubscribed: false,
  },
  healthInfo: {
    heightFeet: 5,
    heightInches: 10,
    weightLbs: 185,
    bmi: calculateBmi(5, 10, 185),
  },
  demographicInfo: {
    educationLevel: "Associate's degree",
    employmentStatus: "Employed full time",
    maritalStatus: "Married",
    householdSize: 4,
    primaryOccupation: "IT Specialist",
  },
  healthRiskFactors: {
    nicotineUsage: "Never used",
    nicotineFrequency: null,
    nicotineType: null,
    alcoholUse: "Yes",
    alcoholFrequency: "1-2 drinks per week",
  },
  healthcareInfo: {
    mostRecentPrimaryCareProvider: null,
    providerName: null,
    providerEmail: null,
    providerPhone: null,
    preferredLocalPharmacy: "Walgreens",
    pharmacyAddress: "200 Main St, Houston, TX 77002",
    allergiesOrSubstances: "Sulfa drugs",
  },
  emergencyContact: {
    name: "Maria Torres",
    relationship: "Spouse",
    phone: "+1 555-123-4003",
  },
  shippingAddress: {
    streetAddress: "789 Pine Road",
    apartment: "Suite 100",
    city: "Houston",
    state: "Texas",
    zipCode: "77002",
    country: "USA",
  },
  idVerification: {
    selfiePhoto: "/patient-photo-1.jpeg",
    idFrontPhoto: "/patient-license-front.jpeg",
    idBackPhoto: "/patient-license-back.jpeg",
    verifiedAt: "2025-12-01T09:30:00Z",
  },
}

// Export all patient details
export const patientDetails: PatientDetail[] = [
  jacobHenderson,
  sarahChen,
  michaelTorres,
]

// Helper to get patient detail by ID
export function getPatientDetailById(id: string): PatientDetail | undefined {
  return patientDetails.find((p) => p.id === id)
}

// Get all patient IDs for static generation
export function getAllPatientDetailIds(): string[] {
  return patientDetails.map((p) => p.id)
}
