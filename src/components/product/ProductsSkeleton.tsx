import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface ProductsSkeletonProps {
  showCategoryInfo?: boolean
}

export default function ProductsSkeleton({ showCategoryInfo = false }: ProductsSkeletonProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Skeleton para información de categoría (opcional) */}
      {showCategoryInfo && (
        <div className="animate-pulse mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      )}
      
      {/* Grid de productos skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-xl"></div>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
            <CardFooter>
              <div className="h-9 bg-gray-200 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
