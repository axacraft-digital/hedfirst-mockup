"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavGroup } from "@/components/layout/nav-group"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import { sidebarData as defaultSidebarData } from "./data/sidebar-data"
import {
  patientAdminSidebar,
  providerAdminSidebar,
  storeAdminSidebar,
} from "./portal"

export type PortalType = "patient-admin" | "provider-admin" | "store-admin"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  portal?: PortalType
}

const portalSidebarMap = {
  "patient-admin": patientAdminSidebar,
  "provider-admin": providerAdminSidebar,
  "store-admin": storeAdminSidebar,
}

export function AppSidebar({ portal, ...props }: AppSidebarProps) {
  const sidebarData = portal ? portalSidebarMap[portal] : defaultSidebarData
  return (
    <div className="relative">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={sidebarData.teams} />
        </SidebarHeader>
        <SidebarContent>
          {sidebarData.navGroups.map((navGroup) => (
            <NavGroup key={navGroup.title} {...navGroup} />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={sidebarData.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  )
}
