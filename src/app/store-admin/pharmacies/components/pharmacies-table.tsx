"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Pharmacy } from "../data/pharmacy-types"

interface Props {
  pharmacies: Pharmacy[]
}

export function PharmaciesTable({ pharmacies }: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pharmacy Name</TableHead>
            <TableHead className="w-[200px]">Pharmacy ID</TableHead>
            <TableHead className="w-[100px]">State</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pharmacies.length > 0 ? (
            pharmacies.map((pharmacy) => (
              <TableRow key={pharmacy.id}>
                <TableCell className="font-medium">{pharmacy.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {pharmacy.externalPharmacyId}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {pharmacy.state}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/store-admin/pharmacies/${pharmacy.id}`}>
                      Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No pharmacies configured.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
