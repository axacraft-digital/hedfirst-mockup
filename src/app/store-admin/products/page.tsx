"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  IconPlus,
  IconPill,
  IconMessageCircle,
  IconUser,
  IconTestPipe,
  IconSearch,
} from "@tabler/icons-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import { ProductsTable } from "./components/products-table"
import { products, filterProductsByType, searchProducts } from "./data/products-data"
import type { ProductTabFilter } from "./data/products-types"

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<ProductTabFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = useMemo(() => {
    let result = filterProductsByType(products, activeTab)
    result = searchProducts(result, searchQuery)
    return result
  }, [activeTab, searchQuery])

  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/store-admin/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header row: Title on left, Search + Add button on right */}
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground text-sm">
              Manage your product catalog
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {/* Search input */}
            <div className="relative">
              <IconSearch className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px] pl-9"
              />
            </div>

            {/* Add new product dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add new product
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuItem asChild>
                  <Link href="/store-admin/products/new/physical-product">
                    <IconPill className="mr-2 h-4 w-4" />
                    Physical Product
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/store-admin/products/new/service">
                    <IconMessageCircle className="mr-2 h-4 w-4" />
                    Service
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/store-admin/products/new/membership">
                    <IconUser className="mr-2 h-4 w-4" />
                    Membership
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/store-admin/products/new/lab-test">
                    <IconTestPipe className="mr-2 h-4 w-4" />
                    Lab Test
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ProductTabFilter)}
        >
          <TabsList className="border-muted flex h-auto w-full items-center justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-none border-primary py-2 shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            >
              All Products
            </TabsTrigger>
            <TabsTrigger
              value="physical"
              className="rounded-none border-primary py-2 shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            >
              Physical Products
            </TabsTrigger>
            <TabsTrigger
              value="service"
              className="rounded-none border-primary py-2 shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            >
              Services
            </TabsTrigger>
            <TabsTrigger
              value="membership"
              className="rounded-none border-primary py-2 shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            >
              Memberships
            </TabsTrigger>
            <TabsTrigger
              value="lab-test"
              className="rounded-none border-primary py-2 shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            >
              Lab Tests
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Products table */}
        <ProductsTable products={filteredProducts} />
      </div>
    </>
  )
}
