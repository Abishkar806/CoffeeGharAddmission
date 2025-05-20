import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f5f2]">
      <header className="bg-[#6f4e37] text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold flex items-center">
              <Coffee className="h-6 w-6 mr-2" /> Coffee Ghar
            </h1>
            {/* Removed "Professional Culinary Institute" */}
          </div>
          <nav className="flex gap-4">
            <Link href="/" className="hover:underline font-medium">
              Home
            </Link>
            <Link href="/admissions" className="hover:underline font-medium">
              Admissions
            </Link>
            <Link href="/users" className="hover:underline font-medium">
              Students
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-12 px-4">
        <section className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-[#6f4e37] mb-4">Welcome to Coffee Ghar</h2>
          {/* Removed "Brewing excellence in culinary education since 2010" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-[#c8a27a] flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Apply for Admission</h3>
                <p className="text-gray-600 mb-6 text-center">Start your journey to becoming a culinary professional</p>
                <Button asChild className="bg-[#6f4e37] hover:bg-[#5d4130]">
                  <Link href="/admissions">Apply Now</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-[#c8a27a] flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">View Students</h3>
                <p className="text-gray-600 mb-6 text-center">Check our current student roster and profiles</p>
                <Button asChild className="bg-[#6f4e37] hover:bg-[#5d4130]">
                  <Link href="/users">View Students</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="bg-[#6f4e37] text-white p-6">
        <div className="container mx-auto text-center">
          <p>Coffee Ghar | Newroad, Pokhara | © 2025 All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
