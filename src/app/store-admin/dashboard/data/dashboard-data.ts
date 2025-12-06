// ============================================================================
// Stat Card Types & Data
// ============================================================================

export type StatIconName =
  | "currency-dollar"
  | "receipt"
  | "users"
  | "stethoscope"
  | "user-plus"
  | "repeat"

export type StatCardData = {
  label: string
  description: string
  value: string
  type: "up" | "down" | "neutral"
  percentage: number
  chartData: { day: string; value: number }[]
  strokeColor: string
  iconName: StatIconName
}

export const primaryStats: StatCardData[] = [
  {
    label: "Total Revenue",
    description: "Gross revenue for the selected period",
    value: "$128,430",
    type: "up",
    percentage: 12.5,
    chartData: [
      { day: "Mon", value: 18200 },
      { day: "Tue", value: 21500 },
      { day: "Wed", value: 19800 },
      { day: "Thu", value: 24100 },
      { day: "Fri", value: 22300 },
      { day: "Sat", value: 12400 },
      { day: "Sun", value: 10130 },
    ],
    strokeColor: "var(--chart-1)",
    iconName: "currency-dollar",
  },
  {
    label: "Orders",
    description: "Total orders placed",
    value: "1,847",
    type: "up",
    percentage: 8.2,
    chartData: [
      { day: "Mon", value: 245 },
      { day: "Tue", value: 312 },
      { day: "Wed", value: 287 },
      { day: "Thu", value: 356 },
      { day: "Fri", value: 298 },
      { day: "Sat", value: 189 },
      { day: "Sun", value: 160 },
    ],
    strokeColor: "var(--chart-2)",
    iconName: "receipt",
  },
  {
    label: "Active Patients",
    description: "Patients with active subscriptions",
    value: "3,241",
    type: "up",
    percentage: 4.1,
    chartData: [
      { day: "Mon", value: 3180 },
      { day: "Tue", value: 3195 },
      { day: "Wed", value: 3210 },
      { day: "Thu", value: 3218 },
      { day: "Fri", value: 3229 },
      { day: "Sat", value: 3235 },
      { day: "Sun", value: 3241 },
    ],
    strokeColor: "var(--chart-3)",
    iconName: "users",
  },
  {
    label: "Consultations",
    description: "Completed provider consultations",
    value: "428",
    type: "down",
    percentage: 3.2,
    chartData: [
      { day: "Mon", value: 72 },
      { day: "Tue", value: 68 },
      { day: "Wed", value: 81 },
      { day: "Thu", value: 65 },
      { day: "Fri", value: 58 },
      { day: "Sat", value: 45 },
      { day: "Sun", value: 39 },
    ],
    strokeColor: "var(--chart-4)",
    iconName: "stethoscope",
  },
]

export const secondaryStats: StatCardData[] = [
  {
    label: "New Customers",
    description: "First-time patients registered",
    value: "312",
    type: "up",
    percentage: 18.7,
    chartData: [
      { day: "Mon", value: 42 },
      { day: "Tue", value: 58 },
      { day: "Wed", value: 51 },
      { day: "Thu", value: 47 },
      { day: "Fri", value: 53 },
      { day: "Sat", value: 34 },
      { day: "Sun", value: 27 },
    ],
    strokeColor: "var(--chart-1)",
    iconName: "user-plus",
  },
  {
    label: "First Orders",
    description: "Orders from new customers",
    value: "287",
    type: "up",
    percentage: 15.3,
    chartData: [
      { day: "Mon", value: 38 },
      { day: "Tue", value: 52 },
      { day: "Wed", value: 45 },
      { day: "Thu", value: 41 },
      { day: "Fri", value: 48 },
      { day: "Sat", value: 32 },
      { day: "Sun", value: 31 },
    ],
    strokeColor: "var(--chart-2)",
    iconName: "receipt",
  },
  {
    label: "Recurring Orders",
    description: "Subscription refills processed",
    value: "1,560",
    type: "up",
    percentage: 5.8,
    chartData: [
      { day: "Mon", value: 207 },
      { day: "Tue", value: 260 },
      { day: "Wed", value: 242 },
      { day: "Thu", value: 315 },
      { day: "Fri", value: 250 },
      { day: "Sat", value: 157 },
      { day: "Sun", value: 129 },
    ],
    strokeColor: "var(--chart-3)",
    iconName: "repeat",
  },
  {
    label: "MRR",
    description: "Monthly recurring revenue",
    value: "$94,200",
    type: "up",
    percentage: 6.4,
    chartData: [
      { day: "Mon", value: 91200 },
      { day: "Tue", value: 91800 },
      { day: "Wed", value: 92400 },
      { day: "Thu", value: 93100 },
      { day: "Fri", value: 93600 },
      { day: "Sat", value: 93900 },
      { day: "Sun", value: 94200 },
    ],
    strokeColor: "var(--chart-4)",
    iconName: "currency-dollar",
  },
]

