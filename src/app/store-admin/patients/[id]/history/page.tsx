"use client"

import { use } from "react"
import {
  IconClipboardCheck,
  IconCreditCard,
  IconFileCheck,
  IconId,
  IconLogin,
  IconRefresh,
  IconShield,
  IconShoppingCart,
  IconStethoscope,
  IconUser,
  IconUserEdit,
  IconX,
} from "@tabler/icons-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Event types
type EventCategory =
  | "account"
  | "clinical"
  | "payment"
  | "order"
  | "subscription"
  | "compliance"

type EventType =
  | "ACCOUNT_CREATED"
  | "USER_LOGGED_IN"
  | "DEMOGRAPHIC_DATA_UPDATED"
  | "CONSENT_ADDED"
  | "IDENTITY_VERIFICATION_COMPLETED"
  | "MEDICAL_QUESTIONNAIRE_COMPLETED"
  | "PATIENT_ACCEPTED_BY_DOCTOR"
  | "SUBSCRIPTION_CREATED"
  | "SUBSCRIPTION_APPROVED"
  | "SUBSCRIPTION_CANCELED"
  | "ORDER_PLACED"
  | "PAYMENT_METHOD_ADDED"
  | "PAYMENT_STATUS_UPDATED"

interface ActivityEvent {
  id: string
  patientId: string
  type: EventType
  description: string
  timestamp: string
}

// Mock activity history
const mockActivityHistory: ActivityEvent[] = [
  {
    id: "evt_001",
    patientId: "usr_pat001",
    type: "SUBSCRIPTION_CANCELED",
    description: "Subscription canceled",
    timestamp: "2025-12-02T14:38:00Z",
  },
  {
    id: "evt_002",
    patientId: "usr_pat001",
    type: "USER_LOGGED_IN",
    description: "User logged in successfully",
    timestamp: "2025-12-01T19:09:00Z",
  },
  {
    id: "evt_003",
    patientId: "usr_pat001",
    type: "PAYMENT_STATUS_UPDATED",
    description: "Payment status updated",
    timestamp: "2025-11-19T09:00:00Z",
  },
  {
    id: "evt_004",
    patientId: "usr_pat001",
    type: "PAYMENT_STATUS_UPDATED",
    description: "Payment status updated",
    timestamp: "2025-11-17T17:00:00Z",
  },
  {
    id: "evt_005",
    patientId: "usr_pat001",
    type: "SUBSCRIPTION_APPROVED",
    description: "Subscription approved",
    timestamp: "2025-11-17T07:44:00Z",
  },
  {
    id: "evt_006",
    patientId: "usr_pat001",
    type: "PATIENT_ACCEPTED_BY_DOCTOR",
    description: "Patient accepted by a doctor",
    timestamp: "2025-11-17T07:22:00Z",
  },
  {
    id: "evt_007",
    patientId: "usr_pat001",
    type: "MEDICAL_QUESTIONNAIRE_COMPLETED",
    description: "Including allergies and current medications",
    timestamp: "2025-11-16T17:24:00Z",
  },
  {
    id: "evt_008",
    patientId: "usr_pat001",
    type: "IDENTITY_VERIFICATION_COMPLETED",
    description: "Required for prescription compliance",
    timestamp: "2025-11-16T17:12:00Z",
  },
  {
    id: "evt_009",
    patientId: "usr_pat001",
    type: "DEMOGRAPHIC_DATA_UPDATED",
    description: "Demographic details updated",
    timestamp: "2025-11-16T17:05:00Z",
  },
  {
    id: "evt_010",
    patientId: "usr_pat001",
    type: "PAYMENT_METHOD_ADDED",
    description: "New payment method added",
    timestamp: "2025-11-16T17:00:00Z",
  },
  {
    id: "evt_011",
    patientId: "usr_pat001",
    type: "ORDER_PLACED",
    description: "Order placed",
    timestamp: "2025-11-16T17:00:00Z",
  },
  {
    id: "evt_012",
    patientId: "usr_pat001",
    type: "SUBSCRIPTION_CREATED",
    description: "New subscription created",
    timestamp: "2025-11-16T17:00:00Z",
  },
  {
    id: "evt_013",
    patientId: "usr_pat001",
    type: "CONSENT_ADDED",
    description: "New consent added",
    timestamp: "2025-11-16T17:00:00Z",
  },
  {
    id: "evt_014",
    patientId: "usr_pat001",
    type: "SUBSCRIPTION_CREATED",
    description: "New subscription created",
    timestamp: "2025-11-16T16:54:00Z",
  },
  {
    id: "evt_015",
    patientId: "usr_pat001",
    type: "CONSENT_ADDED",
    description: "New consent added",
    timestamp: "2025-11-16T16:54:00Z",
  },
  {
    id: "evt_016",
    patientId: "usr_pat001",
    type: "ACCOUNT_CREATED",
    description: "Account created",
    timestamp: "2025-11-16T16:54:00Z",
  },
]

