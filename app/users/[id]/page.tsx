import Link from "next/link"
import { notFound } from "next/navigation"
import { getStudentById } from "@/app/actions"
import { AlertCircle, ArrowLeft, Coffee } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Suspense } from "react"
import ProfileSkeleton from "@/components/profile-skeleton"
import StudentProfileContent from "@/components/student-profile-content"

// Set dynamic to force-dynamic to ensure fresh data on each request
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  let student = null
  let error = null

  try {
    student = await getStudentById(params.id)

    if (!student) {
      notFound()
    }
  } catch (e) {
    error = "Failed to load student data. Please try again later."
    console.error("Error loading student:", e)
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <header className="bg-[#6f4e37] text-white p-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/users" className="flex items-center gap-1 text-white hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to Students
            </Link>
            <span className="text-white/50">|</span>
            <h1 className="text-2xl font-bold flex items-center">
              <Coffee className="h-5 w-5 mr-2" /> Student Profile
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        <Suspense fallback={<ProfileSkeleton />}>
          {error ? (
            <Alert variant="destructive" className="max-w-3xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <StudentProfileContent student={student} />
          )}
        </Suspense>
      </main>
    </div>
  )
}
