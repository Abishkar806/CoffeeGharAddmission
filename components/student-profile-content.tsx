"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import { Printer } from "lucide-react"
import DeleteStudentButton from "@/components/delete-student-button"
import PaymentButton from "@/components/payment-button"
import { Button } from "@/components/ui/button"

interface StudentProfileContentProps {
  student: any
}

export default function StudentProfileContent({ student }: StudentProfileContentProps) {
  // Calculate total fee (no need to subtract materials fee anymore)
  const totalFee = student.totalFee
  const isPaid = student.paymentStatus === "Paid"

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#6f4e37]">{student.name}</h2>
        <DeleteStudentButton id={student.id} name={student.name} />
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="bg-[#c8a27a] text-white">
              <CardTitle className="text-2xl">Student Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="text-lg font-medium">{student.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                    <p className="text-lg">{student.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                    <p className="text-lg">{student.contactNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Education Level</h3>
                    <p className="text-lg">{student.grade}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="text-lg">{student.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Application Date</h3>
                    <p className="text-lg">{formatDate(student.createdAt)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                    <p className="text-lg font-mono text-sm">{student.id}</p>
                  </div>
                  {student.remarks && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Remarks</h3>
                      <p className="text-lg">{student.remarks}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader className="bg-[#c8a27a] text-white">
              <CardTitle className="text-2xl">Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {Array.isArray(student.courses) && student.courses.length > 0 ? (
                  student.courses.map((course, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-medium">{course.name}</h3>
                          <p className="text-gray-500 mt-1">{getCourseDescription(course.name)}</p>
                        </div>
                        <Badge className="bg-[#6f4e37]">Enrolled</Badge>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                          <p>1 month</p> {/* Changed to 1 month for all courses */}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Fee</h4>
                          <span>Rs. {course.fee?.toLocaleString() || "0"}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Status</h4>
                          <Badge
                            variant="outline"
                            className={
                              isPaid
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }
                          >
                            {isPaid ? "Paid" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No courses enrolled</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader className="bg-[#c8a27a] text-white">
              <CardTitle className="text-2xl">Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-medium">Payment Summary</h3>
                  <div className="mt-4 space-y-2">
                    {Array.isArray(student.courses) &&
                      student.courses.map((course, index) => (
                        <div key={index} className="flex justify-between py-2 border-b">
                          <span>{course.name} Course Fee</span>
                          <span className="font-medium">Rs. {course.fee?.toLocaleString() || "0"}</span>
                        </div>
                      ))}
                    <div className="flex justify-between py-2 border-b">
                      <span>Admission Fee</span>
                      <span className="font-medium">Rs. {student.admissionFee?.toLocaleString() || "0"}</span>
                    </div>
                    <div className="flex justify-between py-3 font-bold">
                      <span>Total Amount</span>
                      <span className="text-[#6f4e37]">Rs. {totalFee.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-xl font-medium">Payment Status</h3>
                  <div className="mt-4">
                    <Badge
                      variant="outline"
                      className={
                        isPaid
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      {isPaid ? "Paid" : "Pending"}
                    </Badge>
                    <p className="mt-2 text-gray-600">
                      {isPaid
                        ? `Payment of Rs. ${student.paidAmount?.toLocaleString() || "0"} received.`
                        : "Your payment is pending. Please complete the payment to confirm your enrollment."}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  {!isPaid && <PaymentButton student={{ ...student, totalFee: totalFee }} />}
                  {isPaid && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => window.open(`/print-invoice/${student.id}`, "_blank")}
                    >
                      <Printer className="h-4 w-4" />
                      Print Invoice
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions for course information
function getCourseDescription(course: string): string {
  const descriptions: Record<string, string> = {
    Barista: "Learn the art of coffee making, from espresso to latte art",
    Bakery: "Master the techniques of baking breads, pastries, and desserts",
    Bartender: "Discover mixology and the craft of creating signature cocktails",
  }
  return descriptions[course] || "Course description not available"
}
