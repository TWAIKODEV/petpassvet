import { useState } from "react"
import { useCart } from "@/context/CartContextProvider"
import AddressForm from "@/components/checkout/AddressForm"
import DeliveryForm from "@/components/checkout/DeliveryForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Check } from "lucide-react"

type CheckoutStep = "address" | "delivery" | "payment" | "review"

export default function Checkout() {
  const { cart } = useCart()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address")
  
  const steps = [
    { id: "address", label: "Dirección", completed: false },
    { id: "delivery", label: "Entrega", completed: false },
    { id: "payment", label: "Pago", completed: false },
    { id: "review", label: "Revisar", completed: false },
  ]

  const formatPrice = (amount: number, currencyCode: string = "EUR") => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currencyCode,
    }).format(amount) // Convert from cents to euros
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Progress Steps - Desktop only */}
        <div className="mb-8 hidden lg:block">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep === step.id ? 'border-blue-600 bg-blue-600 text-white' :
                  step.completed ? 'border-green-600 bg-green-600 text-white' :
                  'border-gray-300 bg-white text-gray-400'
                }`}>
                  {step.completed ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === step.id ? 'text-blue-600' :
                  step.completed ? 'text-green-600' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`ml-8 h-0.5 w-16 ${
                    step.completed ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Current Step Content */}
          <div className="lg:col-span-2">
            {currentStep === "address" && (
              <AddressForm onContinue={() => setCurrentStep("delivery")} />
            )}
            
            {currentStep === "delivery" && (
              <DeliveryForm 
                onContinue={() => setCurrentStep("payment")} 
                onBack={() => setCurrentStep("address")}
              />
            )}

            {currentStep === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-500 text-sm">
                    Los métodos de pago se implementarán en el siguiente paso.
                  </div>
                  <div className="pt-6 flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("delivery")}
                    >
                      Volver
                    </Button>
                    <Button onClick={() => setCurrentStep("review")}>
                      Continuar a revisión
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === "review" && (
              <Card>
                <CardHeader>
                  <CardTitle>Revisar pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-500 text-sm">
                    Revisión final del pedido antes de confirmar.
                  </div>
                  <div className="pt-6 flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("payment")}
                    >
                      Volver
                    </Button>
                    <Button>
                      Confirmar pedido
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>En tu Carrito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                {cart?.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0">
                      {item.variant?.product?.thumbnail && (
                        <img
                          src={item?.thumbnail}
                          alt={item?.title || "Product"}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item?.title || "Product"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Variante: {item?.variant_title || "M"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatPrice((item.unit_price || 0) * item.quantity)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.unit_price || 0)} cada uno
                      </p>
                    </div>
                  </div>
                ))}

                {!cart?.items?.length && (
                  <div className="text-center py-8 text-gray-500">
                    Tu carrito está vacío
                  </div>
                )}

                <Separator />

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal (excl. envío e impuestos)</span>
                    <span>{formatPrice(cart?.item_subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span>{formatPrice(cart?.shipping_subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Impuestos</span>
                    <span>{formatPrice(cart?.tax_total || 0)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(cart?.total || 0)}</span>
                  </div>
                </div>

                {/* Promotion Code */}
                <div className="pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Añadir Código Promocional
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}