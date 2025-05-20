"use server"

import { z } from "zod"
import { google } from "googleapis"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

// Define the Course type
type Course = {
  name: string
  fee: number
}

// Define the schema for form validation
const formSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  contactNumber: z.string().min(10),
  grade: z.string().min(1),
  email: z.string().email(),
  courses: z
    .array(
      z.object({
        name: z.string().min(1),
        fee: z.coerce.number().min(0),
      }),
    )
    .min(1),
  admissionFee: z.coerce.number().min(0),
  remarks: z.string().optional(),
})

// The ID of the spreadsheet from the URL
const SPREADSHEET_ID = "1Czfujq3_W5QLUpxqfd0yoebBUEu0lzA0fySZWqkdjwI"

// Function to authenticate with Google Sheets API
async function getGoogleSheetsAuth() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL||"coffeegharsheetsbot@abroaddesk.iam.gserviceaccount.com",
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")||"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4Gr1xTHn+4Zmw\n1S/tkW2iyiggqOn7sodoNdmowOoYODBRb0morC0HAwYjU2oEk4fMu9/jMFQtDBVP\nlbtej6rQSqSVgxl/v0uTOeXcvRqIxO5MmymC/FpAG0TTDKPlbWR2p5vGkjAZJKIC\npNTxNEdd3uuyTgXrsHBpRt44Hl8ZtbHxsBCkGnEO2RbynoY6VY+6DgqPLlZEVw2u\nsIJ3p39c0h+KeAmRa484bUxqiFkow6Ak7fX8v+HhXnLORHSDsQwHCYxfgaQZ8ejM\nTCdVrX2PDzZhAxdFCNcZ5e3iqkbaHm+Lhw9umkvzw9WwIrPKutodZBRAtjD+Y9lT\nKROKQcvPAgMBAAECggEATc3bLtULn5hW++D0utkhdNEraTYJgHn/+J39aPByXh7s\n6JV4EyUEeHiiMO6xGNMCapchdKF5iXoYTYRxZXKg1RseeCMp9Q9ykHtA9esjGhbj\nwJM4VWdxerMrgGfQogZ7lRubXS1tz0pof2aKqY8W9AhgIoAPx33O2+b7xcqsFTA2\n9GLYmW5pNnD3Xb6+GazCDZJ7bvCpDwfqtkGAfn88/1suuG3ey2U1hAM2k6QbSi7F\nELGFxe1ocR/5yLFFU5y7NlynEd0wsMr1PaU+ZuJWQZStk0/oEKOIUg0i9BDT3lmY\noK+UruOk1DAe4lK9oEmXa/SO/0JhNtwnhKb3ClgKVQKBgQD+w5isMMK18uIPEuLL\n8pggbVdC837soNoHXTnYsW9AKyrNkePgfxnaChh9qA5Xixfn2x99vkXiCrYdRuku\n54+MpFTYno2Uq9qxMBKp2LumCOBIDppz4z78DV3+OMg6YcxR0GHalchh/aIeLobg\na/5M25NINU/azjMdVpvsVV82MwKBgQC4/2NbQqoC2uknc2wcB+Ps4cH8ot7tMXBM\npG+1yR/ffGjgyyOcRRFthIG20373QaMhe9abx4aw96DVjqYW7dDTb7PtJyMveKGK\nAaTe7oMEODuS8M1nA+a/8pOxe9htZBQtvyLrhHzvmxtOXM+cPCuPDx4hIhCZMrcF\n5Uz3uOJf9QKBgEal+yqVAwnt5t6DQD2KcsFbUP2SBLqeCJhONAJxggZrch07vdO9\nq2+ZqRz/g6qnOePkEiGOqFZ83e/UgEmvkVFRKO5BWcXGuoi0ahiLr83lXDzfP9mv\nRQIkutIK8Quvnzd48Anry3vRGCoCgQivKgAqS/eUQSbOU8JpCChLrHGdAoGAOxTE\n5GZb6WGESKciBam3bvWCgG57h4Dcfn2dd47t8O/IhtIZY1TjhfhlfL/6snhx4sWr\n+kA0kdvjr5BJFtWIdZ4c9kYjhIuf+3Ue9Ftz2CslS34/+wBR90c/R9VnfzgRAbMj\nMdg0FkmQ5OvbGehVePC5DJfWeTarIOTkOdD/6ukCgYBrlt1dMUjvDxlwpnIXNoMp\nXd4qX93a+RthdbnW6QVQaWi6UmVYJ2p2BnSM5o8Eq8d4lVZPECU8SZsFIwNrd+eU\n9w2538eQtryqb0KQb77BRmd1FyceXWmrjVydkNsOE4B53ksYIHcLyhEH1GWIIrO9\n1wimcyDQm0prlWkvntbi+g==\n-----END PRIVATE KEY-----\n"
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
    return auth
  } catch (error) {
    console.error("Error authenticating with Google Sheets:", error)
    throw new Error("Failed to authenticate with Google Sheets")
  }
}

