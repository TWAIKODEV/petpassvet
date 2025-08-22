import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { HttpTypes } from '@medusajs/types'

export interface CartItem {
  id: string
  product: HttpTypes.StoreProduct
  variant: HttpTypes.StoreProductVariant
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: HttpTypes.StoreProduct, variant: HttpTypes.StoreProductVariant, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  setIsOpen: (open: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product, variant, quantity = 1) => {
        const existingItemIndex = get().items.findIndex(
          item => item.product.id === product.id && item.variant.id === variant.id
        )
        
        if (existingItemIndex >= 0) {
          // Si el item ya existe, actualizar cantidad
          set(state => ({
            items: state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }))
        } else {
          // Si es un nuevo item, añadirlo
          const newItem: CartItem = {
            id: `${product.id}-${variant.id}`,
            product,
            variant,
            quantity
          }
          set(state => ({
            items: [...state.items, newItem]
          }))
        }
      },
      
      removeItem: (itemId) => {
        set(state => ({
          items: state.items.filter(item => item.id !== itemId)
        }))
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.variant.calculated_price?.original_amount || 0
          return total + (price * item.quantity)
        }, 0)
      },
      
      setIsOpen: (open) => {
        set({ isOpen: open })
      }
    }),
    {
      name: 'cart-storage', // nombre único para localStorage
      partialize: (state) => ({ items: state.items }), // solo persistir los items
    }
  )
)
