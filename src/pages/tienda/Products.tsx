import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/config"
import { ShoppingCart } from "lucide-react"
import ProductPreview from "@/components/product/ProductPreview"
import ProductsSkeleton from "@/components/product/ProductsSkeleton"

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



  if (loading) {
    return <ProductsSkeleton />
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
          <ProductPreview key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}