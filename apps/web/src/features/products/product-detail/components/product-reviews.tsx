import { Button } from "#components/ui/button";
import { api } from "#lib/api.js";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { Review, calculateReviewStats } from "../../data/mock-reviews";

const REVIEWS_PER_PAGE = 3;

interface ProductCommentResponse {
  id: string;
  title: string;
  content: string;
  rating: number;
  user: {
    id: number;
    name: string;
  },
  createdAt: string;
  updatedAt: string;
}

const mapApiReviewsToReviews = (apiReviews: ProductCommentResponse[]): Review[] => {
  return apiReviews.map(apiReview => ({
    id: apiReview.id,
    userId: apiReview.user.id.toString(),
    userName: apiReview.user.name,
    rating: apiReview.rating,
    title: apiReview.title,
    description: apiReview.content,
    date: new Date(apiReview.createdAt).toLocaleDateString('tr-TR'),
    verified: false
  }));
};

export const ProductReviews = ({ productId }: { productId: string }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["product-comments", productId],
    queryFn: () => api.products({ productId }).comments.get()
  })
  

  const apiReviews = data?.data?.data || [];
  const mappedReviews = mapApiReviewsToReviews(apiReviews);
  const stats = calculateReviewStats(mappedReviews);
  const totalPages = Math.ceil(mappedReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = mappedReviews.slice(startIndex, endIndex);

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
    <section className="mt-12">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Müşteri Yorumları
        </h2>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Side - Overall Rating */}
        <div className="text-center lg:text-left">
          <div className="text-6xl font-bold text-gray-900 mb-2">
            {stats.averageRating}
          </div>
          <div className="flex justify-center lg:justify-start items-center gap-1 mb-2">
            {renderStars(Math.round(stats.averageRating), "lg")}
          </div>
          <div className="text-lg font-semibold text-gray-600">
            {stats.totalReviews.toLocaleString()} YORUM
          </div>
          <Button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            YORUM ({stats.totalReviews.toLocaleString()})
          </Button>
        </div>

        {/* Right Side - Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
            const percentage = getRatingPercentage(count, stats.totalReviews);

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
  );
}; 