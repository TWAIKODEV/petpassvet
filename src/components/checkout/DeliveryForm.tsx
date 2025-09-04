import { useCallback, useEffect, useState } from "react"
import { useCart } from "@/context/CartContextProvider"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DeliveryFormProps {
  onContinue?: () => void
  onBack?: () => void
}

export default function DeliveryForm({ onContinue, onBack }: DeliveryFormProps) {
  const { cart, setCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<
    HttpTypes.StoreCartShippingOption[]
  >([])
  const [calculatedPrices, setCalculatedPrices] = useState<
    Record<string, number>
  >({})
  const [
    selectedShippingOption, 
    setSelectedShippingOption,
  ] = useState<string | undefined>()

  // Load shipping options when cart is available
  useEffect(() => {
    if (!cart) {
      return
    }
    sdk.store.fulfillment.listCartOptions({
      cart_id: cart.id,
    })
    .then(({ shipping_options }) => {
      setShippingOptions(shipping_options)
      
      // If cart has shipping methods, select the first one
      if (!selectedShippingOption && cart.shipping_methods && cart.shipping_methods.length > 0) {
        const currentShippingMethod = cart.shipping_methods[0]
        const shippingOptionId = currentShippingMethod.shipping_option_id
        
        // Verify that the shipping option exists in the available options
        const existsInOptions = shipping_options.find(option => option.id === shippingOptionId)
        if (existsInOptions) {
          setSelectedShippingOption(shippingOptionId)
        }
      }
      // Auto-select first option if none selected and cart doesn't have shipping method
      else if (!selectedShippingOption && !cart.shipping_methods?.length && shipping_options.length > 0) {
        setSelectedShippingOption(shipping_options[0].id)
      }
    })
    .catch((error) => {
      console.error("Error loading shipping options:", error)
    })
  }, [cart, selectedShippingOption])

  // Calculate prices for calculated shipping options
  useEffect(() => {
    if (!cart || !shippingOptions.length) {
      return
    }

    const promises = shippingOptions
        .filter((shippingOption) => shippingOption.price_type === "calculated")
        .map((shippingOption) => 
          sdk.store.fulfillment.calculate(shippingOption.id, {
            cart_id: cart.id,
            data: {
              // pass any data useful for calculation with third-party provider.
            },
          })
        )

    if (promises.length) {
      Promise.allSettled(promises).then((res) => {
        const pricesMap: Record<string, number> = {}
        res
          .filter((r) => r.status === "fulfilled")
          .forEach((p) => (pricesMap[p.value?.shipping_option.id || ""] = p.value?.shipping_option.amount))

        setCalculatedPrices(pricesMap)
      })
    }
  }, [shippingOptions, cart])

  const formatPrice = useCallback((amount: number): string => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: cart?.currency_code || "EUR",
    })
    .format(amount) // Medusa amounts are in cents
  }, [cart?.currency_code])

  const getShippingOptionPrice = useCallback((shippingOption: HttpTypes.StoreCartShippingOption) => {
    if (shippingOption.price_type === "flat") {
      return formatPrice(shippingOption.amount || 0)
    }

    if (!calculatedPrices[shippingOption.id]) {
      return undefined
    }

    return formatPrice(calculatedPrices[shippingOption.id])
  }, [calculatedPrices, formatPrice])

  const setShipping = async () => {
    if (!cart || !selectedShippingOption) {
      return
    }

    setLoading(true)

    try {
      const { cart: updatedCart } = await sdk.store.cart.addShippingMethod(cart.id, {
        option_id: selectedShippingOption,
        data: {
          // TODO: add any data necessary for fulfillment provider
        },
      })
      
      setCart(updatedCart)
      
      // Navigate to next step if callback provided
      if (onContinue) {
        onContinue()
      }
    } catch (error) {
      console.error("Error updating shipping method:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!cart) {
    return <div className="flex justify-center py-8">Loading...</div>
  }

  if (loading && !shippingOptions.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <span>Cargando opciones de envío...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            ¿Cómo te gustaría que se entregue tu pedido?
          </div>

          {/* Display current shipping address */}
          {cart.shipping_address && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-900 mb-2">Dirección de envío:</h4>
              <p className="text-sm text-gray-600">
                {cart.shipping_address.first_name} {cart.shipping_address.last_name}<br />
                {cart.shipping_address.address_1}<br />
                {cart.shipping_address.postal_code} {cart.shipping_address.city}<br />
                {cart.shipping_address.country_code?.toUpperCase()}
              </p>
            </div>
          )}

          {shippingOptions.length > 0 ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Método de envío
              </label>
              
              <Select
                value={selectedShippingOption}
                onValueChange={setSelectedShippingOption}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un método de envío" />
                </SelectTrigger>
                <SelectContent>
                  {shippingOptions.map((shippingOption) => {
                    const price = getShippingOptionPrice(shippingOption)
                    const isDisabled = price === undefined && shippingOption.price_type === "calculated"
                    
                    return (
                      <SelectItem
                        key={shippingOption.id}
                        value={shippingOption.id}
                        disabled={isDisabled}
                      >
                        <div className="flex justify-between items-center w-full">
                          <div className="flex flex-col">
                            <span className="font-medium">{shippingOption.name}</span>
                          </div>
                          <span className="font-medium ml-4">
                            {price || (isDisabled ? "Calculando..." : "Gratis")}
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>

              {/* Show selected shipping method details */}
              {selectedShippingOption && (
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  {(() => {
                    const selected = shippingOptions.find(opt => opt.id === selectedShippingOption)
                    if (!selected) return null
                    const price = getShippingOptionPrice(selected)
                    
                    return (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-blue-900">{selected.name}</p>
                        </div>
                        <p className="font-semibold text-blue-900">
                          {price || "Gratis"}
                        </p>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay opciones de envío disponibles</p>
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
                Volver a dirección
              </Button>
            )}
            <Button
              onClick={setShipping}
              disabled={loading || !selectedShippingOption}
              className="flex-1 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Procesando..." : "Continuar al pago"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
