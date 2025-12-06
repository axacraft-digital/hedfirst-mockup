import {
  IconBox,
  IconCreditCard,
  IconDiscount,
  IconLayoutDashboard,
  IconMessage,
  IconPill,
  IconReceipt,
  IconSettings,
  IconStethoscope,
  IconUsers,
  IconUserShield,
} from "@tabler/icons-react"
import { Building2 } from "lucide-react"
import { type SidebarData } from "../types"

export const storeAdminSidebar: SidebarData = {
  user: {
    name: "Admin User",
    email: "admin@hedfirst.com",
    avatar: "/avatars/avatar-3.png",
  },
  teams: [
    {
      name: "Hedfirst",
      logo: Building2,
      plan: "Store Admin",
    },
  ],
  navGroups: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/store-admin/dashboard",
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: "Customers",
      items: [
        {
          title: "Patients",
          url: "/store-admin/patients",
          icon: IconUsers,
        },
      ],
    },
    {
      title: "Commerce",
      items: [
        {
          title: "Orders",
          url: "/store-admin/orders",
          icon: IconReceipt,
          badge: "7",
        },
        {
          title: "Products",
          url: "/store-admin/products",
          icon: IconPill,
        },
        {
          title: "Discount Codes",
          url: "/store-admin/discounts",
          icon: IconDiscount,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          title: "Messages",
          url: "/store-admin/messages",
          icon: IconMessage,
          badge: "12",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Store Settings",
          url: "/store-admin/settings",
          icon: IconSettings,
        },
        {
          title: "Users",
          url: "/store-admin/users",
          icon: IconUserShield,
        },
        {
          title: "Providers",
          url: "/store-admin/providers",
          icon: IconStethoscope,
        },
        {
          title: "Pharmacies",
          url: "/store-admin/pharmacies",
          icon: IconBox,
        },
        {
          title: "Billing",
          url: "/store-admin/billing",
          icon: IconCreditCard,
        },
      ],
    },
  ],
}
