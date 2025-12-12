import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Header } from "@/components/layout/header"
import { OrdersContent } from "./components/orders-content"
import { orders } from "./data/orders-data"

export default function OrdersPage() {
  // Calculate counts for display
  const totalOrders = orders.length
  const needsReviewCount = orders.filter(
    (o) => o.status === "AWAITING_REVIEW"
  ).length
  const paymentFailedCount = orders.filter(
    (o) => o.status === "PAYMENT_FAILED"
  ).length

  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
        {/* Breadcrumb and Header */}
        <div className="flex flex-col gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/store-admin/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
              <p className="text-muted-foreground text-sm">
                {totalOrders} orders
                {needsReviewCount > 0 && (
                  <span className="text-amber-600 dark:text-amber-400">
                    {" "}
                    • {needsReviewCount} awaiting review
                  </span>
                )}
                {paymentFailedCount > 0 && (
                  <span className="text-destructive">
                    {" "}
                    • {paymentFailedCount} payment failed
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Orders with Tabs and Table */}
        <OrdersContent orders={orders} />
      </div>
    </>
  )
}
