"use client"

import { Button } from "#components/ui/button.js";
import { AddressFormData } from "../../types";

interface AddressFormActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  formData: AddressFormData;
  onDelete?: () => void;
  deleteLoading?: boolean;
}

export const AddressFormActions = ({ 
  isEditing, 
  isLoading, 
  formData, 
  onDelete,
  deleteLoading 
}: AddressFormActionsProps) => {
  const isFormValid = formData.title && 
                     formData.recipientName && 
                     formData.phone && 
                     formData.addressLine1 && 
                     formData.postalCode && 
                     formData.cityId !== null;

  return (
    <div className="flex space-x-3 pt-4">
      {isEditing && onDelete && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onDelete} 
          className="flex-1"
          disabled={isLoading || deleteLoading}
        >
          {deleteLoading ? "Siliniyor..." : "Adresi Sil"}
        </Button>
      )}
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
  )
} 