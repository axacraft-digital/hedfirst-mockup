import { type CSSProperties } from "react"
import { Bell, Monitor, Paintbrush, Palette, UserCog, Wrench } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "./components/sidebar-nav"

const sidebarNavItems = [
  {
    title: "Account",
    href: "/store-admin/settings",
    icon: <Wrench size={18} />,
  },
  {
    title: "Branding",
    href: "/store-admin/settings/branding",
    icon: <Paintbrush size={18} />,
  },
  {
    title: "Appearance",
    href: "/store-admin/settings/appearance",
    icon: <Palette size={18} />,
  },
  {
    title: "Notifications",
    href: "/store-admin/settings/notifications",
    icon: <Bell size={18} />,
  },
  {
    title: "Display",
    href: "/store-admin/settings/display",
    icon: <Monitor size={18} />,
  },
]

interface Props {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: Props) {
  const tenantThemeVariables = {
    "--primary": "#1A56DB",
    "--primary-foreground": "#FFFFFF",
    "--accent": "#E5EDFF",
    "--accent-foreground": "#0F172A",
    "--ring": "#1A56DB",
    "--secondary": "#E5EDFF",
    "--secondary-foreground": "#0F172A",
    "--sidebar-primary": "#1A56DB",
    "--sidebar-primary-foreground": "#FFFFFF",
    "--sidebar-accent": "#E5EDFF",
    "--sidebar-accent-foreground": "#0F172A",
    "--sidebar-ring": "#1A56DB",
  } as CSSProperties

  return (
    <>
      <Header />
      <div
        className="space-y-6 p-4 md:p-6"
        data-tenant="hedfirst"
        style={tenantThemeVariables}
      >
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your store settings and preferences.
          </p>
        </div>
        <Separator className="my-4 lg:my-6" />
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="top-0 lg:sticky lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex w-full overflow-y-hidden p-1">{children}</div>
        </div>
      </div>
    </>
  )
}
