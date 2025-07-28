import { Main } from "#components/layout/main";
import { Button } from "#components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { certificates, customerReviews, reviewStats } from "./data/customer-reviews";

const REVIEWS_PER_PAGE = 3;

export default function About() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(customerReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = customerReviews.slice(startIndex, endIndex);

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    const stars = [];
    const sizeClass = size === "lg" ? "w-6 h-6" : "w-4 h-4";
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`${sizeClass} ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const getRatingPercentage = (count: number, total: number) => {
    return total > 0 ? (count / total) * 100 : 0;
  };

  // Calculate rating distribution from customer reviews
  const ratingDistribution = {
    5: customerReviews.filter(r => r.rating === 5).length,
    4: customerReviews.filter(r => r.rating === 4).length,
    3: customerReviews.filter(r => r.rating === 3).length,
    2: customerReviews.filter(r => r.rating === 2).length,
    1: customerReviews.filter(r => r.rating === 1).length,
  };

  // Pagination functions
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Main>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              Sağlıklı ve Fit Yaşamayı Zevkli ve Kolay Hale Getirmek İçin Varız
            </h1>
            
            <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl mx-auto">
              <p className="text-base md:text-lg">
                2016 yılından beri sporcu gıdaları, takviye edici gıdalar ve fonksiyonel gıdaları üreten bir firma olarak, müşterilerimize en kaliteli, lezzetli, tüketilmesi kolay ürünleri sunuyoruz.
              </p>
              <p className="text-base md:text-lg">
                Müşteri memnuniyeti ve sağlığı her zaman önceliğimiz olmıştur. Ürünlerimizde, yüksek kalite standartlarına bağlı olarak, sporcuların ve sağlıklı yaşam tutkunlarının ihtiyaçlarına yönelik besleyici çözümler üretirken, optimal besin değerlerini sunuyoruz.
              </p>
              <p className="text-base md:text-lg">
                Sizin için sadece en iyisinin yeterli olduğunu biliyoruz. Bu nedenle, inovasyon, kalite, sağlık ve güvenlik ilkelerimizi korurken, sürekli olarak ürünlerimizi geliştirmeye ve yenilikçi beslenme çözümleri sunmaya devam ediyoruz. Sporcu gıdası üreticileri için de sizin sağlığınıza performansınıza değer veriyoruz. Siz de spor performansınızı en üst seviyeye çıkarmak ve sağlıklı yaşam tarzınızı desteklemek istiyorsanız, bize katılın ve en besleyici çözümlerimizle tanışın. Sağlıklı ve aktif bir yaşam için her zaman yanınızdayız.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            1.000.000+ den Fazla Mutlu Müşteri
          </h2>
          <p className="text-gray-700 text-base md:text-lg max-w-2xl mx-auto">
            Sanatçılardan profesyonel sporculara, doktordan öğrencilere hayatın her alanında sağlıklı yaşamı ve beslenmeyi hedefleyen 1.000.000'den fazla kişiye ulaştık.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Sertifikalarımız
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="flex flex-col items-center p-4">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <img 
                    src={certificate.imageUrl} 
                    alt={certificate.name}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    onError={() => {
                    }}
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center">
                  {certificate.name}
                </p>
                {certificate.description && (
                  <p className="text-xs text-gray-600 text-center mt-1">
                    {certificate.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Müşteri Yorumları
            </h2>
          </div>

          {/* Rating Overview - Same as Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Side - Overall Rating */}
            <div className="text-center lg:text-left">
              <div className="text-6xl font-bold text-gray-900 mb-2">
                {reviewStats.averageRating}
              </div>
              <div className="flex justify-center lg:justify-start items-center gap-1 mb-2">
                {renderStars(Math.round(reviewStats.averageRating), "lg")}
              </div>
              <div className="text-lg font-semibold text-gray-600">
                {reviewStats.totalReviews.toLocaleString()} YORUM
              </div>
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                YORUM ({reviewStats.totalReviews.toLocaleString()})
              </Button>
            </div>

            {/* Right Side - Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                const percentage = getRatingPercentage(count, customerReviews.length);
                
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      {renderStars(rating, "sm")}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 min-w-[50px] text-right">
                      ({count})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Cards */}
          <div className="space-y-6 mb-8">
            {currentReviews.map((review) => (
              <div key={review.id} className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(review.rating)}
                    </div>
                    <div className="font-semibold text-gray-900 mb-1">
                      {review.userName}
                      {review.verified && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Doğrulanmış
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {review.date}
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">
                  {review.title}
                </h4>
                
                <p className="text-gray-700 leading-relaxed">
                  {review.description}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Önceki
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Sonraki
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </section>

        <section className="text-center bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Bizimle İletişime Geçin
          </h3>
          <p className="text-gray-600 mb-4">
            Sorularınız için uzman ekibimizle iletişime geçebilirsiniz.
          </p>
          <a 
            href="/contact"
            className="inline-block bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors"
          >
            İletişim
          </a>
        </section>
      </div>
    </Main>
  );
} 