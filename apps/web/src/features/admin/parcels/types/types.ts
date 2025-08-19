export interface Courier {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Parcel {
  uuid: string;
  trackingNumber: string;
  status:
    | "DELIVERED"
    | "PENDING"
    | "IN_TRANSIT"
    | "PROCESSING"
    | "CANCELLED"
    | "RETURNED";
  orderId: string;
  courier: Courier;
  estimatedDelivery: string;
  createdAt: string;
}

export interface ParcelFilters {
  search: string;
  status: string;
  courier: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}
