"use client"

import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select"
import { CreditCard } from "lucide-react"
import { CardData } from "../../types"

interface PaymentFormFieldsProps {
  cardData: CardData;
  setCardData: (updater: (prev: CardData) => CardData) => void;
}

export const PaymentFormFields = ({ cardData, setCardData }: PaymentFormFieldsProps) => {
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

    setCardData(prev => ({ ...prev, number: formatted, cardType }))
  }

  const handleExpiryChange = (value: string) => {
    // Sadece rakamları al
    let cleanedValue = value.replace(/\D/g, "")
    
    // MM-YY formatında düzenle
    if (cleanedValue.length >= 2) {
      cleanedValue = cleanedValue.substring(0, 2) + "-" + cleanedValue.substring(2, 4)
    }
    
    setCardData(prev => ({ ...prev, expiry: cleanedValue }))
  }

  return (
    <div className="space-y-4">
      {/* Ödeme Tipi */}
      <div>
        <Label htmlFor="paymentType">Ödeme Tipi</Label>
        <Select 
          value={cardData.paymentType} 
          onValueChange={(value) => setCardData(prev => ({ ...prev, paymentType: value }))}
        >
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
          onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
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
            onChange={(e) => setCardData(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
            placeholder="123"
            maxLength={4}
          />
        </div>
      </div>
    </div>
  )
} 