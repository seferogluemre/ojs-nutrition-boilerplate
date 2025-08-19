export interface Order {
    id: string
    orderNumber: string
    createdAt: string
    status: OrderStatus
    subtotal: number
    itemCount: number
    productDisplayText: string
    firstProduct: {
      name: string
      primary_photo_url: string
    }
  }
  
  export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
  
  export interface OrderFilters {
    status?: OrderStatus
    dateFrom?: string
    dateTo?: string
    search?: string
  }
  