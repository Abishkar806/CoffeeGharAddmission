"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { PlusCircle, Trash2, AlertCircle, ArrowLeft, Coffee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { submitAdmissionForm } from "@/app/actions"
import { toast } from "@/components/ui/use-toast"

const courseOptions = ["Barista", "Bakery", "Bartender"]

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  contactNumber: z.string().min(10, { message: "Please enter a valid contact number." }),
  grade: z.string().min(1, { message: "Grade is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  courses: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Course name is required." }),
        fee: z.coerce.number().min(0, { message: "Fee must be a positive number." }),
      }),
    )
    .min(1, { message: "At least one course is required." }),
  admissionFee: z.coerce.number().min(0, { message: "Admission fee must be a positive number." }),
  remarks: z.string().optional(),
})

export default function AdmissionsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      contactNumber: "",
      grade: "",
      email: "",
      courses: [{ name: "", fee: 0 }],
      admissionFee: 0, // Changed to 0 as requested
      remarks: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "courses",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      setSubmissionError(null)

      // Filter out empty courses
      const filteredValues = {
        ...values,
        courses: values.courses.filter((course) => course.name !== ""),
        // Set materialsFee to 0 since we removed the field
        materialsFee: 0,
      }

      const result = await submitAdmissionForm(filteredValues)

      if (result.success) {
        toast({
          title: "Application Submitted",
          description: "Your admission application has been successfully submitted.",
        })
        router.push(`/users/${result.id}`)
      } else {
        setSubmissionError(result.error || "There was an error submitting your application.")
        toast({
          title: "Submission Failed",
          description: result.error || "There was an error submitting your application.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setSubmissionError("An unexpected error occurred. Please try again.")
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addCourse = () => {
    append({ name: "", fee: 0 })
  }

  // Calculate total fee
  const calculateTotal = () => {
    const values = form.getValues()
    let total = values.admissionFee
    values.courses.forEach((course) => {
      total += course.fee
    })
    return total
  }

  // Set course name but don't set default fee
  const handleCourseSelect = (value: string, index: number) => {
    form.setValue(`courses.${index}.name`, value)
    // No longer setting default fee values
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <header className="bg-[#6f4e37] text-white p-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1 text-white hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <span className="text-white/50">|</span>
            <h1 className="text-2xl font-bold flex items-center">
              <Coffee className="h-5 w-5 mr-2" /> Coffee Ghar Admissions
            </h1>
          </div>
          {/* Removed "Start your journey in culinary arts" */}
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="bg-[#c8a27a] text-white">
            <CardTitle className="text-2xl">Student Admission Form</CardTitle>
            <CardDescription className="text-white/90">Please fill out all required fields to apply</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {submissionError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submissionError}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your complete address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade/Education Level</FormLabel>
                        <FormControl>
                          <Input placeholder="12th/Bachelor's/Master's" {...field} />
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
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Courses & Fees</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCourse}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Course
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2 mb-4">
                      <div className="flex-1 space-y-2">
                        <FormField
                          control={form.control}
                          name={`courses.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="sr-only">Course</FormLabel>
                              <Select onValueChange={(value) => handleCourseSelect(value, index)} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent>
                                  {courseOptions.map((course) => (
                                    <SelectItem key={course} value={course}>
                                      {course}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="w-1/3">
                        <FormField
                          control={form.control}
                          name={`courses.${index}.fee`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="sr-only">Fee</FormLabel>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    className="pl-9"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e.target.valueAsNumber || 0)
                                    }}
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-10 w-10 text-red-500 mt-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {form.formState.errors.courses && typeof form.formState.errors.courses.message === "string" && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.courses.message}</p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="admissionFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admission Fee</FormLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="pl-9"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.valueAsNumber || 0)
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Fee:</span>
                    <span className="text-xl font-bold text-[#6f4e37]">Rs. {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional information you'd like to share" {...field} />
                      </FormControl>
                      <FormDescription>Optional: Share any relevant information about your application</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#6f4e37] hover:bg-[#5d4130]" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
