"use client"

import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { IntegrationDetail } from "../data/integration-details"

interface AIMonitoringTabProps {
  integration: IntegrationDetail
}

const chartConfig = {
  cost: {
    label: "Cost",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatUseCase(useCase: string): string {
  return useCase
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatModel(model: string): string {
  // Extract the human-readable part of the model name
  if (model.includes("opus")) return "Opus 4.5"
  if (model.includes("sonnet-4")) return "Sonnet 4.5"
  if (model.includes("sonnet")) return "Sonnet 3.5"
  if (model.includes("haiku")) return "Haiku 3.5"
  if (model.includes("gpt-4o-mini")) return "GPT-4o Mini"
  if (model.includes("gpt-4o")) return "GPT-4o"
  if (model.includes("gpt-4")) return "GPT-4"
  if (model.includes("gemini-2")) return "Gemini 2.0"
  if (model.includes("gemini-1.5-pro")) return "Gemini Pro"
  if (model.includes("gemini-1.5-flash")) return "Gemini Flash"
  return model.split("-").slice(0, 2).join(" ")
}

export function AIMonitoringTab({ integration }: AIMonitoringTabProps) {
  const monitoring = integration.aiMonitoring
  const safety = integration.aiSafety

  if (!monitoring) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No monitoring data available</p>
      </div>
    )
  }

  const { stats, costData, recentRequests } = monitoring

  // Calculate budget percentage
  const budgetPercentage = safety
    ? (stats.costThisMonth / safety.costControls.monthlyLimit) * 100
    : 0

  // Format chart data for display
  const chartData = costData.map((item) => ({
    date: formatDate(item.date),
    cost: item.cost / 100, // Convert to dollars for chart
    requests: item.requests,
  }))

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Requests Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Requests Today
            </CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.requestsToday.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats.requestsThisMonth.toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        {/* Cost Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Today</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.costToday)}
            </div>
            <p className="text-muted-foreground text-xs">
              {formatCurrency(stats.costThisMonth)} this month
            </p>
          </CardContent>
        </Card>

        {/* Avg Latency */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgLatency}ms</div>
            <p className="text-muted-foreground text-xs">
              {stats.successRate}% success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      {safety && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Monthly Budget Usage
              </CardTitle>
              <span className="text-muted-foreground text-sm">
                {formatCurrency(stats.costThisMonth)} /{" "}
                {formatCurrency(safety.costControls.monthlyLimit)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={budgetPercentage} className="h-2" />
            <p className="text-muted-foreground mt-2 text-xs">
              {budgetPercentage.toFixed(1)}% of monthly limit used
              {budgetPercentage >= safety.costControls.alertThreshold && (
                <span className="ml-2 text-yellow-600">
                  (Alert threshold: {safety.costControls.alertThreshold}%)
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Cost & Usage Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Cost Trend</CardTitle>
          <CardDescription>
            Spending over the last {chartData.length} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      `$${Number(value).toFixed(2)}`,
                      "Cost",
                    ]}
                  />
                }
              />
              <Bar
                dataKey="cost"
                fill="var(--color-cost)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Recent Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
          <CardDescription>
            Last {recentRequests.length} API requests with performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Use Case</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Latency</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-xs">
                    {formatTimestamp(request.timestamp)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatModel(request.model)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatUseCase(request.useCase)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {request.tokens.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {formatCurrency(request.cost)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {request.latency}ms
                  </TableCell>
                  <TableCell>
                    {request.status === "success" ? (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Success
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                      >
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Error
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
