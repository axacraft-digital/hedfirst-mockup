"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
import { revenueChartData } from "../data/dashboard-data"

const chartConfig = {
  revenue: {
    label: "Total Revenue",
    color: "var(--chart-1)",
  },
  subscriptions: {
    label: "Subscription Revenue",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function RevenueChart() {
  // Format data for display (convert cents to dollars for tooltip)
  const formattedData = revenueChartData.map((item) => ({
    ...item,
    revenueDisplay: item.revenue,
    subscriptionsDisplay: item.subscriptions,
  }))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Total revenue vs subscription revenue (last 8 months)
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%_-_90px)]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const numValue = Number(value)
                    return [
                      `$${(numValue / 100).toLocaleString()}`,
                      name === "revenue" ? "Total Revenue" : "Subscriptions",
                    ]
                  }}
                />
              }
            />
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillSubscriptions"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-subscriptions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-subscriptions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="subscriptions"
              type="natural"
              fill="url(#fillSubscriptions)"
              fillOpacity={0.4}
              stroke="var(--color-subscriptions)"
              stackId="a"
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
