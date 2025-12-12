import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { cn } from "@/lib/utils"

interface Props {
  children: React.ReactNode
}

export default async function StoreAdminLayout({ children }: Props) {
  const cookieStore = await cookies()
  const defaultClose = cookieStore.get("sidebar:state")?.value === "false"
  return (
    <div className="border-grid flex flex-1 flex-col">
      <SidebarProvider defaultOpen={!defaultClose}>
        <AppSidebar portal="store-admin" />
        <div
          id="content"
          className={cn(
            "flex h-full w-full flex-col",
            "has-[div[data-layout=fixed]]:h-svh",
            "group-data-[scroll-locked=1]/body:h-full",
            "has-[data-layout=fixed]:group-data-[scroll-locked=1]/body:h-svh"
          )}
        >
          {children}
        </div>
      </SidebarProvider>
    </div>
  )
}
