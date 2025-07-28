import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

export interface Address {
  id:number;
  uuid:string;
  addressLine1: string;
  addressLine2: string;
  title:string;
  city:{
    id:number,
    name:string;
  }
  createdAt:string;
  isDefault:boolean;
  updatedAt:string;
  deletedAt:string;
  recipientName:string;
}

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressUuid: string) => void;
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  return (
    <Card className="relative group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        {/* Sol üst - Adres tipi */}
        {
          address.isDefault && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800">
                Varsayılan
              </span>
            </div>
          )
        }
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {address.title}
          </span>
        </div>
        
        {/* Orta - Adres açıklaması */}
        <div className="mb-4 min-h-[60px]">
          <h4 className="font-medium text-gray-900 mb-1">{address.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {address.addressLine1} &  {address.addressLine2}
          </p>
        </div>
         {/* Orta - Adres açıklaması */}
         <div className="mb-4 min-h-[60px]">
          <p className="text-sm text-gray-600 leading-relaxed">
            {address.city.name}
          </p>
          <p className="text-sm text-gray-700 font-bold leading-relaxed">
            {address.recipientName}
          </p>
        </div>
        
        {/* Alt - Butonlar */}
        <div className="flex justify-between items-center">
          {/* Sol alt - Silme butonu */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(address.uuid)}
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