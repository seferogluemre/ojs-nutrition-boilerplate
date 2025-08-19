import { Parcel } from "../../types/types";

export interface ParcelDimensions {
  length: number;
  width: number;
  height: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
}

export interface ParcelRoute {
  fromCity: string;
  toCity: string;
  distance: number;
  estimatedDuration: number;
}

export interface ParcelEvent {
  id: string;
  type:
    | "CREATED"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "ARRIVED_AT_HUB"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
  description: string;
  location: string;
  timestamp: string;
  createdBy: string;
}

export interface ParcelDetail extends Parcel {
  weight: number;
  dimensions: ParcelDimensions;
  shippingAddress: ShippingAddress;
  route: ParcelRoute;
  actualDelivery?: string;
  events: ParcelEvent[];
}
