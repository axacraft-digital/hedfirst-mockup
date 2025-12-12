import type { Product } from "./products-types"

/**
 * Mock products data for the products list view.
 * Based on actual production data patterns.
 */
export const products: Product[] = [
  // Services
  {
    id: "prod_001",
    name: "Diabetes Management Consultation",
    type: "SERVICE",
    diseaseState: "DIABETES_MANAGEMENT",
    onStore: true,
    sku: "CONSULT-DIABETES",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "prod_002",
    name: "Weight Loss Consultation",
    type: "SERVICE",
    diseaseState: "WEIGHT_LOSS",
    onStore: true,
    sku: "CONSULT-WEIGHT",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "prod_003",
    name: "Hair Loss Consultation",
    type: "SERVICE",
    diseaseState: "HAIR_GROWTH",
    onStore: true,
    sku: "CONSULT-HAIR",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "prod_004",
    name: "Sexual Wellness Consultation",
    type: "SERVICE",
    diseaseState: "SEXUAL_WELLNESS",
    onStore: true,
    sku: "CONSULT-SEXUAL",
    createdAt: "2024-01-15T10:00:00Z",
  },

  // Memberships
  {
    id: "prod_010",
    name: "Care Membership (Monthly)",
    type: "MEMBERSHIP",
    diseaseState: "GENERAL_WELLNESS",
    onStore: true,
    sku: "MEM-CARE-MONTHLY",
    price: 1900,
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "prod_011",
    name: "Care Membership (Annual)",
    type: "MEMBERSHIP",
    diseaseState: "GENERAL_WELLNESS",
    onStore: true,
    sku: "MEM-CARE-ANNUAL",
    price: 14900,
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "prod_012",
    name: "Premium Membership (Monthly)",
    type: "MEMBERSHIP",
    diseaseState: "GENERAL_WELLNESS",
    onStore: true,
    sku: "MEM-PREM-MONTHLY",
    price: 4900,
    createdAt: "2024-01-10T10:00:00Z",
  },

  // Lab Tests
  {
    id: "prod_020",
    name: "Metabolic Health Panel",
    type: "LAB_TEST",
    diseaseState: "WEIGHT_LOSS",
    onStore: true,
    sku: "LAB-METAB",
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "prod_021",
    name: "Hormone Panel (Male)",
    type: "LAB_TEST",
    diseaseState: "HORMONE_THERAPY",
    onStore: true,
    sku: "LAB-HORMONE-M",
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "prod_022",
    name: "Thyroid Panel",
    type: "LAB_TEST",
    diseaseState: "GENERAL_WELLNESS",
    onStore: false,
    sku: "LAB-THYROID",
    createdAt: "2024-02-01T10:00:00Z",
  },

  // Physical Products - Weight Loss
  {
    id: "prod_100",
    name: "Semaglutide",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "WEIGHT_LOSS",
    onStore: true,
    sku: "SEM-BASE",
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "prod_101",
    name: "Tirzepatide",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "WEIGHT_LOSS",
    onStore: true,
    sku: "TIR-BASE",
    createdAt: "2024-03-01T10:00:00Z",
  },

  // Physical Products - Hair Growth
  {
    id: "prod_110",
    name: "Finasteride",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "HAIR_GROWTH",
    onStore: true,
    sku: "FIN-BASE",
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "prod_111",
    name: "Minoxidil (Topical)",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "HAIR_GROWTH",
    onStore: true,
    sku: "MIN-TOP",
    createdAt: "2024-03-01T10:00:00Z",
  },

  // Physical Products - Sexual Wellness / ED
  {
    id: "prod_120",
    name: "Sildenafil",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "ERECTILE_DYSFUNCTION",
    onStore: true,
    sku: "SIL-BASE",
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "prod_121",
    name: "Tadalafil",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "ERECTILE_DYSFUNCTION",
    onStore: true,
    sku: "TAD-BASE",
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "prod_122",
    name: "Vardenafil",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "SEXUAL_WELLNESS",
    onStore: false,
    sku: "VAR-BASE",
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "prod_123",
    name: "Papaverine/Phentolamine/Prostaglandin E1 5mL",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "SEXUAL_WELLNESS",
    onStore: true,
    sku: "TRIMIX-5ML",
    createdAt: "2024-03-01T10:00:00Z",
  },

  // Physical Products - Hormone Therapy
  {
    id: "prod_130",
    name: "Testosterone Cypionate",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "HORMONE_THERAPY",
    onStore: false,
    sku: "TEST-CYP",
    createdAt: "2024-03-01T10:00:00Z",
  },

  // Physical Products - Sleep
  {
    id: "prod_140",
    name: "Zaleplon",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "SLEEP_INSOMNIA",
    onStore: false,
    sku: "ZAL-BASE",
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "prod_141",
    name: "Temazepam",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "SLEEP_INSOMNIA",
    onStore: false,
    sku: "TEM-BASE",
    createdAt: "2024-03-01T10:00:00Z",
  },

  // Physical Products - Other
  {
    id: "prod_150",
    name: "Diphenoxylate + Atropine",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "GASTROINTESTINAL_DISORDERS",
    onStore: false,
    sku: "DIPH-ATR",
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "prod_151",
    name: "Abiraterone",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "ONCOLOGY_CANCER",
    onStore: true,
    sku: "ABIR-BASE",
    createdAt: "2024-03-01T10:00:00Z",
  },
  {
    id: "prod_152",
    name: "Warfarin (Jantoven)",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "CARDIOVASCULAR_HEALTH",
    onStore: true,
    sku: "WARF-BASE",
    createdAt: "2024-03-01T10:00:00Z",
  },
]

// Filter products by type
export function filterProductsByType(
  productList: Product[],
  type: "all" | "physical" | "service" | "membership" | "lab-test"
): Product[] {
  if (type === "all") return productList

  const typeMap: Record<string, Product["type"]> = {
    physical: "PHYSICAL_PRODUCT",
    service: "SERVICE",
    membership: "MEMBERSHIP",
    "lab-test": "LAB_TEST",
  }

  return productList.filter((p) => p.type === typeMap[type])
}

// Search products by name
export function searchProducts(
  productList: Product[],
  query: string
): Product[] {
  if (!query.trim()) return productList

  const lowerQuery = query.toLowerCase()
  return productList.filter((p) => p.name.toLowerCase().includes(lowerQuery))
}
