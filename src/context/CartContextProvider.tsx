"use client" // include with Next.js 13+

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState,
} from "react"
import { HttpTypes } from "@medusajs/types"
import { useRegion } from "@/context/RegionContextProvider"
import { sdk } from "@/lib/config"

type CartContextType = {
  cart?: HttpTypes.StoreCart
  setCart: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreCart | undefined>
  >
  refreshCart: () => void
  refreshCartFromServer: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

type CartProviderProps = {
  children: React.ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<
    HttpTypes.StoreCart | undefined
  >()
  const [isInitialized, setIsInitialized] = useState(false)
  const { region } = useRegion()

  // Función para recuperar el carrito del servidor
  const refreshCartFromServer = async (): Promise<void> => {
    const cartId = localStorage.getItem("cart_id")
    if (!cartId) {
      console.log("No cart ID found")
      return
    }

    try {
      const { cart: dataCart } = await sdk.store.cart.retrieve(cartId, {
        fields: "*items.variant.product"
      })
      setCart(dataCart)
    } catch (error) {
      console.error("Error refreshing cart from server:", error)
      // Si falla recuperar el carrito, limpiar localStorage
      localStorage.removeItem("cart_id")
      setCart(undefined)
    }
  }

  // useEffect para inicialización del carrito (solo se ejecuta una vez)
  useEffect(() => {
    if (isInitialized || !region) {
      return
    }

    const initializeCart = async () => {
      const cartId = localStorage.getItem("cart_id")
      if (!cartId) {
        // create a cart
        try {
          const { cart: dataCart } = await sdk.store.cart.create({
            region_id: region.id,
          })
          setCart(dataCart)
        } catch (error) {
          console.error("Error creating cart:", error)
        }
      } else {
        // retrieve cart inicialmente
        await refreshCartFromServer()
      }
      setIsInitialized(true)
    }

    initializeCart()
  }, [isInitialized, region])

  const refreshCart = () => {
    localStorage.removeItem("cart_id")
    setCart(undefined)
    setIsInitialized(false)
  }



  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      refreshCart,
      refreshCartFromServer,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}