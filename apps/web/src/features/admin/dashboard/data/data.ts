import { Order } from "../types/types";

export const data = [
  { name: 'Oca', revenue: 4000, orders: 240 },
  { name: 'Şub', revenue: 3000, orders: 139 },
  { name: 'Mar', revenue: 2000, orders: 980 },
  { name: 'Nis', revenue: 2780, orders: 390 },
  { name: 'May', revenue: 1890, orders: 480 },
  { name: 'Haz', revenue: 2390, orders: 380 },
  { name: 'Tem', revenue: 3490, orders: 430 },
  { name: 'Ağu', revenue: 4000, orders: 520 },
  { name: 'Eyl', revenue: 3200, orders: 450 },
  { name: 'Eki', revenue: 2800, orders: 380 },
  { name: 'Kas', revenue: 3800, orders: 490 },
  { name: 'Ara', revenue: 4200, orders: 560 },
];


export const orders: Order[] = [
  {
    id: "#3210",
    customer: {
      name: "Ahmet Yılmaz",
      email: "ahmet@example.com",
    },
    amount: "₺299.00",
    status: "delivered",
    date: "2 saat önce"
  },
  {
    id: "#3209",
    customer: {
      name: "Ayşe Kaya",
      email: "ayse@example.com",
    },
    amount: "₺150.00",
    status: "shipped",
    date: "4 saat önce"
  },
  {
    id: "#3208",
    customer: {
      name: "Mehmet Demir",
      email: "mehmet@example.com",
    },
    amount: "₺89.00",
    status: "processing",
    date: "6 saat önce"
  },
  {
    id: "#3207",
    customer: {
      name: "Fatma Özkan",
      email: "fatma@example.com",
    },
    amount: "₺199.00",
    status: "pending",
    date: "8 saat önce"
  },
  {
    id: "#3206",
    customer: {
      name: "Ali Çelik",
      email: "ali@example.com",
    },
    amount: "₺75.00",
    status: "cancelled",
    date: "1 gün önce"
  }
];