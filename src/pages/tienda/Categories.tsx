import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/config"
import { ShoppingCart } from "lucide-react"
import ProductPreview from "@/components/product/ProductPreview"
import ProductsSkeleton from "@/components/product/ProductsSkeleton"

export default function CategoryProducts() {
  const { handle } = useParams<{ handle: string }>()
  const [loadingCategory, setLoadingCategory] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [category, setCategory] = useState<
    HttpTypes.StoreProductCategory | undefined
  >()
  const [products, setProducts] = useState<
    HttpTypes.StoreProduct[]
  >([])
  const limit = 20
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(false)

  // Buscar categoría por handle
  useEffect(() => {
    if (!loadingCategory || !handle) {
      return 
    }

    sdk.store.category.list({
      handle,
    })
    .then(({ product_categories }) => {
      if (product_categories.length) {
        setCategory(product_categories[0])
        setLoadingProducts(true)
      }
      setLoadingCategory(false)
    })
  }, [loadingCategory, handle])

  // Buscar productos por categoryId una vez que tenemos la categoría
  useEffect(() => {
    if (!loadingProducts || !category) {
      return 
    }

    const offset = (currentPage - 1) * limit

    sdk.store.product.list({
      limit,
      offset,
      category_id: category.id,
    })
    .then(({ products: dataProducts, count }) => {
      setProducts((prev) => {
        if (prev.length > offset) {
          // products already added because the same request has already been sent
          return prev
        }
        return [
          ...prev,
          ...dataProducts,
        ]
      })
      setHasMorePages(count > limit * currentPage)
      setLoadingProducts(false)
    })
  }, [loadingProducts, category, currentPage, limit])

  // Reset cuando cambia el handle
  useEffect(() => {
    setCategory(undefined)
    setProducts([])
    setCurrentPage(1)
    setLoadingCategory(true)
    setLoadingProducts(false)
  }, [handle])

  // Loading de categoría
  if (loadingCategory) {
    return <ProductsSkeleton showCategoryInfo={true} />
  }

  // Categoría no encontrada
  if (!loadingCategory && !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Categoría no encontrada</h3>
          <p className="text-gray-500">No se encontró la categoría especificada.</p>
        </div>
      </div>
    )
  }

  // Loading de productos inicial
  if (loadingProducts && products.length === 0) {
    return (
      <>
        {category && (
          <div className="container mx-auto px-4 pt-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-lg text-gray-600">{category.description}</p>
              )}
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-9 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  // Sin productos en la categoría
  if (!loadingProducts && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        {category && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-gray-600">{category.description}</p>
            )}
          </div>
        )}
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos en esta categoría</h3>
          <p className="text-gray-500">No se encontraron productos en esta categoría.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Información de la categoría */}
      {category && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-gray-600">{category.description}</p>
          )}
        </div>
      )}
      
      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductPreview key={product.id} product={product} />
        ))}
      </div>
      
      {/* Botón de cargar más */}
      {hasMorePages && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => {
              setCurrentPage((prev) => prev + 1)
              setLoadingProducts(true)
            }}
            disabled={loadingProducts}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingProducts ? "Cargando..." : "Cargar más productos"}
          </button>
        </div>
      )}
    </div>
  )
}