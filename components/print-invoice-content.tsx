"use client"

interface Course {
  name: string;
  fee?: number;
}

interface PrintInvoiceContentProps {
  student: any
  invoiceNumber: string
  currentDate: string
  total: number
}

export default function PrintInvoiceContent({ student, invoiceNumber, currentDate, total }: PrintInvoiceContentProps) {
  return (
    <html>
      <head>
        <title>Invoice - Coffee Ghar</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
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
          .text-right {
            text-align: right;
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
          .controls {
            text-align: center;
            margin: 20px 0;
          }
          .btn {
            padding: 10px 20px;
            background: #6f4e37;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 0 5px;
          }
          .btn-secondary {
            background: #333;
          }
          @media print {
            .controls {
              display: none;
            }
          }
          @media print {
            .controls {
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
        `,
          }}
        />
      </head>
      <body>
        <div className="invoice-container">
          {/* Client Copy */}
          <div className="invoice">
            <div className="copy-label">CLIENT COPY</div>
            <div className="header">
              <h1>Coffee Ghar</h1>
              <p>Newroad, Pokhara</p>
            </div>

            <div className="invoice-details">
              <div className="left">
                <div>
                  <strong>PAN NO:</strong> 123456789
                </div>
                <div>
                  <strong>NAME:</strong> {student.name}
                </div>
                <div>
                  <strong>ADDRESS:</strong> {student.address}
                </div>
              </div>
              <div className="right">
                <div>
                  <strong>INVOICE NO:</strong> {invoiceNumber}
                </div>
                <div>{currentDate}</div>
              </div>
            </div>

            <div className="divider"></div>

            <table>
              <thead>
                <tr>
                  <th>DESCRIPTION</th>
                  <th style={{ textAlign: "right" }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <>
                  {Array.isArray(student.courses) &&
                    student.courses.map((course: any, index: number) => (
                      <tr key={index}>
                        <td>{course.name} Course Fee</td>
                        <td style={{ textAlign: "right" }}>Rs {course.fee?.toLocaleString() || "0"}</td>
                      </tr>
                    ))}
                  <tr>
                    <td>Admission Fee</td>
                    <td className="text-right">Rs {student.admissionFee?.toLocaleString() || "0"}</td>
                  </tr>
                  <tr className="total-row">
                    <td>TOTAL</td>
                    <td className="text-right">Rs {total.toLocaleString()}</td>
                  </tr>
                </>
              </tbody>
            </table>

            <div className="amount-summary">
              <div>Total Paid Amount: Rs {total.toLocaleString()}</div>
              <div className="amount-due">Amount due: Rs 0</div>
            </div>
          </div>

          {/* Office Copy */}
          <div className="invoice">
            <div className="copy-label">OFFICE COPY</div>
            <div className="header">
              <h1>Coffee Ghar</h1>
              <p>Newroad, Pokhara</p>
            </div>

            <div className="invoice-details">
              <div className="left">
                <div>
                  <strong>PAN NO:</strong> 123456789
                </div>
                <div>
                  <strong>NAME:</strong> {student.name}
                </div>
                <div>
                  <strong>ADDRESS:</strong> {student.address}
                </div>
              </div>
              <div className="right">
                <div>
                  <strong>INVOICE NO:</strong> {invoiceNumber}
                </div>
                <div>{currentDate}</div>
              </div>
            </div>

            <div className="divider"></div>

            <table>
              <thead>
                <tr>
                  <th>DESCRIPTION</th>
                  <th style={{ textAlign: "right" }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(student.courses) &&
                  student.courses.map((course: Course, index: number) => (
                  <tr key={index}>
                    <td>{course.name} Course Fee</td>
                    <td style={{ textAlign: "right" }}>Rs {course.fee?.toLocaleString() || "0"}</td>
                  </tr>
                  ))}
                <tr>
                  <td>Admission Fee</td>
                  <td style={{ textAlign: "right" }}>Rs {student.admissionFee?.toLocaleString() || "0"}</td>
                </tr>
                <tr className="total-row">
                  <td>TOTAL</td>
                  <td style={{ textAlign: "right" }}>Rs {total.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="amount-summary">
              <div>Total Paid Amount: Rs {total.toLocaleString()}</div>
              <div className="amount-due">Amount due: Rs 0</div>
            </div>
          </div>
        </div>

        <div className="controls">
          <button
            className="btn"
            onClick={() => {
              window.print()
            }}
          >
            Print Invoice
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              window.close()
              window.opener.location.href = "/"
            }}
          >
            Close & Return Home
          </button>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
          // Auto print after a short delay
          setTimeout(function() {
            window.print();
          }, 500);
          
          // Add event listener for when printing is done or canceled
          window.addEventListener('afterprint', function() {
            // Redirect to home page after printing if needed
            // window.close();
            // window.opener.location.href = '/';
          });
        `,
          }}
        />
      </body>
    </html>
  )
}
