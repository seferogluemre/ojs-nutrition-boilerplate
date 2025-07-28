"use client"

import { Checkbox } from "#components/ui/checkbox.js"
import { Input } from "#components/ui/input.js"
import { Label } from "#components/ui/label.js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#components/ui/select.js"
import { AddressFormData, City } from "../../types"

interface AddressFormFieldsProps {
  formData: AddressFormData;
  setFormData: (updater: (prev: AddressFormData) => AddressFormData) => void;
  cities: City[];
  isLoadingCities: boolean;
}

export const AddressFormFields = ({ 
  formData, 
  setFormData, 
  cities, 
  isLoadingCities 
}: AddressFormFieldsProps) => {
  return (
    <div className="space-y-4">
      {/* Adres Başlığı */}
      <div>
        <Label htmlFor="title">Adres Başlığı</Label>
        <Input
          id="title"
          placeholder="Örn: Ana Ofis, Ev Adresi"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      {/* Alıcı Adı */}
      <div>
        <Label htmlFor="recipientName">Alıcı Adı Soyadı</Label>
        <Input
          id="recipientName"
          placeholder="Adınız ve soyadınız"
          value={formData.recipientName}
          onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
          required
        />
      </div>

      {/* Telefon */}
      <div>
        <Label htmlFor="phone">Telefon Numarası</Label>
        <div className="flex">
          <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
            <span className="text-sm">🇹🇷</span>
          </div>
          <Input
            id="phone"
            placeholder="05551234567"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="rounded-l-none"
            required
          />
        </div>
      </div>

      {/* Adres Satırı 1 */}
      <div>
        <Label htmlFor="addressLine1">Adres Satırı 1</Label>
        <Input
          id="addressLine1"
          placeholder="Mahalle, sokak, cadde adı ve numara"
          value={formData.addressLine1}
          onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
          required
        />
      </div>

      {/* Adres Satırı 2 */}
      <div>
        <Label htmlFor="addressLine2">Adres Satırı 2 (Opsiyonel)</Label>
        <Input
          id="addressLine2"
          placeholder="Apartman adı, daire no, kat"
          value={formData.addressLine2}
          onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Şehir Seçimi */}
        <div>
          <Label htmlFor="city">Şehir</Label>
          <Select 
            value={formData.cityId?.toString() || ""} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, cityId: parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoadingCities ? "Şehirler yükleniyor..." : "Şehir seçin"} />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.name} / {city.stateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posta Kodu */}
        <div>
          <Label htmlFor="postalCode">Posta Kodu</Label>
          <Input
            id="postalCode"
            placeholder="34000"
            value={formData.postalCode}
            onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
            required
          />
        </div>
      </div>

      {/* Varsayılan Adres */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: !!checked }))}
        />
        <Label htmlFor="isDefault">Varsayılan adres olarak ayarla</Label>
      </div>
    </div>
  )
} 