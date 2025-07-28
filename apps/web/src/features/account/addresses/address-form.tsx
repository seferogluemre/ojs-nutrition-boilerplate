import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Textarea } from "#/components/ui/textarea";
import { useState } from "react";
import { ADDRESS_TYPES } from "../data";
import { Address } from "./address-card";

interface AddressFormProps {
  onSubmit: (address: Omit<Address, 'id'>) => void;
  onCancel: () => void;
  initialData?: Address | null;
}



export function AddressForm({ onSubmit, onCancel, initialData }: AddressFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    fullAddress: initialData?.fullAddress || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Adres Tipi */}
        <div className="space-y-2">
          <Label htmlFor="type">Adres Tipi</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Adres tipini seçin" />
            </SelectTrigger>
            <SelectContent>
              {ADDRESS_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

        {/* Adres Açıklaması */}
        <div className="space-y-2">
          <Label htmlFor="description">Adres Açıklaması (Opsiyonel)</Label>
          <Input
            id="description"
            placeholder="Kısa açıklama"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.currentTarget.value }))}
          />
        </div>

        {/* Tam Adres */}
        <div className="space-y-2">
          <Label htmlFor="fullAddress">Tam Adres</Label>
          <Textarea
            id="fullAddress"
            placeholder="Mahalle, sokak, cadde, apartman adı, daire no, ilçe, il..."
            value={formData.fullAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, fullAddress: e.currentTarget.value }))}
            rows={4}
            required
          />
        </div>

        {/* Butonlar */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            İptal
          </Button>
          <Button 
            type="submit" 
            disabled={!formData.type || !formData.title || !formData.fullAddress}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {initialData ? "Güncelle" : "Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
} 