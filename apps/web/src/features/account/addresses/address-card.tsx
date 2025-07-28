import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

export interface Address {
  id: string;
  type: string;
  title: string;
  description: string;
  fullAddress: string;
}

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <Card className="relative group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Sol üst - Adres tipi */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {address.type}
          </span>
        </div>
        
        {/* Orta - Adres açıklaması */}
        <div className="mb-4 min-h-[60px]">
          <h4 className="font-medium text-gray-900 mb-1">{address.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {address.fullAddress}
          </p>
        </div>
        
        {/* Alt - Butonlar */}
        <div className="flex justify-between items-center">
          {/* Sol alt - Silme butonu */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(address.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          {/* Sağ alt - Düzenleme butonu */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(address)}
            className="text-gray-600 hover:text-gray-700"
          >
            <Edit className="h-4 w-4 mr-1" />
            Düzenle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 