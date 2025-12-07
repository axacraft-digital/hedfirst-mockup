"use client"

import { Dispatch, SetStateAction } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(1, "Phone number is required."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  gender: z.string().min(1, "Please select a gender."),
  addressLineOne: z.string().min(1, "Address is required."),
  addressLineTwo: z.string().optional(),
  city: z.string().min(1, "City is required."),
  state: z
    .string()
    .length(2, "State must be a 2-letter abbreviation.")
    .toUpperCase(),
  zipCode: z.string().min(5, "Please enter a valid ZIP code."),
})

type PatientFormValues = z.infer<typeof formSchema>

export function CreatePatientDrawer({ open, setOpen }: Props) {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      addressLineOne: "",
      addressLineTwo: "",
      city: "",
      state: "",
      zipCode: "",
    },
  })

  const onSubmit = (data: PatientFormValues) => {
    setOpen(false)
    form.reset()
    toast({
      title: "Patient created",
      description: `${data.firstName} ${data.lastName} has been added to the system.`,
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          form.clearErrors()
          form.reset()
        }
        setOpen(value)
      }}
    >
      <SheetContent className="flex w-full max-w-none flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Create Patient</SheetTitle>
          <SheetDescription>
            Add a new patient to the system. They will start in &quot;Awaiting
            Review&quot; status.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="patient-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="no-scrollbar -mx-2 flex-1 space-y-5 overflow-y-auto p-2"
          >
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Smith" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="john.smith@example.com"
                    />
                  </FormControl>
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

            {/* DOB and Gender Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address Section */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Address</h4>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="addressLineOne"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123 Main Street" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="addressLineTwo"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>
                        Apt / Suite{" "}
                        <span className="text-muted-foreground font-normal">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Apt 4B" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Austin" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* State and ZIP Row */}
                <div className="grid grid-cols-2 gap-4">
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
                            className="uppercase"
                            maxLength={2}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="78701" maxLength={10} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>

        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button form="patient-form" type="submit">
            Create Patient
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