// Get activity history by patient ID
function getActivityByPatientId(patientId: string): ActivityEvent[] {
  return mockActivityHistory
    .filter((evt) => evt.patientId === patientId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
}

// Event type configuration
const eventConfig: Record<
  EventType,
  {
    label: string
    category: EventCategory
    icon: typeof IconUser
  }
> = {
  ACCOUNT_CREATED: {
    label: "Account Created",
    category: "account",
    icon: IconUser,
  },
  USER_LOGGED_IN: {
    label: "User Logged In",
    category: "account",
    icon: IconLogin,
  },
  DEMOGRAPHIC_DATA_UPDATED: {
    label: "Demographics Updated",
    category: "account",
    icon: IconUserEdit,
  },
  CONSENT_ADDED: {
    label: "Consent Added",
    category: "compliance",
    icon: IconFileCheck,
  },
  IDENTITY_VERIFICATION_COMPLETED: {
    label: "Identity Verified",
    category: "compliance",
    icon: IconId,
  },
  MEDICAL_QUESTIONNAIRE_COMPLETED: {
    label: "Questionnaire Completed",
    category: "clinical",
    icon: IconClipboardCheck,
  },
  PATIENT_ACCEPTED_BY_DOCTOR: {
    label: "Accepted by Doctor",
    category: "clinical",
    icon: IconStethoscope,
  },
  SUBSCRIPTION_CREATED: {
    label: "Subscription Created",
    category: "subscription",
    icon: IconRefresh,
  },
  SUBSCRIPTION_APPROVED: {
    label: "Subscription Approved",
    category: "subscription",
    icon: IconShield,
  },
  SUBSCRIPTION_CANCELED: {
    label: "Subscription Canceled",
    category: "subscription",
    icon: IconX,
  },
  ORDER_PLACED: {
    label: "Order Placed",
    category: "order",
    icon: IconShoppingCart,
  },
  PAYMENT_METHOD_ADDED: {
    label: "Payment Method Added",
    category: "payment",
    icon: IconCreditCard,
  },
  PAYMENT_STATUS_UPDATED: {
    label: "Payment Updated",
    category: "payment",
    icon: IconCreditCard,
  },
}

// Category colors
const categoryColors: Record<EventCategory, string> = {
  account: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
  clinical:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400",
  payment:
    "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
  order: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400",
  subscription: "bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400",
  compliance: "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400",
}

// Format timestamp
function formatTimestamp(isoString: string): { date: string; time: string } {
  const d = new Date(isoString)
  return {
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(d),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(d),
  }
}

interface Props {
  params: Promise<{ id: string }>
}

export default function PatientHistoryPage({ params }: Props) {
  const { id } = use(params)
  const activities = getActivityByPatientId(id)

  return (
    <div className="flex flex-1 flex-col">
      <div>
        <h3 className="text-lg font-medium">Activity History</h3>
        <p className="text-muted-foreground text-sm">
          Audit trail of patient account activity and system events.
        </p>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="faded-bottom -mx-4 flex-1 scroll-smooth px-4 md:pb-16">
        <div className="relative mx-auto max-w-2xl">
          {/* Timeline line */}
          <div className="bg-border absolute top-0 left-5 h-full w-px" />

          {/* Events */}
          <div className="space-y-6">
            {activities.map((event, index) => {
              const config = eventConfig[event.type]
              const Icon = config.icon
              const colorClass = categoryColors[config.category]
              const { date, time } = formatTimestamp(event.timestamp)
              const _isLast = index === activities.length - 1

              return (
                <div key={event.id} className="relative flex gap-4 pl-1">
                  {/* Icon */}
                  <div
                    className={cn(
                      "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
                      colorClass
                    )}
                  >
                    <Icon className="size-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium">{config.label}</span>
                      <span className="text-muted-foreground text-sm">
                        {date} at {time}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {event.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* End marker */}
          <div className="relative mt-6 flex items-center gap-4 pl-1">
            <div className="bg-muted relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full">
              <div className="bg-muted-foreground size-2 rounded-full" />
            </div>
            <span className="text-muted-foreground text-sm">
              Beginning of activity history
            </span>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
