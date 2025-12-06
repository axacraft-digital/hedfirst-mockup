import { type Pharmacy, extractStateFromAddress } from "./pharmacy-types"

/**
 * Mock pharmacy data for the pharmacies list view.
 * Pharmacies are store-level entities configured in Store Settings,
 * then referenced by ID in physical products.
 */

const rawPharmacies = [
  {
    id: "pharm_001",
    name: "Empower Pharmacy",
    address: "5980 W Sam Houston Pkwy N, Suite 100, Houston, TX 77041",
    phone: "(832) 678-4417",
    pic: "Dr. Sarah Mitchell",
    externalPharmacyId: "DOSESPOT-EMP-001",
  },
  {
    id: "pharm_002",
    name: "Belmar Pharmacy",
    address: "12860 W Cedar Dr, Suite 210, Lakewood, CO 80228",
    phone: "(800) 525-9473",
    pic: "James Rodriguez",
    externalPharmacyId: "DOSESPOT-BEL-002",
  },
  {
    id: "pharm_003",
    name: "Hallandale Pharmacy",
    address: "1109 E Hallandale Beach Blvd, Hallandale Beach, FL 33009",
    phone: "(954) 455-3822",
    pic: "Maria Gonzalez",
    externalPharmacyId: "DOSESPOT-HAL-003",
  },
  {
    id: "pharm_004",
    name: "Curexa Pharmacy",
    address: "5005 LBJ Fwy, Suite 250, Dallas, TX 75244",
    phone: "(469) 444-8767",
    pic: "Dr. Michael Chen",
    externalPharmacyId: "DOSESPOT-CUR-004",
  },
]

// Add extracted state to each pharmacy
export const pharmacies: Pharmacy[] = rawPharmacies.map((p) => ({
  ...p,
  state: extractStateFromAddress(p.address),
}))

// Helper to get pharmacy by ID (for product detail page)
export function getPharmacyById(id: string): Pharmacy | undefined {
  return pharmacies.find((p) => p.id === id)
}

// Helper to get pharmacy options for select dropdowns
export function getPharmacyOptions(): { label: string; value: string }[] {
  return pharmacies.map((p) => ({
    label: p.name,
    value: p.id,
  }))
}
