import Link from "next/link"
import {
  IconCalendar,
  IconClipboardList,
  IconCreditCard,
  IconFileText,
  IconHistory,
  IconMessage,
  IconNotes,
  IconPill,
  IconReceipt,
  IconRobot,
  IconStethoscope,
  IconUserCircle,
  IconVideo,
} from "@tabler/icons-react"
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
  // Ordered by workflow: Identity/Intake → Clinical → Communication → Financial → Utility
  const sidebarNavItems = [
    // Identity & Intake
    {
      title: "Patient Overview",
      icon: <IconUserCircle />,
      href: `/store-admin/patients/${id}`,
    },
    {
      title: "Questionnaires",
      icon: <IconClipboardList />,
      href: `/store-admin/patients/${id}/questionnaires`,
    },
    {
      title: "Documents",
      icon: <IconFileText />,
      href: `/store-admin/patients/${id}/documents`,
    },
    // Clinical
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
      title: "Consultations",
      icon: <IconVideo />,
      href: `/store-admin/patients/${id}/consultations`,
    },
    {
      title: "Notes",
      icon: <IconNotes />,
      href: `/store-admin/patients/${id}/notes`,
    },
    // Communication
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
    // Financial
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
    // Utility
    {
      title: "AI Assistant",
      icon: <IconRobot />,
      href: `/store-admin/patients/${id}/ai-assistant`,
    },
    {
      title: "History",
      icon: <IconHistory />,
      href: `/store-admin/patients/${id}/history`,
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
