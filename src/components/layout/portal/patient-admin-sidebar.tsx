import {
  IconCalendar,
  IconCreditCard,
  IconLayoutDashboard,
  IconMessage,
  IconPill,
  IconSettings,
  IconShoppingCart,
  IconUser,
} from "@tabler/icons-react"
import { Heart } from "lucide-react"
import { type SidebarData } from "../types"

export const patientAdminSidebar: SidebarData = {
  user: {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "/avatars/avatar-1.png",
  },
  teams: [
    {
      name: "Hedfirst",
      logo: Heart,
      plan: "Patient Portal",
    },
  ],
  navGroups: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/patient-admin/dashboard",
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: "My Care",
      items: [
        {
          title: "My Orders",
          url: "/patient-admin/orders",
          icon: IconShoppingCart,
        },
        {
          title: "Prescriptions",
          url: "/patient-admin/prescriptions",
          icon: IconPill,
        },
        {
          title: "Appointments",
          url: "/patient-admin/appointments",
          icon: IconCalendar,
        },
        {
          title: "Messages",
          url: "/patient-admin/messages",
          icon: IconMessage,
          badge: "2",
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Profile",
          url: "/patient-admin/profile",
          icon: IconUser,
        },
        {
          title: "Payment Methods",
          url: "/patient-admin/payment-methods",
          icon: IconCreditCard,
        },
        {
          title: "Settings",
          url: "/patient-admin/settings",
          icon: IconSettings,
        },
      ],
    },
  ],
}
