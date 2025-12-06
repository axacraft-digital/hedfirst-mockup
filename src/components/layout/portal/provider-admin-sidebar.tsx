import {
  IconCalendar,
  IconClipboardList,
  IconLayoutDashboard,
  IconMessage,
  IconStethoscope,
  IconUsers,
} from "@tabler/icons-react"
import { Stethoscope } from "lucide-react"
import { type SidebarData } from "../types"

export const providerAdminSidebar: SidebarData = {
  user: {
    name: "Dr. Michelle Chen",
    email: "dr.chen@hedfirst.com",
    avatar: "/avatars/avatar-2.png",
  },
  teams: [
    {
      name: "Hedfirst",
      logo: Stethoscope,
      plan: "Provider Portal",
    },
  ],
  navGroups: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/provider-admin/dashboard",
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: "Clinical",
      items: [
        {
          title: "Patient Queue",
          url: "/provider-admin/queue",
          icon: IconClipboardList,
          badge: "5",
        },
        {
          title: "My Patients",
          url: "/provider-admin/patients",
          icon: IconUsers,
        },
        {
          title: "Consultations",
          url: "/provider-admin/consultations",
          icon: IconStethoscope,
        },
        {
          title: "Appointments",
          url: "/provider-admin/appointments",
          icon: IconCalendar,
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          title: "Messages",
          url: "/provider-admin/messages",
          icon: IconMessage,
          badge: "3",
        },
      ],
    },
  ],
}
