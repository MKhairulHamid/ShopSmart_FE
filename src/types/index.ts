// API Models based on the ShopSmart C# backend

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  category?: Category;
  orderItems?: OrderItem[];
  isInStock: boolean;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
  orders?: Order[];
  fullName: string;
}

export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customer?: Customer;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  notes?: string;
  updatedAt: string;
  orderItems: OrderItem[];
  fullShippingAddress?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  order?: Order;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  totalPrice: number;
}

// DTO interfaces for API requests
export interface CartItem {
  productId: number;
  quantity: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderRequest {
  customerId: number;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
}

export interface UpdateOrderStatusRequest {
  newStatus: OrderStatus;
}

export interface StockUpdateRequest {
  quantity: number;
}

export interface ProductAvailabilityResponse {
  productId: number;
  productName: string;
  requestedQuantity: number;
  isAvailable: boolean;
  availableStock: number;
}

export interface CategoryWithCountResponse {
  id: number;
  name: string;
  description?: string;
  productCount: number;
  createdAt: string;
}

export interface SalesMetrics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  totalItemsSold: number;
}

// Frontend-specific interfaces
export interface CartItemWithProduct extends CartItem {
  product: Product;
  totalPrice: number;
}

export interface ProductFilters {
  categoryId?: number;
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

export interface OrderFilters {
  customerId?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
