import { Header } from "@/components/layout/header"
import { DashboardActions } from "./components/dashboard-actions"
import { OrdersChart } from "./components/orders-chart"
import { RevenueChart } from "./components/revenue-chart"
import { StatsGrid } from "./components/stat-card"
import { TopProducts } from "./components/top-products"
import { primaryStats, secondaryStats } from "./data/dashboard-data"

export default function StoreAdminDashboardPage() {
  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your telehealth platform performance
            </p>
          </div>
          <DashboardActions />
        </div>

        {/* Primary Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsGrid stats={primaryStats} />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="min-h-[350px]">
            <RevenueChart />
          </div>
          <div className="min-h-[350px]">
            <OrdersChart />
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsGrid stats={secondaryStats} />
        </div>

        {/* Top Products */}
        <TopProducts />
      </div>
    </>
  )
}
