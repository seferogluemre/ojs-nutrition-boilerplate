import { Main } from "#components/layout/main";
import { Button } from "#components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#components/ui/tabs";
import { useRouter } from "@tanstack/react-router";
import { ClipboardList, Minus, Package, Plus, Truck } from "lucide-react";
import { useState } from "react";
import { SSS } from "./data/data";

export default function SSSPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const toggleItem = (category: string, index: number) => {
    const key = `${category}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Main>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            En çok merak edilen sorular ve cevaplarını burada bulabilirsiniz. 
            Aradığınız soruyu bulamazsanız bizimle iletişime geçebilirsiniz.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="genel" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 rounded-lg p-1 border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900">
            <TabsTrigger value="genel" className="flex items-center gap-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100">
              <ClipboardList className="hidden sm:inline w-4 h-4" />
              Genel
            </TabsTrigger>
            <TabsTrigger value="ürünler" className="flex items-center gap-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100">
              <Package className="hidden sm:inline w-4 h-4" />
              Ürünler
            </TabsTrigger>
            <TabsTrigger value="kargo" className="flex items-center gap-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100">
              <Truck className="hidden sm:inline w-4 h-4" />
              Kargo
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="genel" className="mt-0">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-200" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">GENEL</h2>
              </div>
            </div>
            <div className="space-y-3">
              {SSS.genel.map((item, index) => {
                const key = `genel-${index}`;
                const isOpen = openItems[key] || false;
                
                return (
                  <div key={index} className="border border-gray-200 dark:border-neutral-800 rounded-lg mb-3 overflow-hidden">
                    <button
                      onClick={() => toggleItem("genel", index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors duration-200 focus:outline-none focus:bg-gray-50 dark:focus:bg-neutral-900"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">
                        {item.request}
                      </span>
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-neutral-800 rounded border border-gray-200 dark:border-neutral-700">
                        {isOpen ? (
                          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        )}
                      </div>
                    </button>
                    
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="border-t border-gray-100 dark:border-neutral-800 pt-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {item.reply}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="ürünler" className="mt-0">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-green-600 dark:text-green-200" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">ÜRÜNLER</h2>
              </div>
            </div>
            <div className="space-y-3">
              {SSS.ürünler.map((item, index) => {
                const key = `ürünler-${index}`;
                const isOpen = openItems[key] || false;
                
                return (
                  <div key={index} className="border border-gray-200 dark:border-neutral-800 rounded-lg mb-3 overflow-hidden">
                    <button
                      onClick={() => toggleItem("ürünler", index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors duration-200 focus:outline-none focus:bg-gray-50 dark:focus:bg-neutral-900"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">
                        {item.request}
                      </span>
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-neutral-800 rounded border border-gray-200 dark:border-neutral-700">
                        {isOpen ? (
                          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        )}
                      </div>
                    </button>
                    
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="border-t border-gray-100 dark:border-neutral-800 pt-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {item.reply}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="kargo" className="mt-0">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Truck className="w-4 h-4 text-orange-600 dark:text-orange-200" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">KARGO</h2>
              </div>
            </div>
            <div className="space-y-3">
              {SSS.kargo.map((item, index) => {
                const key = `kargo-${index}`;
                const isOpen = openItems[key] || false;
                
                return (
                  <div key={index} className="border border-gray-200 dark:border-neutral-800 rounded-lg mb-3 overflow-hidden">
                    <button
                      onClick={() => toggleItem("kargo", index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors duration-200 focus:outline-none focus:bg-gray-50 dark:focus:bg-neutral-900"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">
                        {item.request}
                      </span>
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-neutral-800 rounded border border-gray-200 dark:border-neutral-700">
                        {isOpen ? (
                          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        )}
                      </div>
                    </button>
                    
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="border-t border-gray-100 dark:border-neutral-800 pt-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {item.reply}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Aradığınız soruyu bulamadınız mı?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Uzman ekibimiz size yardımcı olmaktan memnuniyet duyar.
          </p>
          <Button 
            className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black px-6 py-2 rounded-lg"
            onClick={() => router.navigate({ to: '/contact' })}
          >
            Bize Ulaşın
          </Button>
        </div>
      </div>
    </Main>
  );
} 