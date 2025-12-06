"use client"

import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { topProducts } from "../data/dashboard-data"

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`
}

export function TopProducts() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best performing products by revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="w-[80px] text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((product) => (
              <TableRow key={product.rank}>
                <TableCell className="font-medium">{product.rank}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <Badge variant="outline" className="w-fit text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(product.revenue)}
                </TableCell>
                <TableCell className="text-right">
                  {product.orders.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className={cn("flex items-center justify-end gap-1", {
                      "text-emerald-500 dark:text-emerald-400":
                        product.trend === "up",
                      "text-red-500 dark:text-red-400": product.trend === "down",
                      "text-muted-foreground": product.trend === "neutral",
                    })}
                  >
                    {product.trend === "up" ? (
                      <IconCaretUpFilled size={16} />
                    ) : product.trend === "down" ? (
                      <IconCaretDownFilled size={16} />
                    ) : (
                      <span className="text-xs">—</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
