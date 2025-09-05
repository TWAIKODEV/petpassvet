"use client" // include with Next.js 13+

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState,
  useCallback,
} from "react"
import { HttpTypes } from "@medusajs/types"
import { useRegion } from "@/context/RegionContextProvider"
import { sdk } from "@/lib/config"

type CartContextType = {
  cart?: HttpTypes.StoreCart
  setCart: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreCart | undefined>
  >
  refreshCart: () => Promise<void>
  refreshCartFromServer: () => Promise<void>
  isInitialized: boolean
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
  const refreshCartFromServer = useCallback(async (): Promise<void> => {
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
      // Si falla recuperar el carrito, limpiar localStorage y crear uno nuevo
      localStorage.removeItem("cart_id")
      setCart(undefined)
      
      // Crear un nuevo carrito si tenemos región
      if (region) {
        try {
          const { cart: newCart } = await sdk.store.cart.create({
            region_id: region.id,
          })
          setCart(newCart)
          localStorage.setItem("cart_id", newCart.id)
        } catch (createError) {
          console.error("Error creating new cart:", createError)
        }
      }
    }
  }, [region, setCart])

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
          localStorage.setItem("cart_id", dataCart.id)
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
  }, [isInitialized, region, refreshCartFromServer])

  const refreshCart = useCallback(async () => {
    localStorage.removeItem("cart_id")
    setCart(undefined)
    
    // Crear un nuevo carrito inmediatamente si tenemos región
    if (region) {
      try {
        const { cart: newCart } = await sdk.store.cart.create({
          region_id: region.id,
        })
        setCart(newCart)
        localStorage.setItem("cart_id", newCart.id)
      } catch (error) {
        console.error("Error creating cart during refresh:", error)
        setIsInitialized(false) // Solo reinicializar si hay error
      }
    } else {
      setIsInitialized(false) // Reinicializar si no hay región
    }
  }, [region, setCart, setIsInitialized])



  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      refreshCart,
      refreshCartFromServer,
      isInitialized,
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