// Function to get Google Sheets client
async function getSheetsClient() {
  const auth = await getGoogleSheetsAuth()
  return google.sheets({ version: "v4", auth })
}

// Function to get all students from Google Sheet - no caching to ensure fresh data
export async function getStudents() {
  try {
    const sheets = await getSheetsClient()

    // Get all data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:M", // Updated range (removed Materials Fee column)
    })

    const rows = response.data.values || []

    // Skip header row if it exists
    const dataRows = rows.length > 0 && rows[0][0] === "ID" ? rows.slice(1) : rows

    // Map the rows to student objects
    const students = dataRows.map((row, index) => {
      // Parse courses and fees
      const coursesString = row[6] || ""
      const feesString = row[9] || ""

      let courses = []
      try {
        if (coursesString && feesString) {
          const courseNames = coursesString.split(", ")
            const courseFees: number[] = feesString.split(", ").map((fee: string) => Number.parseInt(fee, 10) || 0)

            courses = courseNames.map((name: string, i: number): Course => ({
            name,
            fee: courseFees[i] || 0,
            }))
        }
      } catch (e) {
        console.error("Error parsing courses and fees:", e)
      }

      // Calculate total fee (without materials fee)
      const admissionFee = Number.parseInt(row[10], 10) || 0

      let totalFee = admissionFee
      courses.forEach((course: Course) => {
        totalFee += course.fee
      })

      return {
        rowIndex: index + 2, // +2 because index is 0-based and we skip header row
        id: row[0] || "",
        name: row[1] || "",
        email: row[2] || "",
        contactNumber: row[3] || "",
        grade: row[4] || "",
        address: row[5] || "",
        courses: courses,
        remarks: row[7] || "",
        createdAt: row[8] || new Date().toISOString(),
        courseFees: feesString,
        admissionFee: admissionFee,
        totalFee: totalFee,
        paymentStatus: row[11] || "Pending",
        paidAmount: Number.parseInt(row[12], 10) || 0,
      }
    })

    // Filter out empty rows (rows where all cells except rowIndex are empty)
    return students.filter((student) => student.id || student.name || student.email || student.contactNumber)
  } catch (error) {
    console.error("Error fetching students from Google Sheet:", error)
    return []
  }
}

// Function to get a student by ID
export async function getStudentById(id: string) {
  try {
    const allStudents = await getStudents()
    return allStudents.find((student) => student.id === id)
  } catch (error) {
    console.error("Error fetching student by ID:", error)
    return null
  }
}

// Function to delete a student
export async function deleteStudent(id: string) {
  try {
    console.log("Starting deletion process for student ID:", id)
    const sheets = await getSheetsClient()
    const allStudents = await getStudents()

    // Find the student to delete
    const studentToDelete = allStudents.find((student) => student.id === id)

    if (!studentToDelete) {
      console.error("Student not found with ID:", id)
      return {
        success: false,
        error: "Student not found",
      }
    }

    console.log("Found student to delete at row:", studentToDelete.rowIndex)

    // First, clear the row content
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `Sheet1!A${studentToDelete.rowIndex}:M${studentToDelete.rowIndex}`, // Updated range (removed Materials Fee column)
    })

    console.log("Row content cleared successfully")

    // Then, delete the row using batchUpdate
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming Sheet1 has ID 0
                dimension: "ROWS",
                startIndex: studentToDelete.rowIndex - 1, // 0-based index
                endIndex: studentToDelete.rowIndex, // exclusive end index
              },
            },
          },
        ],
      },
    })

    console.log("Row deleted successfully")

    // Revalidate the users page to show the updated list
    revalidatePath("/users")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting student:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete student",
    }
  }
}

