import { getStudentById } from "@/app/actions"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import PrintInvoiceContent from "@/components/print-invoice-content"

// Set dynamic to force-dynamic to ensure fresh data on each request
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PrintInvoicePage({ params }: { params: { id: string } }) {
  const student = await getStudentById(params.id)

  if (!student) {
    notFound()
  }

  // Generate invoice number
  const invoiceNumber = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(5, "0")
  const currentDate = formatDate(new Date().toISOString())

  // Calculate total
  let total = 0
  if (Array.isArray(student.courses)) {
    student.courses.forEach((course) => {
      total += course.fee || 0
    })
  }
  total += student.admissionFee || 0

  return <PrintInvoiceContent student={student} invoiceNumber={invoiceNumber} currentDate={currentDate} total={total} />
}
