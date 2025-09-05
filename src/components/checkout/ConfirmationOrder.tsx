import { HttpTypes } from "@medusajs/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, Mail, Download } from "lucide-react"
import { Link } from "react-router-dom"

interface ConfirmationOrderProps {
  order: HttpTypes.StoreOrder
}

export default function ConfirmationOrder({ order }: ConfirmationOrderProps) {
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: order?.currency_code || "EUR",
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Pedido realizado con éxito!
            </h1>
            <p className="text-gray-600 mb-4">
              Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
            </p>
            <div className="bg-white rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-500">Número de pedido</p>
              <p className="text-xl font-mono font-bold text-gray-900">#{order.display_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Información del pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha del pedido:</span>
              <span className="font-medium">{formatDate(order.created_at as string)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{order.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado del pago:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {order.payment_status === 'captured' ? 'Pagado' : order.payment_status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado del envío:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {order.fulfillment_status === 'not_fulfilled' ? 'Procesando' : order.fulfillment_status}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Información de envío
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.shipping_address && (
              <div className="space-y-1">
                <p className="font-medium">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p className="text-gray-600">{order.shipping_address.address_1}</p>
                {order.shipping_address.address_2 && (
                  <p className="text-gray-600">{order.shipping_address.address_2}</p>
                )}
                <p className="text-gray-600">
                  {order.shipping_address.postal_code} {order.shipping_address.city}
                </p>
                <p className="text-gray-600">{order.shipping_address.country_code}</p>
                {order.shipping_address.phone && (
                  <p className="text-gray-600">Tel: {order.shipping_address.phone}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Productos pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title || "Producto"}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {item.title}
                  </p>
                  {item.variant_title && (
                    <p className="text-sm text-gray-500">
                      Variante: {item.variant_title}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatPrice(item.total || 0)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPrice(item.unit_price || 0)} cada uno
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Order Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal (excl. impuestos)</span>
              <span>{formatPrice(order.subtotal ?? 0)}</span>
            </div>
            {(order.discount_total ?? 0) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Descuentos</span>
                <span>-{formatPrice(order.discount_total ?? 0)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Envío</span>
              <span>{formatPrice(order.shipping_total ?? 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Impuestos</span>
              <span>{formatPrice(order.tax_total ?? 0)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.total ?? 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>¿Qué sigue?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium mb-1">Confirmación por email</h3>
              <p className="text-sm text-gray-600">
                Te hemos enviado un email de confirmación a {order.email}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium mb-1">Preparación</h3>
              <p className="text-sm text-gray-600">
                Prepararemos tu pedido en 1-2 días laborales
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Truck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-medium mb-1">Envío</h3>
              <p className="text-sm text-gray-600">
                Te notificaremos cuando tu pedido esté en camino
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Descargar factura
        </Button>
        <Button asChild>
          <Link to="/tienda/productos">
            Seguir comprando
          </Link>
        </Button>
      </div>
    </div>
  )
}
