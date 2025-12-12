"use client"

import { Dispatch, SetStateAction, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Pharmacy } from "@/data/types"

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  currentPharmacy?: Pharmacy
}

const formSchema = z.object({
  name: z.string().min(1, "Pharmacy name is required."),
  address: z.string().min(1, "Address is required."),
  phone: z.string().min(1, "Phone number is required."),
  pic: z.string().min(1, "Person in charge is required."),
  externalPharmacyId: z.string().min(1, "External pharmacy ID is required."),
  state: z
    .string()
    .length(2, "State must be a 2-letter abbreviation.")
    .toUpperCase(),
})

type PharmacyFormValues = z.infer<typeof formSchema>

export function MutatePharmacy({ open, setOpen, currentPharmacy }: Props) {
  const isEdit = !!currentPharmacy

  const form = useForm<PharmacyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      pic: "",
      externalPharmacyId: "",
      state: "",
    },
  })

  // Reset form when pharmacy changes or dialog opens
  useEffect(() => {
    if (open) {
      if (currentPharmacy) {
        form.reset({
          name: currentPharmacy.name,
          address: currentPharmacy.address,
          phone: currentPharmacy.phone,
          pic: currentPharmacy.pic,
          externalPharmacyId: currentPharmacy.externalPharmacyId,
          state: currentPharmacy.state,
        })
      } else {
        form.reset({
          name: "",
          address: "",
          phone: "",
          pic: "",
          externalPharmacyId: "",
          state: "",
        })
      }
    }
  }, [open, currentPharmacy, form])

  const onSubmit = (data: PharmacyFormValues) => {
    setOpen(false)
    form.reset()
    toast({
      title: isEdit ? "Pharmacy updated" : "Pharmacy added",
      description: isEdit
        ? `${data.name} has been updated.`
        : `${data.name} has been added to your pharmacy partners.`,
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          form.clearErrors()
        }
        setOpen(value)
      }}
    >
      <SheetContent className="flex w-full max-w-none flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit" : "Add"} Pharmacy</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update the pharmacy partner details."
              : "Add a new pharmacy partner for prescription fulfillment."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="pharmacy-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="no-scrollbar -mx-2 flex-1 space-y-5 overflow-y-auto p-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Pharmacy Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Empower Pharmacy" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Full street address including city, state, ZIP"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="TX"
                      className="w-20 uppercase"
                      maxLength={2}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormDescription>2-letter state abbreviation</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="(555) 123-4567" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pic"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Person in Charge</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Pharmacist or main contact name"
                    />
                  </FormControl>
                  <FormDescription>
                    The pharmacist or primary contact at this location
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="externalPharmacyId"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>External Pharmacy ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="DOSESPOT-XXX-001"
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    DoseSpot or integration system identifier
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button form="pharmacy-form" type="submit">
            {isEdit ? "Save changes" : "Add pharmacy"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
