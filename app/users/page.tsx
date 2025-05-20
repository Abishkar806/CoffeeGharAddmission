import Link from "next/link"
import { getStudents } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, Coffee } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Suspense } from "react"
import StudentTableSkeleton from "@/components/student-table-skeleton"
import StudentTableContent from "@/components/student-table-content"

// Set dynamic to force-dynamic to ensure fresh data on each request
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function UsersPage() {
  let students = []
  let error = null

  try {
    // Force fresh data
    students = await getStudents()
  } catch (e) {
    error = "Failed to load student data. Please try again later."
    console.error("Error loading students:", e)
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
              <Coffee className="h-5 w-5 mr-2" /> Student Directory
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader className="bg-[#c8a27a] text-white">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Enrolled Students</CardTitle>
                <CardDescription className="text-white/90">
                  A complete list of all students who have applied
                </CardDescription>
              </div>
              <Button asChild className="bg-white text-[#6f4e37] hover:bg-gray-100">
                <Link href="/admissions">Add New Student</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Suspense fallback={<StudentTableSkeleton />}>
              {error ? (
                <Alert variant="destructive" className="m-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <StudentTableContent students={students} />
              )}
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
