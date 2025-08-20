import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/config"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"

export default function Products() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<
    HttpTypes.StoreProduct[]
  >([])

  useEffect(() => {
    if (!loading) {
      return 
    }

    sdk.store.product.list()
    .then(({ products: dataProducts }) => {
      setProducts(dataProducts)
      setLoading(false)
    })
  }, [loading])

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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

  if (!loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
          <p className="text-gray-500">No se encontraron productos en este momento.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden pt-0">
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
                <Button variant="outline" size="sm" className="w-full">
                  Ver detalles
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}