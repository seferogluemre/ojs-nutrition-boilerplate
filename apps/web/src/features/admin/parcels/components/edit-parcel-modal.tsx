"use client";

import { Button } from "#components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog";
import { Input } from "#components/ui/input";
import { Label } from "#components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import { CalendarIcon, Package, Truck, User } from "lucide-react";
import { useState } from "react";
import { mockCouriers } from "../data/data";
import { Parcel } from "../types/types";

interface EditParcelModalProps {
  parcel: Parcel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (parcel: Parcel) => void;
}

export function EditParcelModal({
  parcel,
  open,
  onOpenChange,
  onSave,
}: EditParcelModalProps) {
  const [formData, setFormData] = useState<Partial<Parcel>>({});

  const handleSave = () => {
    if (parcel && formData) {
      onSave({ ...parcel, ...formData });
      onOpenChange(false);
    }
  };

  if (!parcel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Kargo Düzenle
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="trackingNumber"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Takip Numarası
              </Label>
              <Input
                id="trackingNumber"
                defaultValue={parcel.trackingNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    trackingNumber: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Durum
              </Label>
              <Select
                defaultValue={parcel.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as Parcel["status"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Beklemede</SelectItem>
                  <SelectItem value="PROCESSING">İşleniyor</SelectItem>
                  <SelectItem value="IN_TRANSIT">Yolda</SelectItem>
                  <SelectItem value="DELIVERED">Teslim Edildi</SelectItem>
                  <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
                  <SelectItem value="RETURNED">İade Edildi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courier" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Kurye
            </Label>
            <Select
              defaultValue={parcel.courier.id}
              onValueChange={(value) => {
                const selectedCourier = mockCouriers.find(
                  (c) => c.id === value,
                );
                if (selectedCourier) {
                  setFormData((prev) => ({
                    ...prev,
                    courier: selectedCourier,
                  }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockCouriers.map((courier) => (
                  <SelectItem key={courier.id} value={courier.id}>
                    {courier.firstName} {courier.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="estimatedDelivery"
              className="flex items-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Tahmini Teslimat Tarihi
            </Label>
            <Input
              id="estimatedDelivery"
              type="datetime-local"
              defaultValue={new Date(parcel.estimatedDelivery)
                .toISOString()
                .slice(0, 16)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  estimatedDelivery: new Date(e.target.value).toISOString(),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderId">Sipariş ID</Label>
            <Input
              id="orderId"
              defaultValue={parcel.orderId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, orderId: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleSave}>Kaydet</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
