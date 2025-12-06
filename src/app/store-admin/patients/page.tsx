"use client"

import { useMemo, useState } from "react"
import { IconUserPlus } from "@tabler/icons-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"
import {
  patients,
  providers,
  getProviderDisplayName,
} from "@/data"
import type { Patient, PatientStatus } from "@/data/types"
import { columns } from "./components/patients-columns"
import { PatientsTable } from "./components/patients-table"

type TabValue = "all" | PatientStatus

interface TabConfig {
  value: TabValue
  label: string
  getCount: (data: Patient[]) => number
}

const tabs: TabConfig[] = [
  {
    value: "all",
    label: "All Patients",
    getCount: (data) => data.length,
  },
  {
    value: "AWAITING_REVIEW",
    label: "Awaiting Review",
    getCount: (data) => data.filter((p) => p.patientStatus === "AWAITING_REVIEW").length,
  },
  {
    value: "NEEDS_ATTENTION",
    label: "Needs Attention",
    getCount: (data) => data.filter((p) => p.patientStatus === "NEEDS_ATTENTION").length,
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    getCount: (data) => data.filter((p) => p.patientStatus === "IN_PROGRESS").length,
  },
  {
    value: "ACTIVE",
    label: "Active",
    getCount: (data) => data.filter((p) => p.patientStatus === "ACTIVE").length,
  },
]

export default function PatientsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("all")
  const [selectedProvider, setSelectedProvider] = useState<string>("all")

  // Filter patients by provider first
  const providerFilteredPatients = useMemo(() => {
    if (selectedProvider === "all") return patients
    return patients.filter((p) => p.assignedProviderId === selectedProvider)
  }, [selectedProvider])

  // Then filter by tab/status
  const filteredPatients = useMemo(() => {
    if (activeTab === "all") return providerFilteredPatients
    return providerFilteredPatients.filter((p) => p.patientStatus === activeTab)
  }, [activeTab, providerFilteredPatients])

  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
        {/* Breadcrumb and Header */}
        <div className="flex flex-col gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/store-admin/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Patients</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
              <p className="text-muted-foreground text-sm">
                Manage and review patient accounts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-[200px] gap-2 text-sm">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Provider</SelectLabel>
                    <SelectItem value="all">All Providers</SelectItem>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {getProviderDisplayName(provider)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button className="space-x-1">
                <span>Create Patient</span>
                <IconUserPlus size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          <TabsList className="border-muted flex h-auto w-full items-center justify-start rounded-none border-b bg-transparent p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:border-primary rounded-none border-b-2 border-transparent py-2 shadow-none data-[state=active]:shadow-none"
              >
                {tab.label}
                <span className="bg-muted text-muted-foreground ml-2 rounded-full px-2 py-0.5 text-xs">
                  {tab.getCount(providerFilteredPatients)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              <PatientsTable data={filteredPatients} columns={columns} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  )
}
