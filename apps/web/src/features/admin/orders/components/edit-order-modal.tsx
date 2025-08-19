"use client"

import { Button } from "#components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog"
import { Input } from "#components/ui/input"
import { Label } from "#components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#components/ui/select"
import { Textarea } from "#components/ui/textarea"
import { CreditCard, Package, User } from "lucide-react"
import { useState } from "react"
import type { Order } from "../types/types"

interface EditOrderModalProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (orderId: string, data: any) => void
}

export function EditOrderModal({ order, open, onOpenChange, onSave }: EditOrderModalProps) {
  const [status, setStatus] = useState(order?.status || "")
  const [notes, setNotes] = useState("")

  const handleSave = () => {
    if (order) {
      onSave(order.id, { status, notes })
      onOpenChange(false)
    }
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Sipariş Düzenle
          </DialogTitle>
          <DialogDescription>Sipariş #{order.orderNumber} bilgilerini düzenleyin</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Sipariş No
              </Label>
              <Input value={order.orderNumber} disabled />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Tutar
              </Label>
              <Input value={`${(order.subtotal / 100).toFixed(2)} TL`} disabled />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Ürün Bilgisi
            </Label>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
              <img
                src={order.firstProduct.primary_photo_url || "/placeholder.svg"}
                alt={order.firstProduct.name}
                className="h-12 w-12 rounded-md object-cover border"
              />
              <div>
                <p className="font-medium">{order.firstProduct.name}</p>
                <p className="text-sm text-muted-foreground">{order.productDisplayText}</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Sipariş Durumu</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Beklemede</SelectItem>
                <SelectItem value="PROCESSING">İşleniyor</SelectItem>
                <SelectItem value="SHIPPED">Kargoda</SelectItem>
                <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notlar</Label>
            <Textarea
              placeholder="Sipariş hakkında notlar ekleyin..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleSave}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
