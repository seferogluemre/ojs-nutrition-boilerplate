"use client";

import { Badge } from "#components/ui/badge.js";
import { Button } from "#components/ui/button.js";
import { Popover, PopoverContent, PopoverTrigger } from "#components/ui/popover.js";
import { Info, MessageCircle, Truck } from "lucide-react";
import { useState } from "react";
import ParcelTracking from "./parcel-tracking";

interface TrackingStep {
  time: string;
  location: string;
  status: string;
  completed: boolean;
}

const trackingSteps: TrackingStep[] = [
  {
    time: "12:00",
    location: "İstanbul",
    status: "Kargo yola çıktı",
    completed: true,
  },
  {
    time: "16:00",
    location: "Zonguldak",
    status: "Şehir merkezine ulaştı",
    completed: true,
  },
  {
    time: "18:30",
    location: "Zonguldak",
    status: "Dağıtıma çıktı",
    completed: true,
  },
  {
    time: "Tahmini 20:00",
    location: "Teslimat Adresi",
    status: "Teslim edilecek",
    completed: false,
  },
];

export default function CargoTrackingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<
    "menu" | "tracking" | "realtime" | "address" | "support"
  >("menu");

  const renderChatMenu = () => (
    <div className="space-y-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <MessageCircle className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold">OnlyJS Nutrition Asistan</h3>
        <p className="mt-2 text-gray-600">Size nasıl yardımcı olabilirim?</p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="h-auto w-full justify-start bg-transparent p-5 text-left hover:bg-gray-50"
          onClick={() => setActiveView("tracking")}
        >
          <div>
            <div className="text-base font-medium">Siparişim nerede?</div>
            <div className="mt-1 text-sm text-gray-500">
              Kargo takip durumunu görüntüle
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto w-full justify-start bg-transparent p-5 text-left hover:bg-gray-50"
          onClick={() => setActiveView("realtime")}
        >
          <div>
            <div className="text-base font-medium">Detaylı Kargo Takibi</div>
            <div className="mt-1 text-sm text-gray-500">
              Kargo geçmişi ve detaylı bilgiler
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto w-full justify-start bg-transparent p-5 text-left hover:bg-gray-50"
          onClick={() => setActiveView("address")}
        >
          <div>
            <div className="text-base font-medium">
              Teslimat adresimi değiştirebilir miyim?
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Adres değişikliği hakkında bilgi al
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="h-auto w-full justify-start bg-transparent p-5 text-left hover:bg-gray-50"
          onClick={() => setActiveView("support")}
        >
          <div>
            <div className="text-base font-medium">
              Müşteri hizmetleriyle görüş
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Canlı destek ile iletişime geç
            </div>
          </div>
        </Button>
      </div>
    </div>
  );

  const renderTrackingTimeline = () => (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Kargo Takip Durumu</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveView("realtime")}
            className="text-xs"
          >
            Detaylı Görünüm
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Info className="h-4 w-4 text-blue-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" side="left">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  Teslimat Bilgilendirmesi
                </h4>
                <p className="text-sm text-gray-600">
                  Kuryemiz kargonuzu verdiğiniz şehirde dağıtıma çıktığında,
                  mail üzerinden bir QR kod bildirimi alacaksınız. Bu QR kodu
                  kuryemize göstererek siparişinizi güvenle teslim
                  alabilirsiniz.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="relative">
        {trackingSteps.map((step, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 pb-6 last:pb-0"
          >
            {/* Timeline dot */}
            <div className="relative flex-shrink-0">
              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  step.completed
                    ? "border-green-500 bg-green-500"
                    : "border-gray-300 bg-white"
                }`}
              />
              {index < trackingSteps.length - 1 && (
                <div
                  className={`absolute left-2 top-4 h-12 w-0.5 ${step.completed ? "bg-green-500" : "bg-gray-300"}`}
                />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center space-x-2">
                <Badge
                  variant={step.completed ? "default" : "secondary"}
                  className="text-xs"
                >
                  {step.time}
                </Badge>
                <span className="text-sm font-medium text-gray-900">
                  {step.location}
                </span>
              </div>
              <p
                className={`text-sm ${step.completed ? "text-gray-600" : "text-gray-500"}`}
              >
                {step.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddressInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Teslimat Adresi Değişikliği</h3>
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          <strong>Önemli:</strong> Kargo dağıtıma çıktıktan sonra adres
          değişikliği yapılamaz. Siparişiniz şu anda dağıtım aşamasında olduğu
          için adres değişikliği mümkün değildir.
        </p>
      </div>
      <p className="text-sm text-gray-600">
        Gelecek siparişleriniz için adres bilgilerinizi hesap ayarlarınızdan
        güncelleyebilirsiniz.
      </p>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Müşteri Hizmetleri</h3>
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="mb-3 text-sm text-blue-800">
          Canlı destek hattımız size yardımcı olmaya hazır!
        </p>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Çalışma Saatleri:</strong> 09:00 - 18:00 (Hafta içi)
          </div>
          <div>
            <strong>Telefon:</strong> 0850 123 45 67
          </div>
          <div>
            <strong>E-posta:</strong> destek@onlyjs.com
          </div>
        </div>
      </div>
      <Button className="w-full">
        <MessageCircle className="mr-2 h-4 w-4" />
        Canlı Destek Başlat
      </Button>
    </div>
  );

  return (
    <>
      {/* Floating Cargo Tracking Button with Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
            size="icon"
          >
            <Truck className="h-6 w-6" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="mb-4 mr-4 h-[650px] w-[520px] p-0"
          side="top"
          align="end"
          sideOffset={10}
        >
          <div className="relative flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-lg border-b bg-gray-50 p-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Truck className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-semibold">Kargo Takip</span>
              </div>
              {activeView !== "menu" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveView("menu")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Geri
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeView === "menu" && renderChatMenu()}
              {activeView === "tracking" && renderTrackingTimeline()}
              {activeView === "realtime" && <ParcelTracking />}
              {activeView === "address" && renderAddressInfo()}
              {activeView === "support" && renderSupport()}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
