"use client"

import { useAuthStore } from "#stores/authStore"
import { useState } from "react"
import { AddressStep } from "./components/address-step"
import { OrderSummary } from "./components/order-summary"
import { PaymentStep } from "./components/payment-step"
import { ShippingStep } from "./components/shipping-step"
import { StepIndicator } from "./components/step-indicator"

const PaymentPage = () => {
  const { auth } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [shippingCost, setShippingCost] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressStep
            onNext={handleNextStep}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        )
      case 2:
        return (
          <ShippingStep
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            selectedAddress={selectedAddress}
            shippingCost={shippingCost}
            setShippingCost={setShippingCost}
          />
        )
      case 3:
        return (
          <PaymentStep
            onPrev={handlePrevStep}
            selectedAddress={selectedAddress}
            shippingCost={shippingCost}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">DJS</h1>
              <span className="text-2xl font-light text-black ml-1">NUTRITION</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {auth.user?.firstName} {auth.user?.lastName}
              </div>
              <div className="text-sm text-gray-500">{auth.user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1">
            <StepIndicator currentStep={currentStep} />
          </div>

          <div className="lg:col-span-3">{renderCurrentStep()}</div>

          <div className="lg:col-span-1">
            <OrderSummary shippingCost={shippingCost} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage