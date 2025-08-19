"use client"

import { ParcelsDataTable } from "#components/data-table/parcels-data-table.js"
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card"
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react"
import { useState } from "react"
import { mockParcels } from "./data/data"

export  function Parcels() {
  const [parcels] = useState(mockParcels)

  const stats = {
    total: parcels.length,
    delivered: parcels.filter((p) => p.status === "DELIVERED").length,
    inTransit: parcels.filter((p) => p.status === "IN_TRANSIT").length,
    pending: parcels.filter((p) => p.status === "PENDING").length,
    cancelled: parcels.filter((p) => p.status === "CANCELLED").length,
  }

  return (
    <div className="space-y-6">
      <div className="p-6 pb-0">
        <h1 className="text-3xl font-bold tracking-tight">Kargo Yönetimi</h1>
        <p className="text-muted-foreground">
          Kargolarınızı yönetin, durumlarını takip edin ve kurye atamalarını yapın.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 px-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kargo</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tüm kargolar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teslim Edildi</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">Başarıyla teslim edildi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yolda</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">Teslimat yolunda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beklemede</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">İşlem bekliyor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">İptal Edildi</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">İptal edilen kargolar</p>
          </CardContent>
        </Card>
      </div>

      <div className="px-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Kargo Listesi
          </h2>
          <p className="text-sm text-muted-foreground">Tüm kargolarınızı görüntüleyin, düzenleyin ve yönetin.</p>
        </div>
        <ParcelsDataTable data={parcels} />
      </div>
    </div>
  )
}
