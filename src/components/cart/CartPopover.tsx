import { ShoppingCart, Plus, Minus, X, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/cart"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"

export default function CartPopover() {
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeItem, 
    getTotalItems, 
    getTotalPrice, 
    clearCart 
  } = useCartStore()

  const formatPrice = (price: number) => {
    return `€${(price / 100).toFixed(2)}`
  }

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalItems > 99 ? '99+' : totalItems}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96" align="end" sideOffset={8}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Carrito de compras</h4>
            {items.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCart}
                className="text-xs h-auto p-1"
              >
                Limpiar
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-6">
              <Package className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 border rounded-lg">
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.thumbnail || "https://images.pexels.com/photos/6568501/pexels-photo-6568501.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1"}
                        alt={item.product.title || "Producto"}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium truncate">
                        {item.product.title}
                      </h5>
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.variant.calculated_price?.original_amount || 0)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="text-sm w-8 text-center">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    Proceder al checkout
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Ver carrito completo
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
