"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { IconChevronDown } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export type DateFilter = "7d" | "today" | "yesterday" | "30d" | "all"
export type SortOption = "newest" | "oldest" | "amount-high" | "waiting-longest"
export type ContainsFilter = "prescription" | "membership" | "lab-kit" | "appointment"

interface Props {
  dateFilter: DateFilter
  sortOption: SortOption
  containsFilters: ContainsFilter[]
  onDateFilterChange: (value: DateFilter) => void
  onSortChange: (value: SortOption) => void
  onContainsChange: (values: ContainsFilter[]) => void
}

const dateOptions: { value: DateFilter; label: string }[] = [
  { value: "7d", label: "Last 7 Days" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "30d", label: "Last 30 Days" },
  { value: "all", label: "All Time" },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "amount-high", label: "Amount (High to Low)" },
  { value: "waiting-longest", label: "Waiting Longest" },
]

const containsOptions: { value: ContainsFilter; label: string }[] = [
  { value: "prescription", label: "Prescription" },
  { value: "membership", label: "Membership" },
  { value: "lab-kit", label: "Lab Kit" },
  { value: "appointment", label: "Appointment" },
]

export function OrdersFilters({
  dateFilter,
  sortOption,
  containsFilters,
  onDateFilterChange,
  onSortChange,
  onContainsChange,
}: Props) {
  const toggleContains = (value: ContainsFilter) => {
    if (containsFilters.includes(value)) {
      onContainsChange(containsFilters.filter((v) => v !== value))
    } else {
      onContainsChange([...containsFilters, value])
    }
  }

  const getContainsLabel = () => {
    if (containsFilters.length === 0) return "Contains"
    if (containsFilters.length === 1) {
      return containsOptions.find((o) => o.value === containsFilters[0])?.label
    }
    return `${containsFilters.length} selected`
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[140px] justify-between font-normal",
              containsFilters.length > 0 && "border-primary"
            )}
          >
            <span className="truncate">{getContainsLabel()}</span>
            <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-3" align="end">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Order contains
            </p>
            <div className="space-y-2">
              {containsOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={containsFilters.includes(option.value)}
                    onCheckedChange={() => toggleContains(option.value)}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
            {containsFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => onContainsChange([])}
              >
                Clear
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Select value={dateFilter} onValueChange={onDateFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {dateOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortOption} onValueChange={onSortChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
