"use client"

import { ConfirmDialog } from "#components/confirm-dialog"
import { OrdersDataTable } from "#components/data-table/orders-data-table"
import { Button } from "#components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#components/ui/card"
import { EditOrderModal } from "#features/admin/orders/components/edit-order-modal"
import { OrderFilters } from "#features/admin/orders/components/orders-filter"
import { CheckCircle, Clock, Package, Plus, ShoppingBag, TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"
import { mockOrders } from "./data/data"
import type { Order, OrderFilters as OrderFiltersType } from "./types/types"

export  function Orders() {
  const [filters, setFilters] = useState<OrderFiltersType>({})
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null)

  // Filter orders based on current filters
  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      if (filters.status && order.status !== filters.status) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.firstProduct.name.toLowerCase().includes(searchLower) ||
          order.productDisplayText.toLowerCase().includes(searchLower)
        )
      }
      if (filters.dateFrom) {
        const orderDate = new Date(order.createdAt)
        const fromDate = new Date(filters.dateFrom)
        if (orderDate < fromDate) return false
      }
      if (filters.dateTo) {
        const orderDate = new Date(order.createdAt)
        const toDate = new Date(filters.dateTo)
        if (orderDate > toDate) return false
      }
      return true
    })
  }, [filters])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalOrders = mockOrders.length
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.subtotal, 0)
    const pendingOrders = mockOrders.filter((order) => order.status === "PENDING").length
    const deliveredOrders = mockOrders.filter((order) => order.status === "DELIVERED").length

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
    }
  }, [])

  const handleViewOrder = (orderId: string) => {
    console.log("[v0] View order:", orderId)
    // TODO: Navigate to order detail page
  }

  const handleEditOrder = (orderId: string) => {
    const order = mockOrders.find((o) => o.id === orderId)
    if (order) {
      setEditingOrder(order)
    }
  }

  const handleDeleteOrder = (orderId: string) => {
    const order = mockOrders.find((o) => o.id === orderId)
    if (order) {
      setDeletingOrder(order)
    }
  }

  const handleSaveOrder = (orderId: string, data: any) => {
    console.log("[v0] Save order:", orderId, data)
    // TODO: Update order in database
  }

  const handleConfirmDelete = (orderId: string) => {
    console.log("[v0] Confirm delete order:", orderId)
    // TODO: Delete order from database
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(price / 100)
  }

  return (
    <div className="space-y-6 p-6 min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            Siparişler
          </h1>
          <p className="text-muted-foreground mt-1">E-ticaret siparişlerinizi yönetin ve takip edin</p>
        </div>
        <Button className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Yeni Sipariş
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+12% geçen aydan</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">+8% geçen aydan</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">İşlem bekliyor</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teslim Edildi</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">Başarıyla tamamlandı</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <OrderFilters filters={filters} onFiltersChange={setFilters} onClearFilters={handleClearFilters} />

      {/* Orders Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Sipariş Listesi
          </CardTitle>
          <CardDescription>{filteredOrders.length} sipariş gösteriliyor</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
         <OrdersDataTable
          data={filteredOrders}
          onView={handleViewOrder}
          onEdit={handleEditOrder}
          onDelete={handleDeleteOrder}
        />
        </CardContent>
      </Card>

      <EditOrderModal
        order={editingOrder}
        open={!!editingOrder}
        onOpenChange={(open) => !open && setEditingOrder(null)}
        onSave={handleSaveOrder}
      />

      <ConfirmDialog
        open={!!deletingOrder}
        onOpenChange={(open: boolean) => !open && setDeletingOrder(null)}
        title="Sipariş Sil"
        desc="Siparişi silmek istediğinize emin misiniz?"
        cancelBtnText="İptal"
        confirmText="Sil"
        destructive
        handleConfirm={() => handleConfirmDelete(deletingOrder?.id ?? "")}
      />
    </div>
  )
}
