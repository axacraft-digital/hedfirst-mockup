import type { ProductDetail } from "./products-types"

/**
 * Detailed product data for the product detail/edit page.
 * These extend the basic product list data with full CMS fields.
 */
export const productDetails: ProductDetail[] = [
  {
    // Testosterone Cypionate - Hormone Therapy
    id: "prod_130",
    name: "Testosterone Cypionate",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "HORMONE_THERAPY",
    onStore: true,
    sku: "TEST-CYP",
    createdAt: "2024-03-01T10:00:00Z",
    // Extended fields
    subtitle: "Injectable Hormone Replacement Therapy for Low Testosterone",
    badge: "Hormone Therapy",
    slug: "testosterone-cypionate",
    marketingDescription:
      "Designed for men diagnosed with low testosterone who need injectable hormone replacement therapy to restore energy, strength, and vitality. This long-acting injectable testosterone prepares consistent hormone levels with convenient weekly or bi-weekly dosing administered at home. Most patients notice improved energy and mood within 2-4 weeks.",
    treatmentType: "PRESCRIPTION_MEDICATION",
    treatmentUse: "Maintenance/Daily",
    pharmacyId: "pharm_001", // Empower Pharmacy
    requiresPrescription: true,
    allowMultiplePurchase: false,
    images: ["/testosterone-cypionate.webp"],
    ingredients: [
      { id: "ing_001", name: "Testosterone Cypionate" },
    ],
    variants: [
      {
        id: "var_001",
        showOnStore: true,
        formFactor: "Injectable",
        medicationName: "Testosterone Cypionate",
        dosage: "200",
        units: "mg",
        quantity: 4,
        supplyDays: 30,
        billingCycle: "EVERY_DAY_30",
        refills: 11,
        price: 9900, // $99.00
        compareAtPrice: 14900,
        showComparePrice: true,
        sku: "TESTCYP30-01",
        pharmacyNotes: "Store refrigerated. Warm to room temperature before injection.",
        patientDirections: "Inject 0.5mL intramuscularly once weekly as directed by your provider.",
      },
      {
        id: "var_002",
        showOnStore: true,
        formFactor: "Injectable",
        medicationName: "Testosterone Cypionate",
        dosage: "200",
        units: "mg",
        quantity: 12,
        supplyDays: 90,
        billingCycle: "EVERY_DAY_90",
        refills: 3,
        price: 27900, // $279.00
        compareAtPrice: 44700,
        showComparePrice: true,
        sku: "TESTCYP90-01",
        pharmacyNotes: "Store refrigerated. Warm to room temperature before injection.",
        patientDirections: "Inject 0.5mL intramuscularly once weekly as directed by your provider.",
      },
    ],
  },
  {
    // Semaglutide - Weight Loss
    id: "prod_100",
    name: "Semaglutide",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "WEIGHT_LOSS",
    onStore: true,
    sku: "SEM-BASE",
    createdAt: "2024-03-01T10:00:00Z",
    // Extended fields
    subtitle: "GLP-1 Receptor Agonist for Medical Weight Management",
    badge: "Weight Loss",
    slug: "semaglutide",
    marketingDescription:
      "Semaglutide is a once-weekly injectable medication that helps regulate appetite and food intake. As a GLP-1 receptor agonist, it works by mimicking a hormone that targets areas of the brain involved in appetite regulation. Clinical studies show patients can achieve significant weight loss when combined with diet and exercise.",
    treatmentType: "PRESCRIPTION_MEDICATION",
    treatmentUse: "Maintenance/Daily",
    pharmacyId: "pharm_001", // Empower Pharmacy
    requiresPrescription: true,
    allowMultiplePurchase: false,
    images: ["/semaglutide.webp"],
    ingredients: [
      { id: "ing_002", name: "Semaglutide" },
    ],
    variants: [
      {
        id: "var_003",
        showOnStore: true,
        formFactor: "Injectable",
        medicationName: "Semaglutide",
        dosage: "0.25",
        units: "mg",
        quantity: 4,
        supplyDays: 30,
        billingCycle: "EVERY_DAY_30",
        refills: 11,
        price: 29900, // $299.00
        showComparePrice: false,
        sku: "SEM025-30",
        pharmacyNotes: "Refrigerate. Do not freeze.",
        patientDirections: "Inject subcutaneously once weekly. Rotate injection sites.",
      },
      {
        id: "var_004",
        showOnStore: true,
        formFactor: "Injectable",
        medicationName: "Semaglutide",
        dosage: "0.5",
        units: "mg",
        quantity: 4,
        supplyDays: 30,
        billingCycle: "EVERY_DAY_30",
        refills: 11,
        price: 34900, // $349.00
        showComparePrice: false,
        sku: "SEM050-30",
        pharmacyNotes: "Refrigerate. Do not freeze.",
        patientDirections: "Inject subcutaneously once weekly. Rotate injection sites.",
      },
    ],
  },
  {
    // Finasteride - Hair Growth
    id: "prod_110",
    name: "Finasteride",
    type: "PHYSICAL_PRODUCT",
    diseaseState: "HAIR_GROWTH",
    onStore: true,
    sku: "FIN-BASE",
    createdAt: "2024-03-01T10:00:00Z",
    // Extended fields
    subtitle: "Oral Medication for Male Pattern Hair Loss",
    badge: "Hair Growth",
    slug: "finasteride",
    marketingDescription:
      "Finasteride is an FDA-approved oral medication for treating male pattern baldness. It works by blocking the conversion of testosterone to DHT, the hormone responsible for hair follicle miniaturization. Most men see results within 3-6 months of consistent daily use.",
    treatmentType: "PRESCRIPTION_MEDICATION",
    treatmentUse: "Maintenance/Daily",
    pharmacyId: "pharm_002", // Belmar Pharmacy
    requiresPrescription: true,
    allowMultiplePurchase: true,
    images: ["/finasteride.webp"],
    ingredients: [
      { id: "ing_003", name: "Finasteride" },
    ],
    variants: [
      {
        id: "var_005",
        showOnStore: true,
        formFactor: "Tablets",
        medicationName: "Finasteride",
        dosage: "1",
        units: "mg",
        quantity: 30,
        supplyDays: 30,
        billingCycle: "EVERY_DAY_30",
        refills: 11,
        price: 3500, // $35.00
        compareAtPrice: 7500,
        showComparePrice: true,
        sku: "FIN1MG-30",
        pharmacyNotes: "Store at room temperature.",
        patientDirections: "Take one tablet daily with or without food.",
      },
      {
        id: "var_006",
        showOnStore: true,
        formFactor: "Tablets",
        medicationName: "Finasteride",
        dosage: "1",
        units: "mg",
        quantity: 90,
        supplyDays: 90,
        billingCycle: "EVERY_DAY_90",
        refills: 3,
        price: 8900, // $89.00
        compareAtPrice: 22500,
        showComparePrice: true,
        sku: "FIN1MG-90",
        pharmacyNotes: "Store at room temperature.",
        patientDirections: "Take one tablet daily with or without food.",
      },
    ],
  },
]

// Helper to get product detail by ID
export function getProductDetailById(id: string): ProductDetail | undefined {
  return productDetails.find((p) => p.id === id)
}

// Helper to get product detail by slug
export function getProductDetailBySlug(slug: string): ProductDetail | undefined {
  return productDetails.find((p) => p.slug === slug)
}
