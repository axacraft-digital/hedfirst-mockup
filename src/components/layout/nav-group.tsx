"use client"

import { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "../ui/badge"
import { NavItem, type NavGroup } from "./types"

export function NavGroup({ title, items }: NavGroup) {
  const { setOpenMobile } = useSidebar()
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (!item.items) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={checkIsActive(pathname, item, true)}
                  tooltip={item.title}
                >
                  <Link href={item.url} onClick={() => setOpenMobile(false)}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge && <NavBadge>{item.badge}</NavBadge>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={checkIsActive(pathname, item, true)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge && <NavBadge>{item.badge}</NavBadge>}
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent">
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={checkIsActive(pathname, subItem)}
                        >
                          <Link
                            href={subItem.url}
                            onClick={() => setOpenMobile(false)}
                          >
                            {subItem.icon && <subItem.icon />}
                            <span>{subItem.title}</span>
                            {subItem.badge && (
                              <NavBadge>{subItem.badge}</NavBadge>
                            )}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>
)

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  const hrefPath = href.split("?")[0]
  const hrefSegments = hrefPath.split("/")
  const itemSegments = (item.url ?? "").split("/")

  // Exact match
  if (hrefPath === item.url) return true

  // Check if any child nav is active
  if (item?.items?.some((i) => i.url === hrefPath)) return true

  // For main nav items, compare the relevant path segment
  // For portal URLs like /store-admin/dashboard, compare segment at index 2
  // For regular URLs like /dashboard, compare segment at index 1
  if (mainNav) {
    const isPortalUrl = hrefSegments[1]?.endsWith("-admin")
    const segmentIndex = isPortalUrl ? 2 : 1
    return (
      hrefSegments[segmentIndex] !== undefined &&
      hrefSegments[segmentIndex] === itemSegments[segmentIndex]
    )
  }

  return false
}
