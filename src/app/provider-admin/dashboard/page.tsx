import { Header } from "@/components/layout/header"

export default function ProviderDashboardPage() {
  return (
    <>
      <Header />
      <div className="space-y-4 p-4">
        <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Good morning, Dr. Chen
          </h1>
        </div>
        <p className="text-muted-foreground">
          Provider Portal Dashboard — Coming Soon
        </p>
      </div>
    </>
  )
}
