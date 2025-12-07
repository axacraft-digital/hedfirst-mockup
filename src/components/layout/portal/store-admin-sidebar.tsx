import {
  IconBox,
  IconBrain,
  IconCreditCard,
  IconLayoutDashboard,
  IconMessage,
  IconPill,
  IconPlugConnected,
  IconReceipt,
  IconSettings,
  IconStethoscope,
  IconUsers,
  IconUserShield,
} from "@tabler/icons-react"
import { Building2 } from "lucide-react"
import { mockStoreUsers, getStoreUserFullName } from "@/data"
import { type SidebarData } from "../types"

// Get the current logged-in admin user from shared data
const currentUser = mockStoreUsers.find((u) => u.role === "admin") ?? mockStoreUsers[0]

export const storeAdminSidebar: SidebarData = {
  user: {
    name: getStoreUserFullName(currentUser),
    email: currentUser.email,
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
          icon: IconCreditCard,
          items: [
            {
              title: "Plan",
              url: "/store-admin/billing/plan",
            },
            {
              title: "Payment Method",
              url: "/store-admin/billing/payment",
            },
            {
              title: "Invoices",
              url: "/store-admin/billing/invoices",
            },
          ],
        },
        {
          title: "Teligant AI",
          url: "/store-admin/ai",
          icon: IconBrain,
        },
        {
          title: "Integrations",
          url: "/store-admin/integrations",
          icon: IconPlugConnected,
        },
      ],
    },
  ],
}
