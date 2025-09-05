import { useState } from "react"
import { useCart } from "@/context/CartContextProvider"
import { updateQuantity, removeItem, formatPrice, getCartTotal, getCartItemsCount } from "@/utils/cart"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag 
} from "lucide-react"
import { Link } from "react-router-dom"

export default function CartPopover() {
  const { cart, refreshCartFromServer } = useCart()
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (!cart) return
    
    setLoading(itemId)
    try {
      await updateQuantity(itemId, newQuantity)
      // Refrescar desde servidor para datos actualizados
      await refreshCartFromServer()
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    if (!cart) return
    
    setLoading(itemId)
    try {
      await removeItem(itemId)
      // Refrescar desde servidor para datos actualizados
      await refreshCartFromServer()
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setLoading(null)
    }
  }

  const itemsCount = cart ? getCartItemsCount(cart) : 0
  const cartTotal = cart ? getCartTotal(cart) : 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemsCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemsCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Carrito de compras</h4>
            <Badge variant="secondary">{itemsCount} productos</Badge>
          </div>
          
          {!cart || !cart.items || cart.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-2">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400">Añade algunos productos para empezar</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        src={item?.thumbnail || "/placeholder-product.jpg"}
                        alt={item?.title || "Producto"}
                        className="w-12 h-12 object-cover rounded-md bg-gray-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 truncate">
                        {item?.title || "Producto"}
                      </h5>
                      {item?.variant_title && (
                        <p className="text-xs text-gray-500">{item.variant_title}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUpdateQuantity(item.id!, Math.max(0, (item.quantity || 1) - 1))}
                            disabled={loading === item.id || (item.quantity || 0) <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUpdateQuantity(item.id!, (item.quantity || 1) + 1)}
                            disabled={loading === item.id}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {formatPrice(item.unit_price || 0, cart.currency_code || "EUR")}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.id!)}
                            disabled={loading === item.id}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(cartTotal, cart.currency_code || "EUR")}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver carrito
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/tienda/checkout">
                      Finalizar compra
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
