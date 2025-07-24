import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#components/ui/accordion";

export function ProductDetails() {
  return (
    <div className="mt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="features">
          <AccordionTrigger className="text-lg font-semibold">
            ÖZELLİKLER
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 leading-relaxed">
            <div className="space-y-4">
              <p>
                Cream of Rice, beyaz pirinç unundan yapılan, sindirimi kolay kompleks bir karbonhidrattır.
                Glutensizdir ve vücut geliştirme sürecindeki diyetiniz için mükemmel bir seçenektir.
                Ek olarak, gün içerisinde ara öğünlerde veya öğünlerinizde ekstra kalori kaynağınızdır.
              </p>
              <p>
                Karbonhidratlar; normal beyin fonksiyonunun korunmasına ve iskelet kaslarındaki glikojen
                depolarının azalması ve kas yorulmasına sebep olan yüksek yoğunluklu ve/veya uzun süreli
                fiziksel egzersiz sonrası normal kas fonksiyonlarına katkıda bulunur.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pratik ve hızlı karbonhidrat kaynağı</li>
                <li>Her servisinde 38g karbonhidrat içerir.</li>
                <li>Tek başına veya tariflerinize ekleyerek kullanabilirsiniz.</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="nutrition">
          <AccordionTrigger className="text-lg font-semibold">
            BESİN İÇERİĞİ
          </AccordionTrigger>
          <AccordionContent className="text-gray-700">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">BESİN DEĞERİ</h4>
                <p className="text-sm text-gray-600 mb-3">25 g servis için</p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Enerji</span>
                    <span>738 kJ | 174 kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein</span>
                    <span>4.6 g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Karbonhidrat</span>
                    <span>37.9 g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Şeker</span>
                    <span>0 g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yağ</span>
                    <span>0.4 g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doymuş Yağ</span>
                    <span>0.1 g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tuz</span>
                    <span>0.1 g</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">İÇİNDEKİLER</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Vanilya Aromalı:</strong> Mikronize Pirinç Unu, Aroma Verici, Tatlandırıcı: Sukraloz, Vanilin</p>
                  <p><strong>Çikolata Aromalı:</strong> Mikronize Pirinç Unu, Yağı Azaltılmış Kakao, Aroma Verici, Tatlandırıcı: Sukraloz</p>
                  <p><strong>Muz Aromalı:</strong> Mikronize Pirinç Unu, Aroma Verici, Tatlandırıcı: Sukraloz</p>
                  <p><strong>Hindistan Cevizi Aromalı:</strong> Mikronize Pirinç Unu, Aroma Verici, Tatlandırıcı: Sukraloz</p>
                  <p><strong>Lemon Cheesecake Aromalı:</strong> Mikronize Pirinç Unu, Aroma Verici, Renklendirici: Beta Karoten, Tatlandırıcı: Sukraloz</p>
                  <p><strong>Çilek Aromalı:</strong> Mikronize Pirinç Unu, Aroma Verici, Çilek Tozu, Renklendirici: Pancar Kökü Kırmızısı, Tatlandırıcı: Sukraloz</p>
                  <p><strong>Muhallebi(Damla Sakızlı) Aromalı:</strong> Mikronize Pirinç Unu, Aroma Verici, Tarçın Tozu, Tatlandırıcı: Sukraloz, Vanilin</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="usage">
          <AccordionTrigger className="text-lg font-semibold">
            KULLANIM ŞEKLİ
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 leading-relaxed">
            <p>
              1 ölçek (yaklaşık 50g) ürünü tavaya veya tencereye koyunuz, 200ml su veya süt ile
              kıvam alana kadar kısık ateşte pişiriniz. Gün içerisinde kendi programınıza göre
              dilediğiniz zaman kullanabilirsiniz.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 