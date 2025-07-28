import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { api } from "#lib/api.js";
import { useEffect, useState } from "react";
import { Address } from "./address-card";

interface City {
  id: number;
  name: string;
  stateName: string;
  stateCode: string;
  countryCode: string;
  countryName: string;
}

interface ApiResponse<T> {
  data: T[];
}

interface AddressFormData {
  title: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  isDefault: boolean;
  cityId: number | null;
}

interface AddressFormProps {
  onSubmit: (address: AddressFormData) => void;
  onCancel: () => void;
  initialData?: Address | null;
}

export function AddressForm({ onSubmit, onCancel, initialData }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    title: initialData?.title || "",
    recipientName: initialData?.recipientName || "",
    phone: initialData?.phone || "",
    addressLine1: initialData?.addressLine1 || "",
    addressLine2: initialData?.addressLine2 || "",
    postalCode: initialData?.postalCode || "",
    isDefault: initialData?.isDefault || false,
    cityId: initialData?.city?.id || null
  });

  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoadingCities(true);
        const result = await api["locations"]["cities"].get({
          query: {
            countryId: 228
          }
        });
        console.log(result.data);
        setCities(result.data?.data || []);
      } catch (error) {
        console.error('Şehirler yüklenirken hata oluştu:', error);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cityId === null) {
      alert('Lütfen bir şehir seçin');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Adres Başlığı */}
        <div className="space-y-2">
          <Label htmlFor="title">Adres Başlığı</Label>
          <Input
            id="title"
            placeholder="Örn: Ana Ofis, Ev Adresi"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.currentTarget.value }))}
            required
          />
        </div>

        {/* Alıcı Adı */}
        <div className="space-y-2">
          <Label htmlFor="recipientName">Alıcı Adı Soyadı</Label>
          <Input
            id="recipientName"
            placeholder="Adınız ve soyadınız"
            value={formData.recipientName}
            onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.currentTarget.value }))}
            required
          />
        </div>

        {/* Telefon */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon Numarası</Label>
          <Input
            id="phone"
            placeholder="05551234567"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.currentTarget.value }))}
            required
          />
        </div>

        {/* Adres Satırı 1 */}
        <div className="space-y-2">
          <Label htmlFor="addressLine1">Adres Satırı 1</Label>
          <Input
            id="addressLine1"
            placeholder="Mahalle, sokak, cadde adı ve numara"
            value={formData.addressLine1}
            onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.currentTarget.value }))}
            required
          />
        </div>

        {/* Adres Satırı 2 */}
        <div className="space-y-2">
          <Label htmlFor="addressLine2">Adres Satırı 2 (Opsiyonel)</Label>
          <Input
            id="addressLine2"
            placeholder="Apartman adı, daire no, kat"
            value={formData.addressLine2}
            onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.currentTarget.value }))}
          />
        </div>

        {/* Şehir Seçimi */}
        <div className="space-y-2">
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
        <div className="space-y-2">
          <Label htmlFor="postalCode">Posta Kodu</Label>
          <Input
            id="postalCode"
            placeholder="34000"
            value={formData.postalCode}
            onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.currentTarget.value }))}
            required
          />
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

        {/* Butonlar */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            İptal
          </Button>
          <Button 
            type="submit" 
            disabled={!formData.title || !formData.recipientName || !formData.phone || !formData.addressLine1 || !formData.postalCode || formData.cityId === null || isLoadingCities}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {initialData ? "Güncelle" : "Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
} 