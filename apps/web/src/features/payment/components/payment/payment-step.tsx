"use client"

import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select"
import { Address } from "#/features/account/addresses/address-card"
import { toast } from "#/hooks/use-toast"
import { api } from "#/lib/api"
import { useAuthStore } from "#/stores/authStore"
import { useRouter } from "@tanstack/react-router"
import { CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import { SuccessScreen } from "./success-screen"

interface PaymentStepProps {
  onPrev: () => void
  selectedAddress: Address | null
  shippingCost: number
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export const PaymentStep = ({
  onPrev,
  selectedAddress,
  shippingCost,
  isProcessing,
  setIsProcessing,
}: PaymentStepProps) => {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    cardType: "",
    paymentType: "credit_card",
  })

  const [orderSuccess, setOrderSuccess] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")

  const auth = useAuthStore()
  const router = useRouter()

  // Success ekranı animasyonu için
  useEffect(() => {
    if (orderSuccess) {
      const timer = setTimeout(() => {
        setShowContent(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [orderSuccess])

  const handleCardNumberChange = (value: string) => {
    // Sadece rakamları al ve 16 karakterle sınırla
    const cleanedValue = value.replace(/\D/g, "").slice(0, 16)
    
    // Formatla (4'erli gruplar halinde)
    const formatted = cleanedValue
      .replace(/(.{4})/g, "$1 ")
      .trim()
    
    let cardType = ""
    if (cleanedValue.startsWith("4")) {
      cardType = "visa"
    } else if (cleanedValue.startsWith("5") || cleanedValue.startsWith("2")) {
      cardType = "mastercard"
    } else if (cleanedValue.startsWith("3")) {
      cardType = "amex"
    }

    setCardData({ ...cardData, number: formatted, cardType })
  }

  const handleExpiryChange = (value: string) => {
    // Sadece rakamları al
    let cleanedValue = value.replace(/\D/g, "")
    
    // MM-YY formatında düzenle
    if (cleanedValue.length >= 2) {
      cleanedValue = cleanedValue.substring(0, 2) + "-" + cleanedValue.substring(2, 4)
    }
    
    setCardData({ ...cardData, expiry: cleanedValue })
  }

  const validateForm = () => {
    if (!selectedAddress) {
      toast({
        title: "❌ Hata",
        description: "Lütfen bir teslimat adresi seçin",
        variant: "destructive",
      })
      return false
    }

    if (!cardData.paymentType) {
      toast({
        title: "❌ Hata", 
        description: "Lütfen ödeme tipini seçin",
        variant: "destructive",
      })
      return false
    }

    const cardDigits = cardData.number.replace(/\s/g, "")
    if (cardDigits.length !== 16) {
      toast({
        title: "❌ Hata",
        description: "Kart numarası 16 haneli olmalıdır",
        variant: "destructive",
      })
      return false
    }

    if (!cardData.expiry.match(/^(0[1-9]|1[0-2])-[0-9]{2}$/)) {
      toast({
        title: "❌ Hata",
        description: "Son kullanma tarihi MM-YY formatında olmalıdır",
        variant: "destructive",
      })
      return false
    }

    if (cardData.cvc.length < 3 || cardData.cvc.length > 4) {
      toast({
        title: "❌ Hata",
        description: "CVC 3 veya 4 haneli olmalıdır",
        variant: "destructive",
      })
      return false
    }

    if (!cardData.cardType) {
      toast({
        title: "❌ Hata",
        description: "Kart tipi belirlenemiyor",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const generateOrderNumber = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  const handleCompleteOrder = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      const orderData = {
        address_id: selectedAddress!.uuid,
        payment_type: cardData.paymentType,
        card_digits: cardData.number.replace(/\s/g, ""),
        card_expiration_date: cardData.expiry,
        card_security_code: cardData.cvc,
        card_type: cardData.cardType,
      }

      const response = await api["orders"]["complete-shopping"].post(orderData, {
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      })

      setOrderNumber(generateOrderNumber())
      setOrderSuccess(true)

    } catch (error: any) {
      console.error("Order completion error:", error)
      toast({
        title: "❌ Hata",
        description: error?.data?.message || "Sipariş oluşturulurken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinueToOrders = () => {
    router.navigate({ to: "/account" })
  }

  if (orderSuccess) {
    return <SuccessScreen showContent={showContent} orderNumber={orderNumber} onContinueToOrders={handleContinueToOrders} />
  }

  // Processing Ekranı
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Ödeme Gerçekleştiriliyor...</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Lütfen bekleyiniz, siparişiniz oluşturuluyor...</p>
      </div>
    )
  }

  // Ana Ödeme Formu
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Kart Bilgileri</h3>

        <div className="space-y-4">
          {/* Ödeme Tipi */}
          <div>
            <Label htmlFor="paymentType">Ödeme Tipi</Label>
            <Select value={cardData.paymentType} onValueChange={(value) => setCardData({ ...cardData, paymentType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Ödeme tipini seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Kredi Kartı</SelectItem>
                <SelectItem value="debit_card">Banka Kartı</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Kart Numarası */}
          <div>
            <Label htmlFor="cardNumber">Kart Numarası</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                value={cardData.number}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {cardData.cardType === "visa" && <div className="text-blue-600 font-bold text-sm">VISA</div>}
                {cardData.cardType === "mastercard" && <div className="text-red-600 font-bold text-sm">MC</div>}
                {cardData.cardType === "amex" && <div className="text-green-600 font-bold text-sm">AMEX</div>}
                {!cardData.cardType && <CreditCard className="w-5 h-5 text-gray-400" />}
              </div>
            </div>
          </div>

          {/* Kart Üzerindeki İsim */}
          <div>
            <Label htmlFor="cardName">Kart Üzerindeki İsim</Label>
            <Input
              id="cardName"
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              placeholder="İSİM SOYİSİM"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Son Kullanma Tarihi */}
            <div>
              <Label htmlFor="expiry">Son Kullanma Tarihi</Label>
              <Input
                id="expiry"
                value={cardData.expiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                placeholder="MM-YY"
                maxLength={5}
              />
            </div>
            {/* CVC */}
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                value={cardData.cvc}
                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
        </div>

        {/* Sipariş Özeti */}
        <div className="mt-6 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
          <h4 className="font-medium mb-2">Sipariş Özeti</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Teslimat Adresi:</span>
              <span className="text-gray-900 dark:text-gray-100">{selectedAddress?.title || "Adres seçilmedi"}</span>
            </div>
            {selectedAddress && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {selectedAddress.recipientName} - {selectedAddress.addressLine1}
                {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
              </div>
            )}
            <div className="flex justify-between mt-2">
              <span>Kargo:</span>
              <span className="text-gray-900 dark:text-gray-100">{shippingCost === 0 ? "Ücretsiz" : `${shippingCost} TL`}</span>
            </div>
            <div className="flex justify-between mt-1 font-medium text-black dark:text-gray-100">
              <span>Toplam:</span>
              <span>{(1556 + shippingCost).toLocaleString()} TL</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button variant="outline" onClick={onPrev} className="flex-1 bg-white dark:bg-neutral-900 dark:text-gray-100 dark:border-neutral-800" disabled={isProcessing}>
            Geri
          </Button>
          <Button onClick={handleCompleteOrder} className="flex-1 bg-black hover:bg-gray-800" disabled={isProcessing}>
            Siparişi Tamamla
          </Button>
        </div>
      </div>
    </div>
  )
}