// Function to update payment status
export async function updatePaymentStatus(id: string, status: string, paidAmount: number) {
  try {
    const sheets = await getSheetsClient()
    const allStudents = await getStudents()

    // Find the student to update
    const studentToUpdate = allStudents.find((student) => student.id === id)

    if (!studentToUpdate) {
      return {
        success: false,
        error: "Student not found",
      }
    }

    // Update the payment status and paid amount in Google Sheets
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Sheet1!L${studentToUpdate.rowIndex}:M${studentToUpdate.rowIndex}`, // Updated range (adjusted for removed Materials Fee column)
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[status, paidAmount.toString()]],
      },
    })

    // Revalidate paths to show updated data
    revalidatePath("/users")
    revalidatePath(`/users/${id}`)

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating payment status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update payment status",
    }
  }
}

// Function to submit the admission form
export async function submitAdmissionForm(formData: z.infer<typeof formSchema>) {
  try {
    // Validate the form data
    const validatedData = formSchema.parse(formData)

    // Generate a unique ID for the student
    const studentId = uuidv4()
    const timestamp = new Date().toISOString()

    // Extract course names and fees
    const courseNames = validatedData.courses.map((course) => course.name)
    const courseFees = validatedData.courses.map((course) => course.fee.toString())

    // Create a new student object
    const newStudent = {
      id: studentId,
      name: validatedData.name,
      address: validatedData.address,
      contactNumber: validatedData.contactNumber,
      grade: validatedData.grade,
      email: validatedData.email,
      courses: courseNames,
      courseFees: courseFees,
      admissionFee: validatedData.admissionFee,
      remarks: validatedData.remarks || "",
      createdAt: timestamp,
      paymentStatus: "Pending",
      paidAmount: 0,
    }

    // Prepare data for Google Sheets
    const sheetValues = [
      studentId,
      newStudent.name,
      newStudent.email,
      newStudent.contactNumber,
      newStudent.grade,
      newStudent.address,
      newStudent.courses.join(", "),
      newStudent.remarks,
      timestamp,
      newStudent.courseFees.join(", "),
      newStudent.admissionFee.toString(),
      newStudent.paymentStatus,
      newStudent.paidAmount.toString(),
    ]

    // Append to Google Sheet
    const sheets = await getSheetsClient()

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:M", // Updated range (removed Materials Fee column)
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [sheetValues],
      },
    })

    // Revalidate the users page to show the new student
    revalidatePath("/users")

    return {
      success: true,
      id: studentId,
    }
  } catch (error) {
    console.error("Error submitting form:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed. Please check your form inputs.",
      }
    }

    return {
      success: false,
      error: "Failed to submit the form. Please try again.",
    }
  }
}

// Function to initialize the Google Sheet with headers if needed
export async function initializeGoogleSheet() {
  try {
    const sheets = await getSheetsClient()

    // Check if the sheet has headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1:M1", // Updated range (removed Materials Fee column)
    })

    const rows = response.data.values || []

    // If no headers or incomplete headers, add them
    if (rows.length === 0 || rows[0].length < 13) {
      // Updated column count
      const headers = [
        "ID",
        "Name",
        "Email",
        "Contact Number",
        "Grade",
        "Address",
        "Courses",
        "Remarks",
        "Created At",
        "Course Fees",
        "Admission Fee",
        "Payment Status",
        "Paid Amount",
      ]

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: "Sheet1!A1:M1", // Updated range (removed Materials Fee column)
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [headers],
        },
      })
    }

    return true
  } catch (error) {
    console.error("Error initializing Google Sheet:", error)
    return false
  }
}
