import { useBlazeSlider } from '#hooks';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import customerReviewsData from '../data/customer-reviews.json';
import type { Review } from '../types/customer-reviews';

// Cast the imported data to the correct type
const mockReviews: Review[] = customerReviewsData;

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
  
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReview(null);
    setIsModalOpen(false);
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Header with title and review count */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            MÜŞTERİ YORUMLARI
          </h2>
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            <span className="font-bold">{mockReviews.length}</span> Yorum
          </div>
        </div>

        {/* Slider container */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={prev}
            className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 translate-x-0 sm:-translate-x-4 md:-translate-x-8 lg:-translate-x-12 xl:-translate-x-16 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:shadow-xl transition-shadow duration-200"
            aria-label="Önceki yorumlar"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            onClick={next}
            className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 translate-x-0 sm:translate-x-4 md:translate-x-6 lg:translate-x-8 xl:translate-x-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 hover:shadow-xl transition-shadow duration-200"
            aria-label="Sonraki yorumlar"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Slider */}
          <div ref={sliderElRef} className="blaze-slider">
            <div className="blaze-container">
              <div className="blaze-track-container">
                <div className="blaze-track py-12">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="blaze-slide">
                      <div 
                        className="w-[280px] sm:w-[260px] md:w-[280px] lg:w-[260px] xl:w-[280px] h-[210px] p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 transform transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-102 hover:-translate-y-0.5 hover:border-gray-200 dark:hover:border-gray-600 cursor-pointer"
                        onClick={() => openModal(review)}
                      >
                        {/* Date */}
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {review.date}
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                          {review.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed">
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

      {/* Modal */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={closeModal}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {selectedReview.date}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedReview.title}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Kapat"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {selectedReview.description}
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 