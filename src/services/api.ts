import axios from 'axios';
import {
  Product,
  Category,
  Customer,
  Order,
  ProductFilters,
  OrderFilters,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  StockUpdateRequest,
  ProductAvailabilityResponse,
  CategoryWithCountResponse,
  SalesMetrics,
  OrderStatus
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // Will be proxied by Vite to the backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API
export const productApi = {
  // GET /api/product
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const response = await api.get<Product[]>('/product', { params: filters });
    return response.data;
  },

  // GET /api/product/{id}
  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/product/${id}`);
    return response.data;
  },

  // GET /api/product/sku/{sku}
  getProductBySku: async (sku: string): Promise<Product> => {
    const response = await api.get<Product>(`/product/sku/${sku}`);
    return response.data;
  },

  // POST /api/product
  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isInStock'>): Promise<Product> => {
    const response = await api.post<Product>('/product', product);
    return response.data;
  },

  // PUT /api/product/{id}
  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/product/${id}`, product);
    return response.data;
  },

  // DELETE /api/product/{id}
  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/product/${id}`);
  },

  // PATCH /api/product/{id}/stock
  updateStock: async (id: number, stockUpdate: StockUpdateRequest): Promise<void> => {
    await api.patch(`/product/${id}/stock`, stockUpdate);
  },

  // GET /api/product/low-stock
  getLowStockProducts: async (threshold: number = 10): Promise<Product[]> => {
    const response = await api.get<Product[]>('/product/low-stock', { params: { threshold } });
    return response.data;
  },

  // GET /api/product/{id}/availability
  checkAvailability: async (id: number, quantity: number = 1): Promise<ProductAvailabilityResponse> => {
    const response = await api.get<ProductAvailabilityResponse>(`/product/${id}/availability`, { params: { quantity } });
    return response.data;
  },
};

// Category API
export const categoryApi = {
  // GET /api/category
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/category');
    return response.data;
  },

  // GET /api/category/{id}
  getCategory: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/category/${id}`);
    return response.data;
  },

  // POST /api/category
  createCategory: async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'products'>): Promise<Category> => {
    const response = await api.post<Category>('/category', category);
    return response.data;
  },

  // PUT /api/category/{id}
  updateCategory: async (id: number, category: Partial<Category>): Promise<Category> => {
    const response = await api.put<Category>(`/category/${id}`, category);
    return response.data;
  },

  // DELETE /api/category/{id}
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/category/${id}`);
  },

  // GET /api/category/with-counts
  getCategoriesWithCounts: async (): Promise<CategoryWithCountResponse[]> => {
    const response = await api.get<CategoryWithCountResponse[]>('/category/with-counts');
    return response.data;
  },
};

// Customer API
export const customerApi = {
  // GET /api/customer
  getCustomers: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>('/customer');
    return response.data;
  },

  // GET /api/customer/{id}
  getCustomer: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customer/${id}`);
    return response.data;
  },

  // POST /api/customer
  createCustomer: async (customer: Omit<Customer, 'id' | 'createdAt' | 'orders' | 'fullName'>): Promise<Customer> => {
    const response = await api.post<Customer>('/customer', customer);
    return response.data;
  },

  // PUT /api/customer/{id}
  updateCustomer: async (id: number, customer: Partial<Customer>): Promise<Customer> => {
    const response = await api.put<Customer>(`/customer/${id}`, customer);
    return response.data;
  },

  // DELETE /api/customer/{id}
  deleteCustomer: async (id: number): Promise<void> => {
    await api.delete(`/customer/${id}`);
  },

  // GET /api/customer/search
  searchCustomers: async (term: string): Promise<Customer[]> => {
    const response = await api.get<Customer[]>('/customer/search', { params: { term } });
    return response.data;
  },
};

// Order API
export const orderApi = {
  // GET /api/order
  getOrders: async (filters?: OrderFilters): Promise<Order[]> => {
    const response = await api.get<Order[]>('/order', { params: filters });
    return response.data;
  },

  // GET /api/order/{id}
  getOrder: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/order/${id}`);
    return response.data;
  },

  // POST /api/order
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>('/order', request);
    return response.data;
  },

  // PUT /api/order/{id}/status
  updateOrderStatus: async (id: number, request: UpdateOrderStatusRequest): Promise<Order> => {
    const response = await api.put<Order>(`/order/${id}/status`, request);
    return response.data;
  },

  // POST /api/order/{id}/cancel
  cancelOrder: async (id: number): Promise<void> => {
    await api.post(`/order/${id}/cancel`);
  },

  // GET /api/order/customer/{customerId}
  getCustomerOrders: async (customerId: number): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/order/customer/${customerId}`);
    return response.data;
  },

  // GET /api/order/metrics
  getSalesMetrics: async (startDate: string, endDate: string): Promise<SalesMetrics> => {
    const response = await api.get<SalesMetrics>('/order/metrics', { 
      params: { startDate, endDate } 
    });
    return response.data;
  },
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data || 'An error occurred';
      console.error('API Error:', message);
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
);

export default api;
