"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OrderWithPatient } from "../data/orders-types"

export type OrderTab =
  | "all"
  | "needs-review"
  | "payment-failed"
  | "labs-ready"
  | "denied"

interface TabConfig {
  id: OrderTab
  label: string
  badgeVariant?: "destructive" | "outline"
}

const tabs: TabConfig[] = [
  { id: "all", label: "All" },
  { id: "needs-review", label: "Needs Review", badgeVariant: "outline" },
  {
    id: "payment-failed",
    label: "Payment Failed",
    badgeVariant: "destructive",
  },
  { id: "labs-ready", label: "Labs Ready", badgeVariant: "outline" },
  { id: "denied", label: "Denied", badgeVariant: "destructive" },
]

interface Props {
  orders: OrderWithPatient[]
  activeTab: OrderTab
  onTabChange: (tab: OrderTab) => void
}

// Get count for each tab
function getTabCount(orders: OrderWithPatient[], tabId: OrderTab): number {
  switch (tabId) {
    case "all":
      return orders.length
    case "needs-review":
      return orders.filter((o) => o.status === "AWAITING_REVIEW").length
    case "payment-failed":
      return orders.filter((o) => o.status === "PAYMENT_FAILED").length
    case "labs-ready":
      // Orders where a lab kit has results received but prescription is still pending
      return orders.filter(
        (o) =>
          o.children?.some(
            (c) => c.productType === "LAB_TEST" && c.labResultsReceivedAt
          ) &&
          o.children?.some(
            (c) =>
              c.productType === "PHYSICAL_PRODUCT" &&
              c.status === "AWAITING_REVIEW"
          )
      ).length
    case "denied":
      return orders.filter((o) => o.status === "DENIED").length
    default:
      return 0
  }
}

// Filter orders based on active tab
export function filterOrdersByTab(
  orders: OrderWithPatient[],
  tab: OrderTab
): OrderWithPatient[] {
  switch (tab) {
    case "all":
      return orders
    case "needs-review":
      return orders.filter((o) => o.status === "AWAITING_REVIEW")
    case "payment-failed":
      return orders.filter((o) => o.status === "PAYMENT_FAILED")
    case "labs-ready":
      return orders.filter(
        (o) =>
          o.children?.some(
            (c) => c.productType === "LAB_TEST" && c.labResultsReceivedAt
          ) &&
          o.children?.some(
            (c) =>
              c.productType === "PHYSICAL_PRODUCT" &&
              c.status === "AWAITING_REVIEW"
          )
      )
    case "denied":
      return orders.filter((o) => o.status === "DENIED")
    default:
      return orders
  }
}

export function OrdersTabs({ orders, activeTab, onTabChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1">
      {tabs.map((tab) => {
        const count = getTabCount(orders, tab.id)
        const isActive = activeTab === tab.id

        // Don't show tab if count is 0 (except "All")
        if (count === 0 && tab.id !== "all") {
          return null
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-colors",
              "hover:text-foreground",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              {tab.label}
              {tab.id !== "all" && count > 0 && (
                <Badge
                  variant="outline"
                  className={cn(
                    "px-1.5 py-0",
                    tab.badgeVariant === "destructive" &&
                      "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
                    tab.badgeVariant === "outline" &&
                      "border-amber-200 bg-amber-100/50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                  )}
                >
                  {count}
                </Badge>
              )}
            </span>
            {isActive && (
              <span className="bg-primary absolute right-0 bottom-0 left-0 h-0.5" />
            )}
          </button>
        )
      })}
    </div>
  )
}
