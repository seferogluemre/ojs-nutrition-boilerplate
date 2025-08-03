"use client"

import { Button } from "#components/ui/button.js";
import { TrashIcon } from "lucide-react";
import { AddressFormData } from "../../types";

interface AddressFormActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  formData: AddressFormData;
  onDelete?: () => void;
  deleteLoading?: boolean;
  onCancel: () => void;
}

export const AddressFormActions = ({ 
  isEditing, 
  isLoading, 
  formData, 
  onDelete,
  deleteLoading,
  onCancel 
}: AddressFormActionsProps) => {
  const isFormValid = formData.title && 
                     formData.recipientName && 
                     formData.phone && 
                     formData.addressLine1 && 
                     formData.postalCode && 
                     formData.cityId !== null;

  return (
    <div className="space-y-3 pt-4">
      {/* Ana butonlar - Kaydet ve İptal */}
      <div className="flex space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading || deleteLoading}
        >
          İptal
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-black hover:bg-gray-800"
          disabled={!isFormValid || isLoading}
        >
          {isLoading 
            ? (isEditing ? "Güncelleniyor..." : "Kaydediliyor...") 
            : (isEditing ? "Güncelle" : "Kaydet")
          }
        </Button>
      </div>

      {/* Silme butonu (sadece düzenleme modunda) */}
      {isEditing && onDelete && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onDelete} 
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
          disabled={isLoading || deleteLoading}
        >
          {deleteLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
              Siliniyor...
            </>
          ) : (
            <>
            <TrashIcon className="w-4 h-4 mr-2" />
              Adresi Sil
            </>
          )}
        </Button>
      )}
    </div>
  )
} 