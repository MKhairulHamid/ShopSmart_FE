import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { CartItemWithProduct, Product } from '../types'

interface CartState {
  items: CartItemWithProduct[]
  totalItems: number
  totalAmount: number
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItemWithProduct[] }

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getItemQuantity: (productId: number) => number
  isItemInCart: (productId: number) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'shopSmart_cart'

// Helper function to calculate totals
const calculateTotals = (items: CartItemWithProduct[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0)
  return { totalItems, totalAmount }
}

// Helper function to create cart item with product
const createCartItem = (product: Product, quantity: number): CartItemWithProduct => ({
  productId: product.id,
  quantity,
  product,
  totalPrice: product.price * quantity,
})

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload
      const existingItemIndex = state.items.findIndex(item => item.productId === product.id)
      
      let newItems: CartItemWithProduct[]
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? {
                ...item, 
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * item.product.price
              }
            : item
        )
      } else {
        // Add new item
        newItems = [...state.items, createCartItem(product, quantity)]
      }
      
      const { totalItems, totalAmount } = calculateTotals(newItems)
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.productId !== action.payload.productId)
      const { totalItems, totalAmount } = calculateTotals(newItems)
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } })
      }
      
      const newItems = state.items.map(item => 
        item.productId === productId 
          ? {
              ...item, 
              quantity,
              totalPrice: quantity * item.product.price
            }
          : item
      )
      
      const { totalItems, totalAmount } = calculateTotals(newItems)
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
      }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      }
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      }
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      }
    
    case 'LOAD_CART': {
      const items = action.payload
      const { totalItems, totalAmount } = calculateTotals(items)
      
      return {
        ...state,
        items,
        totalItems,
        totalAmount,
      }
    }
    
    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isOpen: false,
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartItemWithProduct[]
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [state.items])

  const addItem = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }

  const removeItem = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const getItemQuantity = (productId: number): number => {
    const item = state.items.find(item => item.productId === productId)
    return item ? item.quantity : 0
  }

  const isItemInCart = (productId: number): boolean => {
    return state.items.some(item => item.productId === productId)
  }

  const contextValue: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getItemQuantity,
    isItemInCart,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
