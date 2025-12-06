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
import { AddUserButton } from "./components/add-user-button"
import { columns } from "./components/users-columns"
import { UsersTable } from "./components/users-table"
import { storeUsers } from "./data/users-data"

export default function StoreUsersPage() {
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
                <BreadcrumbLink asChild>
                  <Link href="/store-admin/settings">Settings</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Users</h1>
              <p className="text-muted-foreground text-sm">
                Manage store administrator accounts
              </p>
            </div>
            <AddUserButton />
          </div>
        </div>

        {/* Users Table */}
        <UsersTable data={storeUsers} columns={columns} />
      </div>
    </>
  )
}
