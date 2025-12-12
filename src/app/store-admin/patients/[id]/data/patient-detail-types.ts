/**
 * Extended Patient Types for Patient Detail Page
 * Based on the production Patient Overview screenshot
 */

// General Information
export interface PatientGeneralInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  email: string
  phone: string
  sexAtBirth: "Male" | "Female" | "Other"
  raceEthnicity: string
  primaryLanguage: string
  preferredMedicalLanguage: string
  preferredContactMethod: "SMS Text" | "Email" | "Phone"
  assignedProviderId: string | null
  assignedProviderName: string | null
  emailSubscribed: boolean
  smsSubscribed: boolean
}

// Health Information
export interface PatientHealthInfo {
  heightFeet: number
  heightInches: number
  weightLbs: number
  bmi: number
}

// Social & Demographic Information
export interface PatientDemographicInfo {
  educationLevel: string
  employmentStatus: string
  maritalStatus: string
  householdSize: number
  primaryOccupation: string
}

// Health Risk Factors
export interface PatientHealthRiskFactors {
  nicotineUsage: string
  nicotineFrequency: string | null
  nicotineType: string | null
  alcoholUse: string
  alcoholFrequency: string | null
}

// Healthcare Information
export interface PatientHealthcareInfo {
  mostRecentPrimaryCareProvider: string | null
  providerName: string | null
  providerEmail: string | null
  providerPhone: string | null
  preferredLocalPharmacy: string | null
  pharmacyAddress: string | null
  allergiesOrSubstances: string | null
}

// Emergency Contact
export interface PatientEmergencyContact {
  name: string
  relationship: string
  phone: string
}

// Shipping Address
export interface PatientShippingAddress {
  streetAddress: string
  apartment: string | null
  city: string
  state: string
  zipCode: string
  country: string
}

// ID Verification
export interface PatientIdVerification {
  selfiePhoto: string | null
  idFrontPhoto: string | null
  idBackPhoto: string | null
  verifiedAt: string | null
}

// Complete Patient Detail
export interface PatientDetail {
  id: string
  status: string
  createdAt: string
  generalInfo: PatientGeneralInfo
  healthInfo: PatientHealthInfo
  demographicInfo: PatientDemographicInfo
  healthRiskFactors: PatientHealthRiskFactors
  healthcareInfo: PatientHealthcareInfo
  emergencyContact: PatientEmergencyContact | null
  shippingAddress: PatientShippingAddress
  idVerification: PatientIdVerification
}

// Helper to calculate BMI
export function calculateBmi(
  heightFeet: number,
  heightInches: number,
  weightLbs: number
): number {
  const totalInches = heightFeet * 12 + heightInches
  const heightMeters = totalInches * 0.0254
  const weightKg = weightLbs * 0.453592
  return Math.round((weightKg / (heightMeters * heightMeters)) * 10) / 10
}

// Format height for display
export function formatHeight(feet: number, inches: number): string {
  return `${feet}' ${inches}"`
}

// Format weight for display
export function formatWeight(lbs: number): string {
  return `${lbs} lbs`
}
