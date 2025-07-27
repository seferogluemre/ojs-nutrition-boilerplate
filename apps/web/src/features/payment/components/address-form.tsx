"use client"

import { Button } from "#components/ui/button.js"
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card.js"
import { Input } from "#components/ui/input.js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#components/ui/select.js"
import { Textarea } from "#components/ui/textarea.js"
import { Label } from "@radix-ui/react-dropdown-menu"
import { useState } from "react"

interface AddressFormProps {
  address?: any
  onClose: () => void
  onSave: (address: any) => void
}

export const AddressForm = ({ address, onClose, onSave }: AddressFormProps) => {
  const [formData, setFormData] = useState({
    type: address?.type || "",
    name: address?.name || "",
    address: address?.fullAddress || "",
    city: address?.city || "İstanbul",
    district: address?.district || "Ataşehir",
    phone: "+90 537 265 80 23",
  })

  const handleSave = () => {
    onSave({
      id: address?.id || Date.now(),
      ...formData,
      fullAddress: `${formData.address}, ${formData.district}, ${formData.city}, Türkiye`,
    })
  }

  const handleDelete = () => {
    // Handle address deletion
    onClose()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
          1
        </div>
        <h2 className="text-xl font-semibold">Adres</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adres Düzenle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="addressType">Adres Başlığı</Label>
            <Input
              id="addressType"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="Ev"
            />
          </div>

          <div>
            <Label htmlFor="address">Adres</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Ahmet Mh. Mehmetoğlu Sk. No: 1 Daire: 2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">İl</Label>
              <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="İstanbul">İstanbul</SelectItem>
                  <SelectItem value="Ankara">Ankara</SelectItem>
                  <SelectItem value="İzmir">İzmir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="district">İlçe</Label>
              <Select
                value={formData.district}
                onValueChange={(value) => setFormData({ ...formData, district: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ataşehir">Ataşehir</SelectItem>
                  <SelectItem value="Kadıköy">Kadıköy</SelectItem>
                  <SelectItem value="Beşiktaş">Beşiktaş</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Telefon</Label>
            <div className="flex">
              <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                <span className="text-sm">🇹🇷</span>
              </div>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={handleDelete} className="flex-1 bg-transparent">
              Adresi Sil
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-black hover:bg-gray-800">
              Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
