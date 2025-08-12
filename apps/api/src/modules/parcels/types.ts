export enum ParcelStatus {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED', 
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export interface ParcelRoute {
  cities: string[];
  currentCityIndex: number;
}

export interface ParcelCoordinates {
  lat: number;
  lng: number;
}

export interface ParcelEventMetadata {
  previousStatus?: ParcelStatus;
  courierName?: string;
  estimatedTime?: string;
  [key: string]: any;
}

export interface ParcelIndexQuery {
  page?: number;
  limit?: number;
  status?: string;
  courierId?: string;
  search?: string;
}

export interface CourierAssignedQuery {
  status?: string;
  page?: number;
  limit?: number;
}
