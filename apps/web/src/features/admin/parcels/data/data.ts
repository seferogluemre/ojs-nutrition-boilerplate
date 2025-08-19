import type { Parcel } from "../types/parcel-types"

export const mockParcels: Parcel[] = [
  {
    uuid: "7e4f2b60-7d3d-40d6-82ef-33ea98b8e0f5",
    trackingNumber: "OJS54565236BJP3",
    status: "DELIVERED",
    orderId: "abdc3e1d-4387-4fa6-ac2a-e02080d16fbc",
    courier: {
      id: "c7376ada-60e9-4d67-b184-b64ae9c9716b",
      firstName: "Ahmet",
      lastName: "Mehmetoglu",
    },
    estimatedDelivery: "2025-08-20T18:16:05.233Z",
    createdAt: "2025-08-17T18:16:05.253Z",
  },
  {
    uuid: "8f5g3c70-8e4e-51e7-93fg-44fb09c9827g6",
    trackingNumber: "TRK98765432DEF1",
    status: "IN_TRANSIT",
    orderId: "bcde4f2e-5498-5gb7-bd3b-f13191e27gcd",
    courier: {
      id: "d8487beb-71f0-5e78-c295-c75bf0d0827h",
      firstName: "Mehmet",
      lastName: "Yılmaz",
    },
    estimatedDelivery: "2025-08-22T14:30:00.000Z",
    createdAt: "2025-08-18T10:45:12.456Z",
  },
  {
    uuid: "9g6h4d81-9f5f-62f8-04gh-55gc10d0938h7",
    trackingNumber: "PKG11223344GHI2",
    status: "PENDING",
    orderId: "cdef5g3f-6509-6hc8-ce4c-g24202f38hde",
    courier: {
      id: "e9598cfc-82g1-6f89-d306-d86cg1e1938i",
      firstName: "Ayşe",
      lastName: "Kaya",
    },
    estimatedDelivery: "2025-08-25T16:00:00.000Z",
    createdAt: "2025-08-19T08:20:30.789Z",
  },
  {
    uuid: "0h7i5e92-0g6g-73g9-15hi-66hd21e1049i8",
    trackingNumber: "SHP55667788JKL3",
    status: "PROCESSING",
    orderId: "defg6h4g-7610-7id9-df5d-h35313g49ief",
    courier: {
      id: "f0609dfd-93h2-7g90-e417-e97dh2f2049j",
      firstName: "Fatma",
      lastName: "Demir",
    },
    estimatedDelivery: "2025-08-24T12:15:00.000Z",
    createdAt: "2025-08-18T15:10:45.123Z",
  },
  {
    uuid: "1i8j6f03-1h7h-84h0-26ij-77ie32f2150j9",
    trackingNumber: "DLV99887766MNO4",
    status: "CANCELLED",
    orderId: "efgh7i5h-8721-8je0-eg6e-i46424h50jfg",
    courier: {
      id: "g1710efe-04i3-8h01-f528-f08ei3g3150k",
      firstName: "Ali",
      lastName: "Özkan",
    },
    estimatedDelivery: "2025-08-21T09:45:00.000Z",
    createdAt: "2025-08-17T13:25:18.654Z",
  },
]

export const mockCouriers = [
  { id: "c7376ada-60e9-4d67-b184-b64ae9c9716b", firstName: "Ahmet", lastName: "Mehmetoglu" },
  { id: "d8487beb-71f0-5e78-c295-c75bf0d0827h", firstName: "Mehmet", lastName: "Yılmaz" },
  { id: "e9598cfc-82g1-6f89-d306-d86cg1e1938i", firstName: "Ayşe", lastName: "Kaya" },
  { id: "f0609dfd-93h2-7g90-e417-e97dh2f2049j", firstName: "Fatma", lastName: "Demir" },
  { id: "g1710efe-04i3-8h01-f528-f08ei3g3150k", firstName: "Ali", lastName: "Özkan" },
]
