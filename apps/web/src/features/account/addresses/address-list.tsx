import { ConfirmDialog } from "#/components/confirm-dialog";
import { Button } from "#/components/ui/button";
import { toast } from "#/hooks/use-toast";
import { api } from "#lib/api.js";
import { useAuthStore } from "#stores/authStore.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { Address, AddressCard } from "./address-card";
import { AddressForm } from "./address-form";

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

export function AddressList() {
    const auth = useAuthStore();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
      queryKey: ['user-addresses'],
      queryFn: () => api["user-addresses"].get({
        headers: {
          authorization: `Bearer ${auth.auth.accessToken}`,
        },
      })
    });

    // Create address mutation
    const createAddressMutation = useMutation({
      mutationFn: async (addressData: AddressFormData) => {
        return api["user-addresses"].post({
          title: addressData.title,
          recipientName: addressData.recipientName,
          phone: addressData.phone,
          addressLine1: addressData.addressLine1,
          addressLine2: addressData.addressLine2,
          postalCode: addressData.postalCode,
          isDefault: addressData.isDefault,
          cityId: addressData.cityId,
        }, {
          headers: {
            authorization: `Bearer ${auth.auth.accessToken}`,
          },
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
        toast({
          title: "✅ Adres eklendi",
          description: "Adresiniz başarıyla eklendi.",
        });
        setShowForm(false);
      },
      onError: (error) => {
        toast({
          title: "❌ Hata",
          description: "Adres eklenirken bir hata oluştu.",
          variant: "destructive",
        });
        console.error('Address creation error:', error);
      },
    });

  const addresses = data?.data || [];
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const handleAddAddress = (newAddress: AddressFormData) => {
    createAddressMutation.mutate(newAddress);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleUpdateAddress = (updatedAddress: AddressFormData) => {
    // TODO: Implement update address API call
    console.log('Update address:', updatedAddress);
    toast({
      title: "ℹ️ Bilgi",
      description: "Adres güncelleme özelliği henüz hazır değil.",
    });
  };

  const handleDeleteAddress = (addressUuid: string) => {
    const address = addresses.find((addr: Address) => addr.uuid === addressUuid);
    if (address) {
      setAddressToDelete(address);
      setShowDeleteDialog(true);
    }
  };

  const confirmDeleteAddress = () => {
    if (addressToDelete) {
      // TODO: Implement delete address API call
      console.log('Delete address:', addressToDelete.uuid);
      setShowDeleteDialog(false);
      
      toast({
        title: "ℹ️ Bilgi",
        description: "Adres silme özelliği henüz hazır değil.",
      });
      
      setAddressToDelete(null);
    }
  };

  // Dialog iptal edildiğinde
  const cancelDeleteAddress = () => {
    setShowDeleteDialog(false);
    setAddressToDelete(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Adresler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div>
        {/* Form Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelForm}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-xl font-semibold text-gray-900">
            {editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
          </h3>
        </div>

        {/* Form */}
        <AddressForm
          onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
          onCancel={handleCancelForm}
          initialData={editingAddress}
        />
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Adreslerim</h3>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={createAddressMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Adres Ekle
          </Button>
        </div>
        
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz adresiniz yok</h4>
          <p className="text-gray-600 mb-6">
            Hızlı teslimat için teslimat adreslerinizi ekleyin
          </p>
          
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={createAddressMutation.isPending}
          >
            İlk Adresi Ekle
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Adreslerim</h3>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={createAddressMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          {createAddressMutation.isPending ? "Ekleniyor..." : "Yeni Adres Ekle"}
        </Button>
      </div>

      {/* Address Grid - 2 sütunlu yapıp kartları genişlettik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address: Address) => (
          <AddressCard
            key={address.id}
            address={address}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
          />
        ))}
      </div>

      {/* Silme Onay Dialogu */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Adresi Sil"
        desc={
          <div>
            <p className="mb-2">
              <strong>"{addressToDelete?.title}"</strong> adresini silmek istediğinizden emin misiniz?
            </p>
            <p className="text-sm text-gray-600">
              Bu işlem geri alınamaz ve adres kalıcı olarak silinecektir.
            </p>
          </div>
        }
        cancelBtnText="İptal"
        confirmText="Evet, Sil"
        destructive={true}
        handleConfirm={confirmDeleteAddress}
      />
    </div>
  );
} 