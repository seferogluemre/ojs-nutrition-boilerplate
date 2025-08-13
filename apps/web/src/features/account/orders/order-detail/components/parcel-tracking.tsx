"use client"

import { Badge } from "#components/ui/badge.js"
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card.js"
import { Calendar, CheckCircle, Clock, MapPin, Package, QrCode, Truck } from "lucide-react"

interface ParcelEvent {
  uuid: string
  eventType: string
  description: string
  location: string | null
  createdAt: string
}

interface Parcel {
  uuid: string
  trackingNumber: string
  status: string
  estimatedDelivery: string | null
  actualDelivery: string | null
  events: ParcelEvent[]
  route: {
    cities: string[]
    totalDistance: number
    estimatedDuration: number
  }
}

// Mock data - gerçek JSON'unuzdan alınan veri
const mockParcelData: Parcel = {
  uuid: "751711ad-873b-4eda-b5f5-2cf05b54ec73",
  trackingNumber: "OJS00986159QND8",
  status: "DELIVERED",
  estimatedDelivery: null,
  actualDelivery: "2025-08-12T15:46:56.241Z",
  route: {
    cities: ["İstanbul", "Ağın"],
    totalDistance: 500,
    estimatedDuration: 9,
  },
  events: [
    {
      uuid: "1b8e5f6d-a49f-46e6-b5f0-8803dbd4aabf",
      eventType: "LOCATION_UPDATE",
      description: "Ahmet ****** Rize Merkez'ye ulaştı",
      location: "Cumhuriyet Caddesi, 53020 Rize, Türkiye",
      createdAt: "2025-08-12T15:43:29.059Z",
    },
    {
      uuid: "7188828b-5231-4f64-bacd-cebb42fa3625",
      eventType: "STATUS_CHANGE",
      description: "Rize Çay Şube",
      location: "Rize merkez",
      createdAt: "2025-08-12T15:45:08.593Z",
    },
    {
      uuid: "c9a365a4-f950-4c88-84ad-80ac69612ada",
      eventType: "QR_GENERATED",
      description: "Teslimat için QR kod oluşturuldu",
      location: null,
      createdAt: "2025-08-12T15:45:12.718Z",
    },
    {
      uuid: "43e6bdbd-dd29-4acf-a9d1-b57abeed4e90",
      eventType: "DELIVERED",
      description: "Paket QR kod ile başarıyla teslim edildi",
      location: null,
      createdAt: "2025-08-12T15:46:56.245Z",
    },
  ],
}

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case "LOCATION_UPDATE":
      return <MapPin className="w-4 h-4" />
    case "STATUS_CHANGE":
      return <Truck className="w-4 h-4" />
    case "QR_GENERATED":
      return <QrCode className="w-4 h-4" />
    case "DELIVERED":
      return <CheckCircle className="w-4 h-4" />
    default:
      return <Package className="w-4 h-4" />
  }
}

const getEventColor = (eventType: string) => {
  switch (eventType) {
    case "LOCATION_UPDATE":
      return "bg-blue-500"
    case "STATUS_CHANGE":
      return "bg-orange-500"
    case "QR_GENERATED":
      return "bg-purple-500"
    case "DELIVERED":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Teslim Edildi
        </Badge>
      )
    case "OUT_FOR_DELIVERY":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <Truck className="w-3 h-3 mr-1" />
          Dağıtımda
        </Badge>
      )
    case "IN_TRANSIT":
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
          <Package className="w-3 h-3 mr-1" />
          Yolda
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      )
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
}

export default function ParcelTracking() {
  const parcel = mockParcelData
  const sortedEvents = [...parcel.events].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  return (
    <div className="space-y-6">
      {/* Parcel Header */}
      <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Kargo Takip</CardTitle>
              <p className="text-sm text-gray-600 mt-1">#{parcel.trackingNumber}</p>
            </div>
            {getStatusBadge(parcel.status)}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>
                {parcel.route.cities[0]} → {parcel.route.cities[parcel.route.cities.length - 1]}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-gray-500" />
              <span>{parcel.route.totalDistance} km</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Status */}
      {parcel.actualDelivery && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Paket Teslim Edildi!</h3>
                <p className="text-sm text-green-600">
                  {formatDate(parcel.actualDelivery).date} - {formatDate(parcel.actualDelivery).time}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {parcel.estimatedDelivery && !parcel.actualDelivery && (
        <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800">Tahmini Teslimat</h3>
                <p className="text-sm text-orange-600">
                  {formatDate(parcel.estimatedDelivery).date} - {formatDate(parcel.estimatedDelivery).time}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kargo Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {/* Events */}
            <div className="space-y-6">
              {sortedEvents.map((event, index) => {
                const { date, time } = formatDate(event.createdAt)
                const isLast = index === sortedEvents.length - 1
                const isDelivered = event.eventType === "DELIVERED"

                return (
                  <div key={event.uuid} className="relative flex items-start space-x-4">
                    {/* Timeline Dot */}
                    <div
                      className={`relative z-10 w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${getEventColor(
                        event.eventType,
                      )} ${isDelivered ? "animate-pulse" : ""}`}
                    >
                      <div className="text-white">{getEventIcon(event.eventType)}</div>
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 min-w-0 pb-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{event.description}</h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              isDelivered
                                ? "border-green-200 text-green-700 bg-green-50"
                                : "border-gray-200 text-gray-600"
                            }`}
                          >
                            {time}
                          </Badge>
                        </div>

                        {event.location && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{date}</span>
                        </div>

                        {isDelivered && (
                          <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-200">
                            <p className="text-xs text-green-700 font-medium">✅ Paket başarıyla teslim edilmiştir</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Summary */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Rota Özeti</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Toplam Mesafe</p>
              <p className="font-medium">{parcel.route.totalDistance} km</p>
            </div>
            <div>
              <p className="text-gray-600">Tahmini Süre</p>
              <p className="font-medium">{parcel.route.estimatedDuration} saat</p>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-full"></div>
            </div>
            <span className="text-xs text-green-600 font-medium">Tamamlandı</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