// ============================================================================
// Revenue Chart Data
// ============================================================================

export const revenueChartData = [
  { month: "Jan", revenue: 86400, subscriptions: 72000 },
  { month: "Feb", revenue: 92100, subscriptions: 76800 },
  { month: "Mar", revenue: 98700, subscriptions: 81200 },
  { month: "Apr", revenue: 105200, subscriptions: 86400 },
  { month: "May", revenue: 112800, subscriptions: 91000 },
  { month: "Jun", revenue: 118400, subscriptions: 94200 },
  { month: "Jul", revenue: 124600, subscriptions: 98800 },
  { month: "Aug", revenue: 128430, subscriptions: 102400 },
]

// ============================================================================
// Orders by Type Chart Data
// ============================================================================

export const ordersByTypeData = [
  { month: "Jan", firstOrders: 245, recurring: 1120 },
  { month: "Feb", firstOrders: 268, recurring: 1180 },
  { month: "Mar", firstOrders: 287, recurring: 1250 },
  { month: "Apr", firstOrders: 312, recurring: 1340 },
  { month: "May", firstOrders: 298, recurring: 1420 },
  { month: "Jun", firstOrders: 324, recurring: 1480 },
  { month: "Jul", firstOrders: 301, recurring: 1520 },
  { month: "Aug", firstOrders: 287, recurring: 1560 },
]

// ============================================================================
// Top Products Data
// ============================================================================

export type TopProduct = {
  rank: number
  name: string
  category: string
  revenue: number
  orders: number
  trend: "up" | "down" | "neutral"
}

export const topProducts: TopProduct[] = [
  {
    rank: 1,
    name: "Semaglutide",
    category: "Weight Loss",
    revenue: 4892400,
    orders: 1634,
    trend: "up",
  },
  {
    rank: 2,
    name: "Tirzepatide",
    category: "Weight Loss",
    revenue: 2847200,
    orders: 634,
    trend: "up",
  },
  {
    rank: 3,
    name: "Finasteride",
    category: "Hair Loss",
    revenue: 892800,
    orders: 1984,
    trend: "neutral",
  },
  {
    rank: 4,
    name: "Tadalafil",
    category: "Sexual Wellness",
    revenue: 654300,
    orders: 1678,
    trend: "up",
  },
  {
    rank: 5,
    name: "Complete Hair Kit",
    category: "Hair Loss",
    revenue: 512000,
    orders: 800,
    trend: "down",
  },
]

// ============================================================================
// Revenue by Disease State
// ============================================================================

export const revenueByDiseaseState = [
  { name: "Weight Loss", value: 7739600, fill: "var(--chart-1)" },
  { name: "Hair Loss", value: 1404800, fill: "var(--chart-2)" },
  { name: "Sexual Wellness", value: 854300, fill: "var(--chart-3)" },
  { name: "Skin Care", value: 245200, fill: "var(--chart-4)" },
]
