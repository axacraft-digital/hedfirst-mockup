/**
 * Pharmacy types for store-level pharmacy management
 */

export interface Pharmacy {
  id: string
  name: string
  address: string
  phone: string
  pic: string // Person in charge
  externalPharmacyId: string // DoseSpot pharmacy ID
  state: string // Extracted from address for display
}

// Helper to extract state from address
export function extractStateFromAddress(address: string): string {
  // Match pattern like "City, ST 12345" or "City, STATE 12345"
  const match = address.match(/,\s*([A-Z]{2})\s*\d{5}/)
  return match ? match[1] : ""
}
