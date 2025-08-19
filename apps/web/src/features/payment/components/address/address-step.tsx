"use client"

import { Address } from "#/features/account/addresses/address-card"
import { Button } from "#components/ui/button.js"
import { Label } from "#components/ui/label.js"
import { RadioGroup, RadioGroupItem } from "#components/ui/radio-group.js"
import { api } from "#lib/api.js"
import { useAuthStore } from "#stores/authStore.js"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { AddressForm } from "./address-form"

interface AddressStepProps {
  onNext: () => void
  selectedAddress: Address | null
  setSelectedAddress: (address: Address | null) => void
}

export const AddressStep = ({ onNext, selectedAddress, setSelectedAddress }: AddressStepProps) => {
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const auth = useAuthStore()

  // Kullanıcı adreslerini API'den çek
  const { data: addressesData, isLoading, error } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: () => api["user-addresses"].get({
      headers: {
        authorization: `Bearer ${auth.accessToken}`,
      },
    }),
    enabled: !!auth.accessToken, // Token varsa sorguyu çalıştır
  })

  const addresses = addressesData?.data || []
  console.log('API Response:', addressesData)
  console.log('Addresses:', addresses)

  // İlk adresin otomatik seçilmesi
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0])
    }
  }, [addresses, selectedAddress, setSelectedAddress])

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleAddNewAddress = () => {
    setEditingAddress(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingAddress(null)
  }

  const handleContinue = () => {
    if (selectedAddress) {
      onNext()
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Teslimat Adresi</h3>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Adresler yükleniyor...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Teslimat Adresi</h3>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Adresler yüklenirken hata oluştu</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Tekrar Dene
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <AddressForm
        address={editingAddress}
        onClose={handleFormClose}
        onSave={(address) => {
          setSelectedAddress(address)
          handleFormClose()
          // Query'yi invalidate et ki yeni adres listesinde görünsün
          // useEffect ile ilk adres otomatik seçilecek
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Teslimat Adresi</h3>

        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Henüz kayıtlı adresiniz yok</p>
            <Button onClick={handleAddNewAddress} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              İlk Adresinizi Ekleyin
            </Button>
          </div>
        ) : (
          <>
            <RadioGroup
              value={selectedAddress?.uuid || ""}
              onValueChange={(value) => {
                const address = addresses.find((addr: Address) => addr.uuid === value)
                setSelectedAddress(address || null)
              }}
              className="space-y-4"
            >
              {addresses.map((address: Address) => (
                <div
                  key={address.uuid}
                  className={`flex items-start space-x-3 p-4 rounded-lg ${
                    selectedAddress?.uuid === address.uuid
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <RadioGroupItem value={address.uuid} id={address.uuid} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={address.uuid} className="cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{address.title}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            handleEditAddress(address)
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Düzenle
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.recipientName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.city.stateName} - {address.city.name}, {address.postalCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.phone}
                      </p>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <Button variant="outline" onClick={handleAddNewAddress} className="w-full mt-4 border-dashed bg-white">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Adres
            </Button>

            <Button onClick={handleContinue} disabled={!selectedAddress} className="w-full mt-6 bg-black hover:bg-gray-800">
              Kargo ile Devam Et
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
