"use client"

import { toast } from "#/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "#components/ui/card.js"
import { api } from "#lib/api.js"
import { useAuthStore } from "#stores/authStore.js"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import {
  AddressFormData,
  AddressFormProps,
  City
} from "../../types"
import { AddressFormActions } from "./address-form-actions"
import { AddressFormFields } from "./address-form-fields"
import { AddressFormHeader } from "./address-form-header"

export const AddressForm = ({ address, onClose, onSave }: AddressFormProps) => {
  const [formData, setFormData] = useState<AddressFormData>({
    title: address?.title || "",
    recipientName: address?.recipientName || "",
    phone: address?.phone || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    postalCode: address?.postalCode || "",
    isDefault: address?.isDefault || false,
    cityId: address?.city?.id || null
  });

  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  
  const { auth } = useAuthStore()
  const queryClient = useQueryClient()

  // Şehir listesini çek
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoadingCities(true);
        const result = await api["locations"]["cities"].get({
          query: {
            countryId: 228
          }
        });
        setCities(result.data?.data || []);
      } catch (error) {
        console.error('Şehirler yüklenirken hata oluştu:', error);
        toast({
          title: "❌ Hata",
          description: "Şehirler yüklenirken hata oluştu",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: async (addressData: AddressFormData) => {
      return api["user-addresses"].post(
        {
          title: addressData.title,
          recipientName: addressData.recipientName,
          phone: addressData.phone,
          addressLine1: addressData.addressLine1,
          addressLine2: addressData.addressLine2,
          postalCode: addressData.postalCode,
          isDefault: addressData.isDefault,
          cityId: addressData.cityId,
        },
        {
          headers: {
            authorization: `Bearer ${auth.accessToken}`,
          },
        },
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      toast({
        title: "✅ Adres eklendi",
        description: "Adresiniz başarıyla eklendi.",
      });
      onSave(response.data);
    },
    onError: (error) => {
      toast({
        title: "❌ Hata",
        description: "Adres eklenirken bir hata oluştu.",
        variant: "destructive",
      });
      console.error("Address creation error:", error);
    },
  });

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn: async (addressData: AddressFormData) => {
      return api["user-addresses"]({
        id: address!.uuid,
      }).patch(
        {
          title: addressData.title,
          recipientName: addressData.recipientName,
          phone: addressData.phone,
          addressLine1: addressData.addressLine1,
          addressLine2: addressData.addressLine2,
          postalCode: addressData.postalCode,
          isDefault: addressData.isDefault,
          cityId: addressData.cityId,
        },
        {
          headers: {
            authorization: `Bearer ${auth.accessToken}`,
          },
        },
      );
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      toast({
        title: "✅ Adres güncellendi",
        description: "Adresiniz başarıyla güncellendi.",
      });
      onSave(response.data);
    },
    onError: (error) => {
      toast({
        title: "❌ Hata",
        description: "Adres güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
      console.error("Address update error:", error);
    },
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async () => {
      return api["user-addresses"]({
        id: address!.uuid,
      }).delete({
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      toast({
        title: "✅ Adres silindi",
        description: "Adresiniz başarıyla silindi.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "❌ Hata",
        description: "Adres silinirken bir hata oluştu.",
        variant: "destructive",
      });
      console.error("Address deletion error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cityId === null) {
      toast({
        title: "❌ Hata",
        description: "Lütfen bir şehir seçin",
        variant: "destructive",
      });
      return;
    }

    if (address) {
      updateAddressMutation.mutate(formData);
    } else {
      createAddressMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (address && window.confirm("Bu adresi silmek istediğinizden emin misiniz?")) {
      deleteAddressMutation.mutate();
    }
  };

  const isLoading = createAddressMutation.isPending || updateAddressMutation.isPending;

  return (
    <div className="space-y-6">
      <AddressFormHeader 
        isEditing={!!address} 
        onClose={onClose} 
      />

      <Card>
        <CardHeader>
          <CardTitle>
            {address ? "Adres Bilgilerini Güncelle" : "Yeni Adres Ekle"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AddressFormFields
              formData={formData}
              setFormData={setFormData}
              cities={cities}
              isLoadingCities={isLoadingCities}
            />

            <AddressFormActions
              isEditing={!!address}
              isLoading={isLoading}
              formData={formData}
              onDelete={address ? handleDelete : undefined}
              deleteLoading={deleteAddressMutation.isPending}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 