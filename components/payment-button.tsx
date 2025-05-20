"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"
import { Printer } from "lucide-react"
import { updatePaymentStatus } from "@/app/actions"
import { toast } from "@/components/ui/use-toast"

interface PaymentButtonProps {
  student: any
}

export default function PaymentButton({ student }: PaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handlePrint = () => {
    setIsPrinting(true)

    // Create a new window for printing
    const printWindow = window.open("", "_blank")

    if (printWindow) {
      // Generate invoice number
      const invoiceNumber = generateInvoiceNumber()
      const currentDate = formatDate(new Date().toISOString())

      // Calculate total
      let total = 0
      if (Array.isArray(student.courses)) {
        student.courses.forEach((course: any) => {
          total += course.fee || 0
        })
      }
      total += student.admissionFee || 0

      // Generate the receipt HTML with two copies
      const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - Coffee Ghar</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              page-break-after: always;
            }
            .invoice {
              max-width: 800px;
              margin: 0 auto 20px;
              padding: 15px;
              border: 1px solid #000;
              /* Remove page-break-after */
              font-size: 12px;
            }
            .copy-label {
              text-align: right;
              font-style: italic;
              margin-bottom: 10px;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
            }
            .header h1 {
              margin: 0;
              font-size: 18px;
              font-weight: bold;
            }
            .header p {
              margin: 3px 0;
              font-size: 12px;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              font-size: 14px;
            }
            .invoice-details .left {
              text-align: left;
            }
            .invoice-details .right {
              text-align: right;
            }
            .divider {
              border-top: 1px solid #ccc;
              margin: 10px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 5px;
              text-align: left;
              font-size: 12px;
            }
            th {
              font-weight: bold;
            }
            .total-row {
              font-weight: bold;
            }
            .amount-summary {
              margin-top: 20px;
              text-align: right;
              font-size: 14px;
            }
            .amount-summary .amount-due {
              font-weight: bold;
              font-size: 16px;
              margin-top: 5px;
            }
            @media print {
              .no-print {
                display: none;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .invoice-container {
                width: 100%;
                max-width: 100%;
              }
              .invoice {
                border: 1px solid #000;
                margin-bottom: 10px;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Client Copy -->
            <div class="invoice">
              <div class="copy-label">CLIENT COPY</div>
              <div class="header">
                <h1>Coffee Ghar</h1>
                <p>Newroad, Pokhara</p>
              </div>
              
              <div class="invoice-details">
                <div class="left">
                  <div><strong>PAN NO:</strong> 123456789</div>
                  <div><strong>NAME:</strong> ${student.name}</div>
                  <div><strong>ADDRESS:</strong> ${student.address}</div>
                </div>
                <div class="right">
                  <div><strong>INVOICE NO:</strong> ${invoiceNumber}</div>
                  <div>${currentDate}</div>
                </div>
              </div>
              
              <div class="divider"></div>
              
              <table>
                <thead>
                  <tr>
                    <th>DESCRIPTION</th>
                    <th style="text-align: right;">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    Array.isArray(student.courses)
                      ? student.courses
                          .map(
                            (course) => `
                      <tr>
                        <td>${course.name} Course Fee</td>
                        <td style="text-align: right;">Rs ${course.fee?.toLocaleString() || "0"}</td>
                      </tr>
                    `,
                          )
                          .join("")
                      : ""
                  }
                  <tr>
                    <td>Admission Fee</td>
                    <td style="text-align: right;">Rs ${student.admissionFee?.toLocaleString() || "0"}</td>
                  </tr>
                  <tr class="total-row">
                    <td>TOTAL</td>
                    <td style="text-align: right;">Rs ${total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              
              <div class="amount-summary">
                <div>Total Paid Amount: Rs ${total.toLocaleString()}</div>
                <div class="amount-due">Amount due: Rs 0</div>
              </div>
            </div>

            <!-- Office Copy -->
            <div class="invoice">
              <div class="copy-label">OFFICE COPY</div>
              <div class="header">
                <h1>Coffee Ghar</h1>
                <p>Newroad, Pokhara</p>
              </div>
              
              <div class="invoice-details">
                <div class="left">
                  <div><strong>PAN NO:</strong> 123456789</div>
                  <div><strong>NAME:</strong> ${student.name}</div>
                  <div><strong>ADDRESS:</strong> ${student.address}</div>
                </div>
                <div class="right">
                  <div><strong>INVOICE NO:</strong> ${invoiceNumber}</div>
                  <div>${currentDate}</div>
                </div>
              </div>
              
              <div class="divider"></div>
              
              <table>
                <thead>
                  <tr>
                    <th>DESCRIPTION</th>
                    <th style="text-align: right;">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    Array.isArray(student.courses)
                      ? student.courses
                          .map(
                            (course) => `
                      <tr>
                        <td>${course.name} Course Fee</td>
                        <td style="text-align: right;">Rs ${course.fee?.toLocaleString() || "0"}</td>
                      </tr>
                    `,
                          )
                          .join("")
                      : ""
                  }
                  <tr>
                    <td>Admission Fee</td>
                    <td style="text-align: right;">Rs ${student.admissionFee?.toLocaleString() || "0"}</td>
                  </tr>
                  <tr class="total-row">
                    <td>TOTAL</td>
                    <td style="text-align: right;">Rs ${total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              
              <div class="amount-summary">
                <div>Total Paid Amount: Rs ${total.toLocaleString()}</div>
                <div class="amount-due">Amount due: Rs 0</div>
              </div>
            </div>
          </div>
          
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print();" style="padding: 10px 20px; background: #6f4e37; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Invoice
            </button>
            <button onclick="window.close(); window.opener.location.href = '/';" style="padding: 10px 20px; margin-left: 10px; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Close & Return Home
            </button>
          </div>
          
          <script>
            // Auto print after a short delay
            setTimeout(function() {
              window.print();
            }, 500);
            
            // Add event listener for when printing is done or canceled
            window.addEventListener('afterprint', function() {
              // Redirect to home page after printing
              window.close();
              window.opener.location.href = '/';
            });
          </script>
        </body>
        </html>
      `

      // Write the HTML to the new window and print
      printWindow.document.write(receiptHTML)
      printWindow.document.close()
    }

    setIsPrinting(false)
  }

  // Generate a random invoice number
  const generateInvoiceNumber = () => {
    const currentYear = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(5, "0")
    return `${random}`
  }

  // Handle payment completion
  const handleCompletePayment = async () => {
    try {
      setIsProcessing(true)

      // Calculate total amount
      let totalAmount = 0
      if (Array.isArray(student.courses)) {
        student.courses.forEach((course: any) => {
          totalAmount += course.fee || 0
        })
      }
      totalAmount += student.admissionFee || 0

      // Update payment status in Google Sheets
      const result = await updatePaymentStatus(student.id, "Paid", totalAmount)

      if (result.success) {
        toast({
          title: "Payment Completed",
          description: "Payment has been successfully recorded.",
        })

        // Close dialog and print receipt
        setIsOpen(false)
        handlePrint()

        // Refresh the page to show updated status
        router.refresh()
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || "There was an error processing the payment.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      console.error("Payment error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Button className="bg-[#6f4e37] hover:bg-[#5d4130]" onClick={() => setIsOpen(true)}>
        Make Payment
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>Please confirm the payment details for {student.name}.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                {Array.isArray(student.courses) &&
                  student.courses.map((course, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{course.name} Course Fee</span>
                      <span>Rs {course.fee?.toLocaleString() || "0"}</span>
                    </div>
                  ))}
                <div className="flex justify-between">
                  <span>Admission Fee</span>
                  <span>Rs {student.admissionFee?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t mt-2">
                  <span>Total Amount</span>
                  <span>Rs {student.totalFee?.toLocaleString() || "0"}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Payment Method</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="radio" id="cash" name="paymentMethod" value="cash" checked className="mr-2" readOnly />
                  <label htmlFor="cash">Cash</label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button className="bg-[#6f4e37] hover:bg-[#5d4130]" onClick={handlePrint} disabled={isPrinting}>
                <Printer className="h-4 w-4" />
                {isPrinting ? "Printing..." : "Print Invoice"}
              </Button>
              <Button
                className="bg-[#6f4e37] hover:bg-[#5d4130]"
                onClick={handleCompletePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Complete Payment"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
