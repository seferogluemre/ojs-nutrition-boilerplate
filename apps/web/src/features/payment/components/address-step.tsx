"use client"

import { Button } from "#components/ui/button.js"
import { Label } from "#components/ui/label.js"
import { RadioGroup, RadioGroupItem } from "#components/ui/radio-group.js"
import { Plus } from "lucide-react"
import { useState } from "react"
import { addresses } from "../data"
import { AddressForm } from "./address-form"

interface AddressStepProps {
  onNext: () => void
  selectedAddress: any
  setSelectedAddress: (address: any) => void
}

export const AddressStep = ({ onNext, selectedAddress, setSelectedAddress }: AddressStepProps) => {
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)


  const handleEditAddress = (address: any) => {
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

  if (showForm) {
    return (
      <AddressForm
        address={editingAddress}
        onClose={handleFormClose}
        onSave={(address) => {
          setSelectedAddress(address)
          handleFormClose()
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Teslimat Adresi</h3>

        <RadioGroup
          value={selectedAddress?.id?.toString()}
          onValueChange={(value) => {
            const address = addresses.find((addr) => addr.id.toString() === value)
            setSelectedAddress(address)
          }}
          className="space-y-4"
        >
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`flex items-start space-x-3 p-4 rounded-lg ${
                selectedAddress?.id === address.id
                  ? "bg-blue-50 border-2 border-blue-500"
                  : "bg-white border border-gray-200"
              }`}
            >
              <RadioGroupItem value={address.id.toString()} id={address.id.toString()} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={address.id.toString()} className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{address.type}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Düzenle
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{address.fullAddress}</p>
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
      </div>
    </div>
  )
}
