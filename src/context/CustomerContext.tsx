import React, { createContext, useContext, useState, useEffect } from 'react'
import { Customer } from '../types'
import { customerApi } from '../services/api'

interface CustomerState {
  customer: Customer | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface CustomerContextType extends CustomerState {
  login: (email: string) => Promise<void>
  logout: () => void
  register: (customerData: Omit<Customer, 'id' | 'createdAt' | 'orders' | 'fullName'>) => Promise<void>
  updateProfile: (customerData: Partial<Customer>) => Promise<void>
  clearError: () => void
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

const CUSTOMER_STORAGE_KEY = 'shopSmart_customer'

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CustomerState>({
    customer: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Load customer from localStorage on mount
  useEffect(() => {
    try {
      const savedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY)
      if (savedCustomer) {
        const customer = JSON.parse(savedCustomer) as Customer
        setState(prev => ({
          ...prev,
          customer,
          isAuthenticated: true,
          isLoading: false,
        }))
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error('Error loading customer from localStorage:', error)
      setState(prev => ({ ...prev, isLoading: false, error: 'Failed to load customer data' }))
    }
  }, [])

  // Save customer to localStorage whenever it changes
  useEffect(() => {
    if (state.customer) {
      try {
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(state.customer))
      } catch (error) {
        console.error('Error saving customer to localStorage:', error)
      }
    } else {
      localStorage.removeItem(CUSTOMER_STORAGE_KEY)
    }
  }, [state.customer])

  const login = async (email: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // In a real app, this would be a proper authentication endpoint
      // For now, we'll search for the customer by email
      const customers = await customerApi.searchCustomers(email)
      const customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase())
      
      if (!customer) {
        throw new Error('Customer not found. Please register first.')
      }

      setState(prev => ({
        ...prev,
        customer,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }))
      throw error
    }
  }

  const logout = (): void => {
    setState({
      customer: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  }

  const register = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'orders' | 'fullName'>): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const newCustomer = await customerApi.createCustomer(customerData)
      
      setState(prev => ({
        ...prev,
        customer: newCustomer,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }))
      throw error
    }
  }

  const updateProfile = async (customerData: Partial<Customer>): Promise<void> => {
    if (!state.customer) {
      throw new Error('No customer logged in')
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const updatedCustomer = await customerApi.updateCustomer(state.customer.id, customerData)
      
      setState(prev => ({
        ...prev,
        customer: updatedCustomer,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Profile update failed',
      }))
      throw error
    }
  }

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }))
  }

  const contextValue: CustomerContextType = {
    ...state,
    login,
    logout,
    register,
    updateProfile,
    clearError,
  }

  return <CustomerContext.Provider value={contextValue}>{children}</CustomerContext.Provider>
}

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext)
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider')
  }
  return context
}
