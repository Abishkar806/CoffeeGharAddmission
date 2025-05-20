"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteStudent } from "@/app/actions"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface DeleteStudentButtonProps {
  id: string
  name: string
}

export default function DeleteStudentButton({ id, name }: DeleteStudentButtonProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setError(null)

      console.log("Deleting student with ID:", id)
      const result = await deleteStudent(id)

      if (result.success) {
        toast({
          title: "Student Deleted",
          description: `${name} has been successfully removed.`,
        })
        setOpen(false)
        // Force a refresh to update the UI
        router.refresh()
      } else {
        setError(result.error || "There was an error deleting the student.")
        toast({
          title: "Deletion Failed",
          description: result.error || "There was an error deleting the student.",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setError(errorMessage)
      toast({
        title: "Deletion Error",
        description: errorMessage,
        variant: "destructive",
      })
      console.error("Error in delete handler:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-medium">{name}</span> from the system. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">Error: {error}</div>}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
