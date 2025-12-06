"use client"

import { useState, useMemo } from "react"
import { OrdersTable } from "./orders-table"
import { OrdersTabs, filterOrdersByTab, type OrderTab } from "./orders-tabs"
import { OrdersFilters, type DateFilter, type SortOption, type ContainsFilter } from "./orders-filters"
import type { OrderWithPatient, ChildOrderProductType } from "../data/orders-types"

interface Props {
  orders: OrderWithPatient[]
}

// Map contains filter values to product types
const containsToProductType: Record<ContainsFilter, ChildOrderProductType> = {
  "prescription": "PHYSICAL_PRODUCT",
  "membership": "MEMBERSHIP",
  "lab-kit": "LAB_TEST",
  "appointment": "APPOINTMENT",
}

// Apply date filter to orders
function filterByDate(orders: OrderWithPatient[], dateFilter: DateFilter): OrderWithPatient[] {
  if (dateFilter === "all") return orders

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let cutoff: Date
  switch (dateFilter) {
    case "today":
      cutoff = today
      break
    case "yesterday":
      cutoff = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      break
    case "7d":
      cutoff = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "30d":
      cutoff = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      return orders
  }

  return orders.filter((order) => new Date(order.createdAt) >= cutoff)
}

// Apply contains filter to orders
function filterByContains(orders: OrderWithPatient[], containsFilters: ContainsFilter[]): OrderWithPatient[] {
  if (containsFilters.length === 0) return orders

  const productTypes = containsFilters.map((f) => containsToProductType[f])

  return orders.filter((order) => {
    // Check children for product types
    if (order.children && order.children.length > 0) {
      return productTypes.some((type) =>
        order.children!.some((child) => child.productType === type)
      )
    }
    // For legacy orders with lineItems, check product name patterns
    if (order.lineItems && order.lineItems.length > 0) {
      // Legacy orders are typically prescriptions
      if (productTypes.includes("PHYSICAL_PRODUCT")) {
        return true
      }
    }
    return false
  })
}

// Sort orders
function sortOrders(orders: OrderWithPatient[], sortOption: SortOption): OrderWithPatient[] {
  const sorted = [...orders]

  switch (sortOption) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case "amount-high":
      return sorted.sort((a, b) => b.amount - a.amount)
    case "waiting-longest":
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    default:
      return sorted
  }
}

export function OrdersContent({ orders }: Props) {
  const [activeTab, setActiveTab] = useState<OrderTab>("all")
  const [dateFilter, setDateFilter] = useState<DateFilter>("all")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [containsFilters, setContainsFilters] = useState<ContainsFilter[]>([])

  const filteredOrders = useMemo(() => {
    let result = filterOrdersByTab(orders, activeTab)
    result = filterByContains(result, containsFilters)
    result = filterByDate(result, dateFilter)
    result = sortOrders(result, sortOption)
    return result
  }, [orders, activeTab, dateFilter, sortOption, containsFilters])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <OrdersTabs
          orders={orders}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <OrdersFilters
          dateFilter={dateFilter}
          sortOption={sortOption}
          containsFilters={containsFilters}
          onDateFilterChange={setDateFilter}
          onSortChange={setSortOption}
          onContainsChange={setContainsFilters}
        />
      </div>
      <OrdersTable orders={filteredOrders} />
    </div>
  )
}
