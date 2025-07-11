import { useBlazeSlider } from '#hooks';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    date: "03/05/2024",
    title: "Beğendim gayet güzeldi",
    description: "Ürün gayet güzel ama ekşiliği biraz sürdürememişse gerekmişti sonra bayağıilıyor insanı. Teşekkürler."
  },
  {
    id: 2,
    date: "15/04/2024", 
    title: "Mükemmel kalite",
    description: "Aldığım protein tozu gerçekten çok kaliteli. Özellikle antrenman sonrası kas gelişiminde fark edilir bir etki yaratıyor."
  },
  {
    id: 3,
    date: "28/04/2024",
    title: "Hızlı kargo",
    description: "Sipariş verdiğim günün ertesi günü kapımda. Ürün kalitesi de gayet iyi, tavsiye ederim."
  },
  {
    id: 4,
    date: "12/05/2024",
    title: "Güvenilir satıcı",
    description: "OJS Nutrition'dan aldığım vitaminler gerçekten işe yarıyor. Düzenli kullanımda enerji seviyemde artış var."
  },
  {
    id: 5,
    date: "07/05/2024",
    title: "Lezzet mükemmel",
    description: "Whey protein tozunun lezzeti gerçekten harika. Su ile bile karıştırınca çok güzel oluyor."
  },
  {
    id: 6,
    date: "20/04/2024",
    title: "Etkili ürün",
    description: "BCAA kullanmaya başladıktan sonra antrenman performansımda belirgin bir artış gözlemliyorum."
  },
  {
    id: 7,
    date: "25/04/2024",
    title: "Fiyat performans",
    description: "Kaliteli ürünler için uygun fiyatlar. Başka sitelerden çok daha hesaplı alışveriş yaptım."
  },
  {
    id: 8,
    date: "10/05/2024",
    title: "Müşteri hizmetleri",
    description: "Bir sorunumla ilgili müşteri hizmetlerini aradım, çok ilgili ve yardımcı oldular. Teşekkürler."
  },
  {
    id: 9,
    date: "02/05/2024",
    title: "Düzenli müşteriyim",
    description: "6 aydır düzenli olarak buradan alışveriş yapıyorum. Hiç sorun yaşamadım, kalite her zaman yüksek."
  },
  {
    id: 10,
    date: "18/04/2024",
    title: "Önerilen ürün",
    description: "Antrenörümün önerisiyle aldığım kreatin gerçekten etkili. Güç artışı hemen fark ediliyor."
  },
  {
    id: 11,
    date: "13/05/2024",
    title: "Kolay çözünüyor",
    description: "Aldığım protein tozu suda çok kolay çözünüyor, hiç topak yapmıyor. Bu çok önemli benim için."
  },
  {
    id: 12,
    date: "08/04/2024",
    title: "Sertifikalı ürünler",
    description: "Ürünlerin sertifikaları mevcut, güvenle kullanabiliyorum. Kalite kontrolü çok iyi."
  },
  {
    id: 13,
    date: "22/04/2024",
    title: "Ambalaj güvenli",
    description: "Ürünler çok güvenli ambalajlarla geliyor. Taşıma sırasında hiç zarar görmüyor."
  },
  {
    id: 14,
    date: "14/05/2024",
    title: "Çeşitli ürün seçeneği",
    description: "İhtiyacım olan tüm supplement ürünleri tek yerden bulabiliyorum. Çok praktik."
  },
  {
    id: 15,
    date: "05/05/2024",
    title: "Doğal içerik",
    description: "Ürünlerin içeriği tamamen doğal. Yapay katkı maddeleri yok, bu çok önemli."
  },
  {
    id: 16,
    date: "29/04/2024",
    title: "Antrenman desteği",
    description: "Pre-workout aldığım ürün gerçekten enerji veriyor. Antrenmanlarım çok daha verimli geçiyor."
  },
  {
    id: 17,
    date: "11/05/2024",
    title: "Ailemle birlikte",
    description: "Sadece kendim değil, ailemle birlikte vitamin ve mineral takviyelerini buradan alıyoruz."
  },
  {
    id: 18,
    date: "26/04/2024",
    title: "Spor salonunda tavsiye",
    description: "Spor salonundaki arkadaşlara da tavsiye ettim. Herkes memnun kaldı ürünlerden."
  }
];

export function CustomerReviews() {
  const { sliderElRef, prev, next } = useBlazeSlider({
    all: {
      slidesToShow: 1, // Mobil için 1 kart
      slidesToScroll: 1,
      loop: true,
    },
    "(min-width: 768px)": {
      slidesToShow: 2, // Tablet için 2 kart
    },
    "(min-width: 1024px)": {
      slidesToShow: 4, // Desktop için 4 kart
    },
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header with title and review count */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            GERÇEK MÜŞTERİ YORUMLARI
          </h2>
          <div className="text-sm text-green-600 font-medium">
            <span className="font-bold">{mockReviews.length}</span> Yorum
          </div>
        </div>

        {/* Slider container */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-shadow duration-200"
            aria-label="Önceki yorumlar"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-shadow duration-200"
            aria-label="Sonraki yorumlar"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Slider */}
          <div ref={sliderElRef} className="blaze-slider">
            <div className="blaze-container">
              <div className="blaze-track-container">
                <div className="blaze-track">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="blaze-slide">
                      <div className="w-[300px] h-[196px] p-6 bg-transparent">
                        {/* Date */}
                        <div className="text-sm text-gray-500 mb-3">
                          {review.date}
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                          {review.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                          {review.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 