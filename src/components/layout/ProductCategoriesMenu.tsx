import { Link } from "react-router-dom";
import { useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/config"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";



export default function ProductCategoriesMenu() {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<
    HttpTypes.StoreProductCategory[]
  >([])

  useEffect(() => {
    if (!loading) {
      return 
    }

    sdk.store.category.list()
    .then(({ product_categories }) => {
      setCategories(product_categories)
      setLoading(false)
    })
  }, [loading])

  // Organizar categorías por jerarquía
  const organizeCategories = () => {
    // Obtener categorías padre (sin parent_category_id)
    const parentCategories = categories.filter(cat => !cat.parent_category_id)
    
    return parentCategories.map(parent => {
      // Buscar categorías hijas directas
      const children = categories.filter(cat => cat.parent_category_id === parent.id)
      
      // Para cada hijo, buscar sus propios hijos (nietos)
      const childrenWithGrandchildren = children.map(child => ({
        ...child,
        children: categories.filter(cat => cat.parent_category_id === child.id)
      }))
      
      return {
        ...parent,
        children: childrenWithGrandchildren
      }
    })
  }

  const hierarchicalCategories = organizeCategories()
  
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 z-10 sticky top-[65px] md:top-[71px] w-full">
      <div className="flex items-center justify-between">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {/* Enlace a todos los productos */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/tienda/productos">Todos los productos</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            {hierarchicalCategories.map((parentCategory) => (
              <NavigationMenuItem key={parentCategory.id}>
                {parentCategory.children && parentCategory.children.length > 0 ? (
                  // Categoría padre con hijos - mostrar con dropdown
                  <>
                    <NavigationMenuTrigger><Link to={`/tienda/categorias/${parentCategory.handle}`}>{parentCategory.name}</Link></NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[400px] p-4">
                        {/* Categorías hijas en horizontal y en negrita */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {parentCategory.children.map((childCategory) => (
                            <div key={childCategory.id} className="space-y-2">
                              {/* Categoría hija en negrita */}
                              <NavigationMenuLink asChild>
                                <Link 
                                  to={`/tienda/categorias/${childCategory.handle}`}
                                  className="font-bold text-sm hover:underline"
                                >
                                  {childCategory.name}
                                </Link>
                              </NavigationMenuLink>
                              
                              {/* Categorías nietas en vertical debajo */}
                              {childCategory.children && childCategory.children.length > 0 && (
                                <div className="flex flex-col space-y-1">
                                  {childCategory.children.map((grandchildCategory) => (
                                    <NavigationMenuLink key={grandchildCategory.id} asChild>
                                      <Link 
                                        to={`/tienda/categorias/${grandchildCategory.handle}`}
                                        className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                                      >
                                        {grandchildCategory.name}
                                      </Link>
                                    </NavigationMenuLink>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  // Categoría padre sin hijos - mostrar como enlace directo
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link to={`/tienda/categorias/${parentCategory.handle}`}>{parentCategory.name}</Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
