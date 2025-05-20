import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="border rounded-lg">
        <div className="bg-gray-200 p-4">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
