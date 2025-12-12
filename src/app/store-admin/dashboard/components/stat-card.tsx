"use client"

import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconCurrencyDollar,
  IconInfoCircle,
  IconReceipt,
  IconRepeat,
  IconStethoscope,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react"
import { Line, LineChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { StatCardData, StatIconName } from "../data/dashboard-data"

const iconMap: Record<StatIconName, typeof IconCurrencyDollar> = {
  "currency-dollar": IconCurrencyDollar,
  receipt: IconReceipt,
  users: IconUsers,
  stethoscope: IconStethoscope,
  "user-plus": IconUserPlus,
  repeat: IconRepeat,
}

interface StatCardProps extends StatCardData {
  className?: string
}

export function StatCard({
  label,
  description,
  value,
  type,
  percentage,
  chartData,
  strokeColor,
  iconName,
  className,
}: StatCardProps) {
  const Icon = iconMap[iconName]
  const chartConfig = {
    value: {
      label: label,
      color: strokeColor,
    },
  } satisfies ChartConfig

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-5 space-y-0 pt-4 pb-2">
        <CardTitle className="flex items-center gap-2 truncate text-sm font-medium">
          <Icon size={16} />
          {label}
        </CardTitle>
        <TooltipProvider>
          <Tooltip delayDuration={50}>
            <TooltipTrigger>
              <IconInfoCircle className="text-muted-foreground scale-90 stroke-[1.25]" />
              <span className="sr-only">More Info</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex h-[calc(100%_-_48px)] flex-col justify-between py-4">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="text-3xl font-bold">{value}</div>
            <ChartContainer className="h-[40px] w-[70px]" config={chartConfig}>
              <LineChart accessibilityLayer data={chartData}>
                <Line
                  dataKey="value"
                  type="linear"
                  stroke="var(--color-value)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
          <p className="text-muted-foreground text-xs">vs. previous period</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 pt-2">
          <div className="text-muted-foreground text-sm">Trend</div>
          <div
            className={cn("flex items-center gap-1", {
              "text-emerald-500 dark:text-emerald-400": type === "up",
              "text-red-500 dark:text-red-400": type === "down",
              "text-muted-foreground": type === "neutral",
            })}
          >
            <p className="text-[13px] leading-none font-medium">
              {type === "up" ? "+" : type === "down" ? "-" : ""}
              {percentage}%
            </p>
            {type === "up" ? (
              <IconCaretUpFilled size={18} />
            ) : type === "down" ? (
              <IconCaretDownFilled size={18} />
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatsGridProps {
  stats: StatCardData[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <>
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </>
  )
}
