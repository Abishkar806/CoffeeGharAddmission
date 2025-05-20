"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { Printer } from "lucide-react"
import DeleteStudentButton from "@/components/delete-student-button"
import { Badge } from "@/components/ui/badge"

interface StudentTableContentProps {
  students: any[]
}

export default function StudentTableContent({ students }: StudentTableContentProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead>Total Fee</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No students found. Be the first to apply!
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name || "—"}</TableCell>
                <TableCell>{student.email || "—"}</TableCell>
                <TableCell>{student.contactNumber || "—"}</TableCell>
                <TableCell>
                  {Array.isArray(student.courses) ? student.courses.map((c) => c.name).join(", ") : "—"}
                </TableCell>
                <TableCell className="font-medium">Rs. {student.totalFee?.toLocaleString() || "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      student.paymentStatus === "Paid"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }
                  >
                    {student.paymentStatus || "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(student.createdAt) || "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm" className="text-[#6f4e37]">
                      <Link href={`/users/${student.id}`}>View</Link>
                    </Button>
                    {student.paymentStatus === "Paid" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => window.open(`/print-invoice/${student.id}`, "_blank")}
                      >
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                    )}
                    <DeleteStudentButton id={student.id} name={student.name || "Student"} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
