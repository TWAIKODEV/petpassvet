import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCart } from "@/context/CartContextProvider"
import { sdk } from "@/lib/config"
import { FormValidator, type CheckoutFormInput, type CheckoutFormOutput } from "@/validators/formValidator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddressFormProps {
  onContinue?: () => void
}

export default function AddressForm({ onContinue }: AddressFormProps) {
  const { cart, setCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [hasAutoFilled, setHasAutoFilled] = useState(false)

  const form = useForm<CheckoutFormInput, unknown, CheckoutFormOutput>({
    resolver: zodResolver(FormValidator.checkout()),
    defaultValues: {
      email: cart?.email || "",
      firstName: cart?.shipping_address?.first_name || "",
      lastName: cart?.shipping_address?.last_name || "",
      company: cart?.shipping_address?.company || "",
      address: cart?.shipping_address?.address_1 || "",
      postalCode: cart?.shipping_address?.postal_code || "",
      city: cart?.shipping_address?.city || "",
      country: cart?.shipping_address?.country_code || cart?.region?.countries?.[0]?.iso_2 || "",
      province: cart?.shipping_address?.province || "",
      billingAddressSameAsShipping: true,
      billingFirstName: "",
      billingLastName: "",
      billingCompany: "",
      billingAddress: "",
      billingPostalCode: "",
      billingCity: "",
      billingCountry: "",
      billingProvince: "",
    }
  })

  const { control, handleSubmit, formState: { errors }, watch, reset } = form
  const billingAddressSameAsShipping = watch("billingAddressSameAsShipping")

  // Update form values when cart data is loaded (only once to avoid overriding user input)
  useEffect(() => {
    if (cart && !hasAutoFilled && (cart.shipping_address || cart.email)) {
      // Check if billing address is different from shipping address
      const hasDifferentBillingAddress = cart.billing_address && 
        (cart.billing_address.id !== cart.shipping_address?.id ||
         cart.billing_address.first_name !== cart.shipping_address?.first_name ||
         cart.billing_address.last_name !== cart.shipping_address?.last_name ||
         cart.billing_address.address_1 !== cart.shipping_address?.address_1 ||
         cart.billing_address.postal_code !== cart.shipping_address?.postal_code ||
         cart.billing_address.city !== cart.shipping_address?.city ||
         cart.billing_address.country_code !== cart.shipping_address?.country_code)

      reset({
        email: cart.email || "",
        firstName: cart.shipping_address?.first_name || "",
        lastName: cart.shipping_address?.last_name || "",
        company: cart.shipping_address?.company || "",
        address: cart.shipping_address?.address_1 || "",
        postalCode: cart.shipping_address?.postal_code || "",
        city: cart.shipping_address?.city || "",
        country: cart.shipping_address?.country_code || cart.region?.countries?.[0]?.iso_2 || "",
        province: cart.shipping_address?.province || "",
        billingAddressSameAsShipping: !hasDifferentBillingAddress,
        // Billing address (only fill if different from shipping)
        billingFirstName: hasDifferentBillingAddress ? cart.billing_address?.first_name || "" : "",
        billingLastName: hasDifferentBillingAddress ? cart.billing_address?.last_name || "" : "",
        billingCompany: hasDifferentBillingAddress ? cart.billing_address?.company || "" : "",
        billingAddress: hasDifferentBillingAddress ? cart.billing_address?.address_1 || "" : "",
        billingPostalCode: hasDifferentBillingAddress ? cart.billing_address?.postal_code || "" : "",
        billingCity: hasDifferentBillingAddress ? cart.billing_address?.city || "" : "",
        billingCountry: hasDifferentBillingAddress ? cart.billing_address?.country_code || "" : "",
        billingProvince: hasDifferentBillingAddress ? cart.billing_address?.province || "" : "",
      })
      
      setHasAutoFilled(true)
    }
  }, [cart, reset, hasAutoFilled])

  const onSubmit = async (values: CheckoutFormOutput) => {
    if (!cart) return

    setLoading(true)
    try {
      const shippingAddress = {
        first_name: values.firstName,
        last_name: values.lastName,
        address_1: values.address,
        company: values.company || "",
        postal_code: values.postalCode,
        city: values.city,
        country_code: values.country,
        province: values.province || "",
      }

      const billingAddress = values.billingAddressSameAsShipping 
        ? shippingAddress 
        : {
            first_name: values.billingFirstName || values.firstName,
            last_name: values.billingLastName || values.lastName,
            address_1: values.billingAddress || values.address,
            company: values.billingCompany || "",
            postal_code: values.billingPostalCode || values.postalCode,
            city: values.billingCity || values.city,
            country_code: values.billingCountry || values.country,
            province: values.billingProvince || "",
          }

      const { cart: updatedCart } = await sdk.store.cart.update(cart.id, {
        email: values.email,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
      })
      
      setCart(updatedCart)
      
      // Navigate to next step if callback provided
      if (onContinue) {
        onContinue()
      }
    } catch (error) {
      console.error("Error updating cart:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!cart) {
    return <div className="flex justify-center py-8">Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Envío</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contacto</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    {...field}
                    className={errors.email ? "border-red-300" : ""}
                  />
                )}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Shipping Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dirección de Envío</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Nombre"
                      {...field}
                      className={errors.firstName ? "border-red-300" : ""}
                    />
                  )}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos *
                </label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Apellidos"
                      {...field}
                      className={errors.lastName ? "border-red-300" : ""}
                    />
                  )}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Empresa (opcional)"
                    {...field}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección *
              </label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Calle, número, piso..."
                    {...field}
                    className={errors.address ? "border-red-300" : ""}
                  />
                )}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal *
                </label>
                <Controller
                  name="postalCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="28001"
                      {...field}
                      className={errors.postalCode ? "border-red-300" : ""}
                    />
                  )}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Madrid"
                      {...field}
                      className={errors.city ? "border-red-300" : ""}
                    />
                  )}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País *
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={errors.country ? "border-red-300" : ""}>
                        <SelectValue placeholder="Selecciona un país" />
                      </SelectTrigger>
                      <SelectContent>
                        {cart.region?.countries?.map((country) => (
                          <SelectItem key={country.iso_2} value={country.iso_2 || ""}>
                            {country.display_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia
                </label>
                <Controller
                  name="province"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Provincia"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Billing Address Checkbox */}
          <div className="flex items-center">
            <Controller
              name="billingAddressSameAsShipping"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="billing-same-as-shipping"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <label htmlFor="billing-same-as-shipping" className="ml-2 text-sm text-gray-700">
              La dirección de facturación es la misma que la de envío
            </label>
          </div>

          {/* Billing Address Section - Only shown when checkbox is unchecked */}
          {!billingAddressSameAsShipping && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium">Dirección de Facturación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <Controller
                    name="billingFirstName"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Nombre" {...field} />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos
                  </label>
                  <Controller
                    name="billingLastName"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Apellidos" {...field} />
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa
                </label>
                <Controller
                  name="billingCompany"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Empresa (opcional)" {...field} />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <Controller
                  name="billingAddress"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Calle, número, piso..." {...field} />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código Postal
                  </label>
                  <Controller
                    name="billingPostalCode"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="28001" {...field} />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <Controller
                    name="billingCity"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Madrid" {...field} />
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <Controller
                    name="billingCountry"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un país" />
                        </SelectTrigger>
                        <SelectContent>
                          {cart.region?.countries?.map((country) => (
                            <SelectItem key={country.iso_2} value={country.iso_2 || ""}>
                              {country.display_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provincia
                  </label>
                  <Controller
                    name="billingProvince"
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Provincia" {...field} />
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? "Guardando..." : "Continuar con la entrega"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
