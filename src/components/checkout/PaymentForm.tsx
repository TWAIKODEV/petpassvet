"use client"

import { 
  CardElement, 
  Elements, 
  useElements, 
  useStripe,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useCart } from "@/context/CartContextProvider"
import { useCallback, useEffect, useState } from "react"
import { sdk } from "@/lib/config"
import { HttpTypes } from "@medusajs/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const stripe = loadStripe(
  import.meta.env.VITE_PUBLIC_STRIPE_PK || "temp"
)

interface PaymentFormProps {
  onContinue?: () => void
  onBack?: () => void
}

export default function PaymentForm({ onContinue, onBack }: PaymentFormProps) {
  const { cart, setCart } = useCart()
  console.log("cart", cart)
  const [paymentProviders, setPaymentProviders] = useState<
    HttpTypes.StorePaymentProvider[]
  >([])
  const [
    selectedPaymentProvider, 
    setSelectedPaymentProvider,
  ] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  // Step 1: Retrieve payment providers
  useEffect(() => {
    if (!cart?.region_id) {
      return
    }

    console.log("cart.region_id", cart.region_id)
    sdk.store.payment.listPaymentProviders({
      region_id: cart.region_id,
    })
    .then(({ payment_providers }) => {
      console.log("payment_providers", payment_providers)
      setPaymentProviders(payment_providers)
      // Set the current payment session provider as selected if one exists
      setSelectedPaymentProvider(
        cart.payment_collection?.payment_sessions?.[0]?.provider_id ||
        payment_providers[0]?.id
      )
    })
    .catch((error) => {
      console.error("Error loading payment providers:", error)
    })
  }, [cart])

  // Step 2: Handle payment provider selection
  const handleSelectProvider = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    if (!cart || !selectedPaymentProvider) {
      return
    }

    // Check if cart has a total greater than 0 (required for some providers like Stripe)
    if (selectedPaymentProvider.startsWith("pp_stripe_") && (!cart.total || cart.total <= 0)) {
      console.warn("Cart total is 0 or undefined, cannot initialize Stripe payment session")
      return
    }

    setLoading(true)

    try {
      // Step 3 & 4: Create payment collection and initialize payment session
      await sdk.store.payment.initiatePaymentSession(cart, {
        provider_id: selectedPaymentProvider,
      })

      // Step 5: Re-fetch cart to get updated payment collection
      const { cart: updatedCart } = await sdk.store.cart.retrieve(cart.id, {
        fields: "*payment_collection.payment_sessions"
      })

      setCart(updatedCart)
    } catch (error) {
      console.error("Error initializing payment session:", error)
    } finally {
      setLoading(false)
    }
  }

  // Step 6: Render appropriate payment UI based on selected provider
  const getPaymentUi = useCallback(() => {
    const activePaymentSession = cart?.payment_collection?.payment_sessions?.[0]
    if (!activePaymentSession) {
      return null
    }

    switch(true) {
      case activePaymentSession.provider_id.startsWith("pp_stripe_"):
        return (
          <StripePayment 
            onContinue={onContinue}
            onBack={onBack}
          />
        )
      case activePaymentSession.provider_id.startsWith("pp_system_default"):
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                Has elegido pago manual. No se requieren acciones adicionales.
              </p>
            </div>
            <div className="pt-6 flex gap-4">
              {onBack && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Volver a entrega
                </Button>
              )}
              <Button
                onClick={onContinue}
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                Continuar
              </Button>
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                Has elegido {activePaymentSession.provider_id}, que está en desarrollo.
              </p>
            </div>
            <div className="pt-6 flex gap-4">
              {onBack && (
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Volver a entrega
                </Button>
              )}
            </div>
          </div>
        )
    }
  }, [cart, onContinue, onBack])

  if (!cart) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando carrito...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment Provider Selection */}
          {!cart.payment_collection?.payment_sessions?.length ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Selecciona tu método de pago preferido
              </div>
              
              <div className="space-y-3">
                {paymentProviders.map((provider) => (
                  <label 
                    key={provider.id}
                    className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      value={provider.id}
                      checked={selectedPaymentProvider === provider.id}
                      onChange={(e) => setSelectedPaymentProvider(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">
                      {provider.id.startsWith("pp_stripe_") ? "Tarjeta de Crédito/Débito (Stripe)" :
                       provider.id.startsWith("pp_system_default") ? "Pago Manual" :
                       provider.id}
                    </span>
                  </label>
                ))}
              </div>

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
                  onClick={handleSelectProvider}
                  disabled={loading || !selectedPaymentProvider}
                  className="flex-1 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {loading ? "Configurando..." : "Continuar con el pago"}
                </Button>
              </div>
            </div>
          ) : (
            /* Payment UI based on selected provider */
            getPaymentUi()
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Stripe Payment Component
const StripePayment = ({ 
  onContinue, 
  onBack 
}: {
  onContinue?: () => void
  onBack?: () => void
}) => {
  const { cart } = useCart()
  const clientSecret = cart?.payment_collection?.
    payment_sessions?.[0]?.data?.client_secret as string

  if (!clientSecret) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Inicializando sesión de pago...</p>
      </div>
    )
  }

  return (
    <div>
      <Elements stripe={stripe} options={{
          clientSecret,
        }}>
        <StripeForm 
          clientSecret={clientSecret}
          onContinue={onContinue}
          onBack={onBack}
        />
      </Elements>
    </div>
  )
}

// Stripe Form Component
const StripeForm = ({ 
  clientSecret,
  onContinue,
  onBack
}: {
  clientSecret: string | undefined
  onContinue?: () => void
  onBack?: () => void
}) => {
  const { cart, refreshCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements()

  async function handlePayment(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault()
    const card = elements?.getElement(CardElement)

    if (
      !stripe || 
      !elements ||
      !card ||
      !cart ||
      !clientSecret
    ) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: `${cart.billing_address?.first_name || ''} ${cart.billing_address?.last_name || ''}`.trim(),
            email: cart.email || '',
            phone: cart.billing_address?.phone || '',
            address: {
              city: cart.billing_address?.city || '',
              country: cart.billing_address?.country_code || '',
              line1: cart.billing_address?.address_1 || '',
              line2: cart.billing_address?.address_2 || '',
              postal_code: cart.billing_address?.postal_code || '',
            },
          },
        },
      })

      if (stripeError) {
        console.error("Error de Stripe:", stripeError)
        setError(stripeError.message || "Error al procesar el pago")
        return
      }

      // Complete the cart
      const data = await sdk.store.cart.complete(cart.id)
      
      if (data.type === "cart" && data.cart) {
        // An error occurred
        console.error("Error al completar el pedido:", data.error)
        setError("Error al completar el pedido. Inténtalo de nuevo.")
      } else if (data.type === "order" && data.order) {
        // Order placed successfully
        console.log("Pedido realizado:", data.order)
        refreshCart()
        
        // Navigate to success page if callback provided
        if (onContinue) {
          onContinue()
        }
      }
    } catch (err) {
      console.error("Error al procesar el pago:", err)
      setError("Error inesperado. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        Ingresa los datos de tu tarjeta para completar el pago
      </div>

      {/* Card Element */}
      <div className="p-4 border rounded-lg bg-white">
        <CardElement options={cardElementOptions} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Order Total */}
      {cart && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total a pagar:</span>
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
          disabled={loading || !stripe || !elements}
          className="flex-1 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? "Procesando..." : "Realizar pedido"}
        </Button>
      </div>
    </div>
  )
}
