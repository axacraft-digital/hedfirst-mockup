"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
import { ordersByTypeData } from "../data/dashboard-data"

const chartConfig = {
  firstOrders: {
    label: "First Orders",
    color: "var(--chart-1)",
  },
  recurring: {
    label: "Recurring",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function OrdersChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Orders by Type</CardTitle>
        <CardDescription>
          First-time orders vs recurring subscriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%_-_90px)]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={ordersByTypeData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="firstOrders"
              fill="var(--color-firstOrders)"
              radius={4}
            />
            <Bar dataKey="recurring" fill="var(--color-recurring)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
