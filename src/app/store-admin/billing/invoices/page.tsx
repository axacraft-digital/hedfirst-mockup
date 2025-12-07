import { IconDownload } from "@tabler/icons-react"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock invoice data
const invoices = [
  {
    id: "INV-2024-012",
    date: "Dec 1, 2024",
    amount: 299.0,
    status: "paid" as const,
  },
  {
    id: "INV-2024-011",
    date: "Nov 1, 2024",
    amount: 299.0,
    status: "paid" as const,
  },
  {
    id: "INV-2024-010",
    date: "Oct 1, 2024",
    amount: 299.0,
    status: "paid" as const,
  },
  {
    id: "INV-2024-009",
    date: "Sep 1, 2024",
    amount: 299.0,
    status: "paid" as const,
  },
  {
    id: "INV-2024-008",
    date: "Aug 1, 2024",
    amount: 299.0,
    status: "paid" as const,
  },
  {
    id: "INV-2024-007",
    date: "Jul 1, 2024",
    amount: 249.0,
    status: "paid" as const,
  },
]

const statusConfig = {
  paid: {
    label: "Paid",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-400",
  },
  open: {
    label: "Open",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
}

export default function BillingInvoicesPage() {
  return (
    <>
      <Header />
      <div className="space-y-6 p-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
          <p className="text-muted-foreground">
            Manage your subscription and billing details.
          </p>
        </div>
        <Separator className="shadow-sm" />

        <div className="flex max-w-4xl flex-col space-y-4">
          {/* Filter */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Invoices</h3>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter invoices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invoices</SelectItem>
                <SelectItem value="paid">Paid Invoices</SelectItem>
                <SelectItem value="open">Open Invoices</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoice Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const status = statusConfig[invoice.status]
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={status.className}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <IconDownload className="h-4 w-4" />
                          <span className="sr-only">Download invoice</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}
