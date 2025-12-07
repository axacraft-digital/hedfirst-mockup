import type { SoapNote } from "./types"
import { soapNotes, getProviderById } from "./index"

/**
 * Chart Notes (SOAP Notes) helpers
 * Extends the existing soapNotes data with additional mock entries
 * for richer demo experience
 */

// Additional SOAP notes for demo purposes
const additionalSoapNotes: SoapNote[] = [
  // Additional notes for usr_pat001 (Sarah Johnson) - she already has soap_001
  {
    id: "soap_001b",
    patientId: "usr_pat001",
    authorId: "usr_doc001",
    authorType: "PROVIDER",
    createdAt: "2024-09-16T14:00:00Z",
    subjective: {
      chiefComplaint: "3-month follow-up for hair loss treatment",
      historyOfPresentIllness: "Patient returns for follow-up. Reports decreased shedding and early signs of regrowth at temples. No side effects from Finasteride. Adherent to daily regimen.",
      reviewOfSystems: "No concerns. Denies any new symptoms.",
    },
    objective: {
      vitalSigns: null,
      physicalExam: "Photos compared to baseline - visible improvement in hair density at temples and crown. Hairline appears more defined.",
      labResults: null,
    },
    assessment: {
      diagnoses: ["Androgenetic alopecia - responding to treatment"],
      differentialDiagnoses: [],
      clinicalImpression: "Excellent response to Finasteride at 3 months. Patient motivated to continue.",
    },
    plan: {
      medications: ["Continue Finasteride 1mg daily"],
      instructions: "Continue current regimen. Consider adding Minoxidil 5% if patient desires accelerated results.",
      followUp: "Follow-up in 3 months",
      referrals: null,
    },
  },
  {
    id: "soap_001c",
    patientId: "usr_pat001",
    authorId: "usr_doc001",
    authorType: "PROVIDER",
    createdAt: "2024-12-02T10:30:00Z",
    subjective: {
      chiefComplaint: "6-month follow-up, considering adding topical treatment",
      historyOfPresentIllness: "Patient continues on Finasteride with good results. Interested in adding Minoxidil to further enhance results. No side effects reported.",
      reviewOfSystems: "No concerns.",
    },
    objective: {
      vitalSigns: null,
      physicalExam: "Continued improvement from 3-month visit. Crown density significantly improved. Temple regrowth maintained.",
      labResults: null,
    },
    assessment: {
      diagnoses: ["Androgenetic alopecia - good treatment response"],
      differentialDiagnoses: [],
      clinicalImpression: "Sustained response to oral therapy. Good candidate for combination therapy.",
    },
    plan: {
      medications: ["Continue Finasteride 1mg daily", "Add Minoxidil 5% solution - apply to scalp BID"],
      instructions: "Apply Minoxidil to dry scalp morning and evening. Allow to dry before styling. May experience temporary shedding in first 2-4 weeks.",
      followUp: "Follow-up in 3 months to assess combination therapy",
      referrals: null,
    },
  },
  // Additional note for usr_pat002 (Michael Thompson) - he already has soap_002
  {
    id: "soap_002b",
    patientId: "usr_pat002",
    authorId: "usr_doc003",
    authorType: "PROVIDER",
    createdAt: "2024-04-14T11:00:00Z",
    subjective: {
      chiefComplaint: "1-month follow-up for weight management",
      historyOfPresentIllness: "Patient on Semaglutide 0.25mg x 4 weeks. Reports decreased appetite, eating smaller portions. Some mild nausea in first week that resolved. Lost 8 lbs.",
      reviewOfSystems: "Nausea resolved. No constipation. Energy levels good.",
    },
    objective: {
      vitalSigns: null,
      physicalExam: "Weight: 237 lbs (down 8 lbs from baseline). Patient appears well.",
      labResults: null,
    },
    assessment: {
      diagnoses: ["Obesity - responding to treatment", "Prediabetes"],
      differentialDiagnoses: [],
      clinicalImpression: "Good initial response to GLP-1. Tolerating medication well.",
    },
    plan: {
      medications: ["Increase Semaglutide to 0.5mg weekly"],
      instructions: "Increase dose as tolerated. Continue high-protein diet and regular exercise.",
      followUp: "Follow-up in 4 weeks for next dose adjustment",
      referrals: null,
    },
  },
  {
    id: "soap_002c",
    patientId: "usr_pat002",
    authorId: "usr_doc003",
    authorType: "PROVIDER",
    createdAt: "2024-06-10T09:15:00Z",
    subjective: {
      chiefComplaint: "3-month follow-up, dose optimization",
      historyOfPresentIllness: "Now on Semaglutide 1.0mg weekly. Total weight loss of 22 lbs. Appetite well controlled. Reports improved energy and mood.",
      reviewOfSystems: "Occasional mild constipation managed with fiber. No other concerns.",
    },
    objective: {
      vitalSigns: null,
      physicalExam: "Weight: 223 lbs (down 22 lbs). Blood pressure improved: 128/82.",
      labResults: "A1C improved to 5.5% (from 5.8%)",
    },
    assessment: {
      diagnoses: ["Obesity - significant improvement", "Prediabetes - resolved"],
      differentialDiagnoses: [],
      clinicalImpression: "Excellent response. A1C now in normal range. Continue current therapy.",
    },
    plan: {
      medications: ["Continue Semaglutide 1.0mg weekly"],
      instructions: "Maintain current dose. Goal weight: 200 lbs. Continue lifestyle modifications.",
      followUp: "Follow-up in 3 months",
      referrals: null,
    },
  },
  // Jacob Henderson (usr_pat_jacob) - Peptide therapy initial consultation
  {
    id: "soap_jacob_001",
    patientId: "usr_pat_jacob",
    authorId: "usr_doc002",
    authorType: "PROVIDER",
    createdAt: "2025-11-17T07:55:00Z",
    subjective: {
      chiefComplaint: "Initial consultation for CJC 1295 + Ipamorelin peptide therapy",
      historyOfPresentIllness: `Jacob Henderson is a 29-year-old male seeking CJC 1295 1.2mg + Ipamorelin 2mg monthly for health optimization. This is his first experience with peptide therapy. His primary health goals include muscle growth and recovery, improved sleep quality, injury recovery and healing, athletic performance enhancement, enhanced cognitive function and focus, increased energy and vitality, anti-aging and longevity, and stress management and mood improvement.

Patient reports being very active and working out daily, exercising 4-5 times per week. He states he has had some minor overuse issues in the past from training, so recovery and injury prevention are important to him. He reports no major medical conditions but wants to support his body as he continues to train consistently. His primary motivation for considering peptide therapy is general health optimization and wellness. Patient is comfortable with self-administering subcutaneous injections but will need education on proper technique.`,
      reviewOfSystems: "No concerns reported. Patient denies any current symptoms or issues.",
    },
    objective: {
      vitalSigns: "Height: 5'7\" | Weight: 160 lbs | BMI: 25.1",
      physicalExam: `Current medications: Multivitamin and creatine 5 grams daily
Allergies: No known allergies`,
      labResults: `Recent laboratory results from March 2025:
• Hepatitis C antibody: Non-reactive
• TSH: 1.35 (within normal limits)
• Lipid panel: Normal, no concerns
• CBC: All values within normal limits
• HCV antibody: Negative
• CMP: All values within normal limits except calcium 10.4 (normal range 8.7-10.2)
• AST: 47 (slightly elevated, normal range 0-40)
• ALT: 35 (within normal range)
• Urinalysis: Negative, within normal limits`,
    },
    assessment: {
      diagnoses: ["Health optimization candidate", "Athletic performance enhancement"],
      differentialDiagnoses: [],
      clinicalImpression: `29-year-old healthy male candidate for peptide therapy with CJC 1295 and Ipamorelin. Patient has completed the safety questionnaire and uploaded recent comprehensive laboratory work from 2025 showing overall normal results with only minor elevations in calcium (10.4) and AST (47), neither of which is of clinical concern at this time. No contraindications to peptide therapy identified. Patient maintains an active lifestyle with regular exercise 4-5 times weekly, follows a balanced diet focused on whole foods, rarely consumes alcohol, and does not use tobacco or nicotine products. No recent surgeries or procedures. Patient is an appropriate candidate for the requested peptide therapy for health optimization and athletic performance enhancement.`,
    },
    plan: {
      medications: ["CJC 1295 without DAC 1.2mg + Ipamorelin 2mg in 5mL vial"],
      instructions: `Inject 10 units subcutaneous nightly 90 minutes after last meal. If well tolerated, may increase to 20 units at week 3. Dispense 5 milliliters with 11 refills, 30-day supply each. Prescription sent on 11/17/2025 at 9:45 AM Eastern Standard Time. Patient will be provided education on subcutaneous peptide injection technique. Patient instructed to reach out with any concerns or questions during treatment.`,
      followUp: "As needed or if concerns arise",
      referrals: null,
    },
  },
]

// Combine all SOAP notes
export function getAllChartNotes(): SoapNote[] {
  return [...soapNotes, ...additionalSoapNotes]
}

// Get chart notes for a specific patient
export function getChartNotesByPatientId(patientId: string): SoapNote[] {
  const allNotes = getAllChartNotes()
  return allNotes
    .filter((note) => note.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get chart note by ID
export function getChartNoteById(id: string): SoapNote | undefined {
  return getAllChartNotes().find((note) => note.id === id)
}

// Get provider name for a chart note
export function getChartNoteProviderName(note: SoapNote): string {
  const provider = getProviderById(note.authorId)
  if (provider) {
    return `Dr. ${provider.firstName} ${provider.lastName}`
  }
  return "Unknown Provider"
}
