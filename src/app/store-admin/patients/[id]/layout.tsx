import {
  IconCalendar,
  IconCreditCard,
  IconFileText,
  IconFlask,
  IconHistory,
  IconLayoutDashboard,
  IconMessage,
  IconNotes,
  IconPill,
  IconReceipt,
  IconRobot,
  IconStethoscope,
  IconUserCircle,
} from "@tabler/icons-react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import PatientSidebarNav from "./components/sidebar-nav"
import { getPatientDetailById } from "./data/patient-detail-data"

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function PatientDetailLayout({ children, params }: Props) {
  const { id } = await params
  const patient = getPatientDetailById(id)

  const patientName = patient
    ? `${patient.generalInfo.firstName} ${patient.generalInfo.lastName}`
    : "Patient"

  // Build nav items with patient ID
  const sidebarNavItems = [
    {
      title: "Patient Overview",
      icon: <IconUserCircle />,
      href: `/store-admin/patients/${id}`,
    },
    {
      title: "Documents",
      icon: <IconFileText />,
      href: `/store-admin/patients/${id}/documents`,
    },
    {
      title: "Notes",
      icon: <IconNotes />,
      href: `/store-admin/patients/${id}/notes`,
    },
    {
      title: "Chart Notes",
      icon: <IconStethoscope />,
      href: `/store-admin/patients/${id}/chart-notes`,
    },
    {
      title: "Treatments",
      icon: <IconPill />,
      href: `/store-admin/patients/${id}/treatments`,
    },
    {
      title: "AI Assistant",
      icon: <IconRobot />,
      href: `/store-admin/patients/${id}/ai`,
    },
    {
      title: "Lab Tests",
      icon: <IconFlask />,
      href: `/store-admin/patients/${id}/lab-tests`,
    },
    {
      title: "Orders",
      icon: <IconReceipt />,
      href: `/store-admin/patients/${id}/orders`,
    },
    {
      title: "Payments",
      icon: <IconCreditCard />,
      href: `/store-admin/patients/${id}/payments`,
    },
    {
      title: "Messages",
      icon: <IconMessage />,
      href: `/store-admin/patients/${id}/messages`,
    },
    {
      title: "Appointments",
      icon: <IconCalendar />,
      href: `/store-admin/patients/${id}/appointments`,
    },
    {
      title: "History",
      icon: <IconHistory />,
      href: `/store-admin/patients/${id}/history`,
    },
    {
      title: "Dashboard",
      icon: <IconLayoutDashboard />,
      href: `/store-admin/patients/${id}/dashboard`,
    },
  ]

  return (
    <>
      <Header />

      <div
        data-layout="fixed"
        className="flex flex-1 flex-col gap-4 overflow-hidden p-4"
      >
        <div className="space-y-0.5">
          <div className="text-muted-foreground text-sm">
            <Link
              href="/store-admin/patients"
              className="hover:text-foreground transition-colors"
            >
              Patients
            </Link>
            {" › "}
            <span className="text-foreground">{patientName}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            {patientName}
          </h1>
        </div>
        <div className="flex flex-1 flex-col space-y-8 overflow-auto md:space-y-2 md:overflow-hidden lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="lg:sticky lg:w-1/5">
            <PatientSidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex w-full overflow-y-scroll p-1 pr-4 md:overflow-y-hidden">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
