"use client"

import { Button } from "#components/ui/button.js";
import { ArrowLeft } from "lucide-react";

interface AddressFormHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

export const AddressFormHeader = ({ isEditing, onClose }: AddressFormHeaderProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="p-2"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
        1
      </div>
      <h2 className="text-xl font-semibold">
        {isEditing ? "Adresi Düzenle" : "Yeni Adres Ekle"}
      </h2>
    </div>
  )
} 