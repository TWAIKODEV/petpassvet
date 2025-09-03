import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/lib/config"

export const addToCart = async (variant_id: string, quantity: number = 1) => {
  const cartId = localStorage.getItem("cart_id")

  if (!cartId) {
    throw new Error("No cart found")
  }

  try {
    const { cart } = await sdk.store.cart.createLineItem(cartId, {
      variant_id,
      quantity,
    })
    return cart
  } catch (error) {
    console.error("Error adding product to cart:", error)
    throw error
  }
}

export const updateQuantity = async (
  itemId: string,
  quantity: number
) => {
  const cartId = localStorage.getItem("cart_id")

  if (!cartId) {
    throw new Error("No cart found")
  }

  try {
    const { cart } = await sdk.store.cart.updateLineItem(cartId, itemId, {
      quantity,
    })
    return cart
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw error
  }
}

export const removeItem = async (itemId: string) => {
  const cartId = localStorage.getItem("cart_id")

  if (!cartId) {
    throw new Error("No cart found")
  }

  try {
    const { parent: cart } = await sdk.store.cart.deleteLineItem(cartId, itemId)
    return cart
  } catch (error) {
    console.error("Error removing item from cart:", error)
    throw error
  }
}

export const formatPrice = (amount: number, currencyCode: string): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currencyCode,
  }).format(amount) // MedusaJS stores prices in cents
}

export const getCartTotal = (cart: HttpTypes.StoreCart): number => {
  return cart.total || 0
}

export const getCartItemsCount = (cart: HttpTypes.StoreCart): number => {
  return cart.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0
}
