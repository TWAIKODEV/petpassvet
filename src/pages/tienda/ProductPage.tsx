import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Heart, ArrowLeft, Package, Truck, Shield } from "lucide-react"
import { useCartStore } from "@/store/cart"

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<HttpTypes.StoreProduct | undefined>()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (!loading || !handle) {
      return 
    }

    sdk.store.product.list({
      handle,
    })
    .then(({ products }) => {
      if (products.length) {
        setProduct(products[0])
      }
      setLoading(false)
    })
  }, [loading, handle])

  // Reset cuando cambia el handle
  useEffect(() => {
    setProduct(undefined)
    setSelectedImageIndex(0)
    setLoading(true)
  }, [handle])

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return "N/A"
    return `€${(price / 100).toFixed(2)}`
  }

  const handleAddToCart = () => {
    if (product && product.variants && product.variants.length > 0) {
      addItem(product, product.variants[0], 1)
    }
  }

  const getProductImages = (product: HttpTypes.StoreProduct) => {
    const images = []
    if (product.thumbnail) {
      images.push(product.thumbnail)
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img.url && img.url !== product.thumbnail) {
          images.push(img.url)
        }
      })
    }
    if (images.length === 0) {
      images.push("https://images.pexels.com/photos/6568501/pexels-photo-6568501.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1")
    }
    return images
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 w-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/tienda/productos" className="inline-flex items-center text-black hover:text-gray-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a productos
        </Link>
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Producto no encontrado</h3>
          <p className="text-gray-500">No se encontró el producto especificado.</p>
        </div>
      </div>
    )
  }

  const images = getProductImages(product)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link to="/tienda/productos" className="inline-flex items-center text-black hover:text-gray-600 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a productos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={images[selectedImageIndex]}
              alt={product.title || "Producto"}
              className="w-full h-full object-cover"
            />
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            {product.subtitle && (
              <p className="text-lg text-gray-600">{product.subtitle}</p>
            )}
          </div>

          {/* Precio */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.variants[0].calculated_price?.original_amount)}
              </span>
              {product.variants[0].calculated_price?.calculated_amount !== product.variants[0].calculated_price?.original_amount && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.variants[0].calculated_price?.calculated_amount)}
                </span>
              )}
            </div>
          )}

          {/* Descripción */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Características</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.value}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Acciones */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1"
                disabled={!product.variants || product.variants.length === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Añadir al carrito
              </Button>
              <Button size="lg" variant="outline" className="px-4">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Envío gratuito en pedidos superiores a €50</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Garantía de satisfacción del 100%</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>En stock - Envío en 24-48h</span>
              </div>
            </div>
          </div>

          {/* Información adicional en card */}
          {(product.material || product.weight || product.length || product.width || product.height) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Especificaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {product.material && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium">{product.material}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Peso:</span>
                    <span className="font-medium">{product.weight}g</span>
                  </div>
                )}
                {(product.length || product.width || product.height) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensiones:</span>
                    <span className="font-medium">
                      {product.length && `${product.length}`}
                      {product.width && ` × ${product.width}`}
                      {product.height && ` × ${product.height}`} cm
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
