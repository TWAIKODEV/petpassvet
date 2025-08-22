import { HttpTypes } from "@medusajs/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"
import { Link } from "react-router-dom"

interface ProductPreviewProps {
  product: HttpTypes.StoreProduct
}

export default function ProductPreview({ product }: ProductPreviewProps) {
  const formatPrice = (price: number | null | undefined) => {
    if (!price) return "N/A"
    return `€${(price / 100).toFixed(2)}`
  }

  const getProductImage = (product: HttpTypes.StoreProduct) => {
    if (product.thumbnail) {
      return product.thumbnail
    }
    if (product.images && product.images.length > 0) {
      return product.images[0].url
    }
    return "https://images.pexels.com/photos/6568501/pexels-photo-6568501.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden pt-0">
      <div className="relative overflow-hidden">
        <img
          src={getProductImage(product)}
          alt={product.title || "Producto"}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </CardTitle>
        {product.subtitle && (
          <CardDescription className="text-sm text-gray-600">
            {product.subtitle}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="pb-2">
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 mb-2">
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.variants[0].calculated_price?.original_amount)}
              </span>
              {product.variants[0].calculated_price?.calculated_amount !== product.variants[0].calculated_price?.original_amount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.variants[0].calculated_price?.calculated_amount)}
                </span>
              )}
            </div>
          )}
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.value}
              </Badge>
            ))}
            {product.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{product.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <div className="w-full space-y-2">
          <Button 
            className="w-full" 
            size="sm"
            disabled={!product.variants || product.variants.length === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Añadir al carrito
          </Button>
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to={`/tienda/productos/${product.handle}`}>
              Ver detalles
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
