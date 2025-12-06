"use client"

import { useState } from "react"
import { IconCalendar } from "@tabler/icons-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardActions() {
  const [dateFrom, setDateFrom] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  )
  const [dateTo, setDateTo] = useState<Date>(new Date())

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Range Picker */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <IconCalendar size={16} />
              {format(dateFrom, "MMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={(date) => date && setDateFrom(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <span className="text-muted-foreground">to</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <IconCalendar size={16} />
              {format(dateTo, "MMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={(date) => date && setDateTo(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Quick Presets */}
      <Select defaultValue="30d">
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>

      {/* Period Toggle */}
      <Tabs defaultValue="day" className="hidden md:block">
        <TabsList>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
