import { useState } from "react"
import { useCart } from "@/context/CartContextProvider"
import { sdk } from "@/lib/config"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@/components/ui/button"

interface SystemDefaultPaymentProps {
  onOrderComplete?: (order: HttpTypes.StoreOrder) => void
  onBack?: () => void
}

export default function SystemDefaultPayment({ 
  onOrderComplete, 
  onBack 
}: SystemDefaultPaymentProps) {
  const { cart, refreshCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()

    if (!cart) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Complete the cart
      const data = await sdk.store.cart.complete(cart.id)
      
      if (data.type === "cart" && data.cart) {
        // An error occurred
        console.error("Error al completar el pedido:", data.error)
        setError(data.error.message || "Error al completar el pedido")
      } else if (data.type === "order" && data.order) {
        // Order placed successfully
        console.log("Pedido realizado:", data.order)
        await refreshCart()
        
        // Call parent with the completed order
        if (onOrderComplete) {
          onOrderComplete(data.order)
        }
      }
    } catch (err) {
      console.error("Error al procesar el pedido:", err)
      setError("Error inesperado. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800">
          Has elegido pago manual. Se procesará tu pedido y nos pondremos en contacto contigo.
        </p>
      </div>

      {error && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Order Total */}
      {cart && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total del pedido:</span>
            <span className="font-bold text-lg">
              {new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: cart.currency_code || "EUR",
              }).format((cart.total || 0))}
            </span>
          </div>
        </div>
      )}

      <div className="pt-6 flex gap-4">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            disabled={loading}
            className="flex-1"
          >
            Volver a entrega
          </Button>
        )}
        <Button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Procesando pedido..." : "Confirmar pedido"}
        </Button>
      </div>
    </div>
  )
}
