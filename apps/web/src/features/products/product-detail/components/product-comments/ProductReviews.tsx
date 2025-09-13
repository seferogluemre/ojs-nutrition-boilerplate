import { Button } from "#components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "#components/ui/dialog.js";
import { api } from "#lib/api.js";
import { useAuthStore } from "#stores/authStore.js";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Image, Star } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Review, calculateReviewStats } from "../../../data/mock-reviews";
import { ProductCommentResponse } from "../../types";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { ReviewTabs } from "./ReviewTabs";

const REVIEWS_PER_PAGE = 3;

interface CanReviewResponse {
  canReview: boolean;
  reason?: string;
}

const mapApiReviewsToReviews = (
  apiReviews: ProductCommentResponse[],
): Review[] => {
  return apiReviews.map((apiReview) => ({
    id: apiReview.id,
    userId: apiReview.user.id.toString(),
    userName: apiReview.user.name,
    rating: apiReview.rating,
    title: apiReview.title,
    description: apiReview.content,
    date: new Date(apiReview.createdAt).toLocaleDateString("tr-TR"),
    verified: false,
  }));
};

export function ProductReviews({ productId }: { productId: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [canReview, setCanReview] = useState<CanReviewResponse>({
    canReview: false,
  });
  const [activeTab, setActiveTab] = useState<string>("all");
  const auth = useAuthStore();
  const router = useRouter();

  const { data, refetch } = useQuery({
    queryKey: ["product-comments", productId],
    queryFn: async () => {
      console.log("productId", productId);
      const response = await api.products({ productId })["comments"].get();
      return response.data;
    },
  });

  // Check if user can review
  const checkCanReview = React.useCallback(async () => {
    if (!auth?.accessToken) {
      setCanReview({ canReview: false, reason: "Giriş yapmalısınız." });
      return;
    }

    console.log("checkCanReview", auth?.accessToken);
    try {
      const response = await api.products({ productId })["comments"]["can-review"].get();
      if (response.status == 200) {
        setCanReview(response.data as CanReviewResponse);
      } else {
        setCanReview({
          canReview: false,
          reason: "Değerlendirme yapma yetkiniz bulunmuyor.",
        });
      }
    } catch (error) {
      console.error("Failed to check review eligibility:", error);
      setCanReview({ canReview: false, reason: "Giriş yapmalısınız." });
    }
  }, [productId, auth]);

  React.useEffect(() => {
    checkCanReview();
  }, [checkCanReview]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('comment') === 'true') {
      setShowInlineForm(true);
      // Reviews section'a scroll yap
      setTimeout(() => {
        const reviewsSection = document.querySelector('[data-reviews-section]');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const handleReviewSuccess = () => {
    setIsFormOpen(false);
    setShowInlineForm(false);
    refetch(); // Refresh reviews
    checkCanReview(); // Update review eligibility
    
    // URL'den comment parametresini temizle
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('comment');
    window.history.replaceState({}, '', currentUrl.toString());
    
    // Reviews listesinin başına scroll yap
    setTimeout(() => {
      const reviewsSection = document.querySelector('[data-reviews-section]');
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setShowInlineForm(false);
    
    // URL'den comment parametresini temizle
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('comment');
    window.history.replaceState({}, '', currentUrl.toString());
  };

  const apiReviews = data?.data || [];

  // Map API reviews to display format with real data
  const realReviews = apiReviews.map((apiReview: ProductCommentResponse) => ({
    id: apiReview.id,
    title: apiReview.title,
    content: apiReview.content,
    rating: apiReview.rating,
    images: (apiReview as any).images || [],
    user: apiReview.user,
    createdAt: apiReview.createdAt,
  }));

  // Filter reviews based on active tab
  const reviewsWithoutImages = realReviews.filter(
    (review: any) => review.images.length === 0,
  );
  const reviewsWithImages = realReviews.filter(
    (review: any) => review.images.length > 0,
  );

  const currentTabReviews =
    activeTab === "with-images" ? reviewsWithImages : reviewsWithoutImages;

  const mappedReviews = mapApiReviewsToReviews(apiReviews);
  const stats = calculateReviewStats(mappedReviews);
  const totalPages = Math.ceil(currentTabReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentRealReviews = currentTabReviews.slice(startIndex, endIndex);

  // Reset page when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    const stars = [];
    const sizeClass = size === "lg" ? "w-6 h-6" : "w-4 h-4";

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${sizeClass} ${i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />,
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
    <section className="mt-12" data-reviews-section>
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Müşteri Yorumları
        </h2>

        {/* Tabs */}
        <ReviewTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          reviewsWithoutImagesCount={reviewsWithoutImages.length}
          reviewsWithImagesCount={reviewsWithImages.length}
        />
      </div>

      {/* Rating Overview */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Side - Overall Rating */}
        <div className="text-center lg:text-left">
          <div className="mb-2 text-6xl font-bold text-gray-900">
            {stats.averageRating}
          </div>
          <div className="mb-2 flex items-center justify-center gap-1 lg:justify-start">
            {renderStars(Math.round(stats.averageRating), "lg")}
          </div>
          <div className="text-lg font-semibold text-gray-600">
            {stats.totalReviews.toLocaleString()} YORUM
          </div>
          <Button className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            YORUM ({stats.totalReviews.toLocaleString()})
          </Button>
        </div>

        {/* Right Side - Rating Distribution & Review Button */}
        <div className="space-y-4">
          {/* Review Button */}
          {canReview.canReview && (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ürünü Değerlendir</DialogTitle>
                </DialogHeader>
                <ReviewForm
                  productId={productId}
                  onSuccess={handleReviewSuccess}
                  onCancel={handleFormCancel}
                />
              </DialogContent>
            </Dialog>
          )}

          {/* Cannot Review Reason */}
          {!canReview.canReview && canReview.reason && (
            <div className="text-center text-sm text-gray-500">
              {canReview.reason}
            </div>
          )}

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                stats.ratingDistribution[
                  rating as keyof typeof stats.ratingDistribution
                ];
              const percentage = getRatingPercentage(count, stats.totalReviews);

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex min-w-[60px] items-center gap-1">
                    {renderStars(rating, "sm")}
                  </div>
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="min-w-[50px] text-right text-sm text-gray-600">
                    ({count})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Cards */}
      <div className="mb-8 space-y-4">
        {currentRealReviews.length > 0 ? (
          currentRealReviews.map((review: any) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              title={review.title}
              content={review.content}
              rating={review.rating}
              images={review.images}
              user={review.user}
              createdAt={review.createdAt}
            />
          ))
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center">
            {activeTab === "with-images" ? (
              <Image className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            ) : (
              <Star className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            )}
            <h4 className="mb-2 text-xl font-medium text-gray-900">
              {activeTab === "with-images"
                ? "Henüz görselli yorum yapılmamış"
                : "Henüz yorum yapılmamış"}
            </h4>
            <p className="mb-6 text-gray-500">
              {activeTab === "with-images"
                ? "Bu ürün için ilk görselli yorumu siz yapın!"
                : "Bu ürün için ilk yorumu siz yapın!"}
            </p>
            {canReview.canReview && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2"
              >
                <Star className="h-4 w-4" />
                Ürünü Değerlendir
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Inline Comment Form - Yorumların altında göster */}
      {showInlineForm && canReview.canReview && (
        <div className="mb-8">
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-1">
            <div className="rounded-md bg-white p-6">
              <div className="mb-4 flex items-center">
                <Star className="mr-2 h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Ürünü Değerlendir
                </h3>
              </div>
              <ReviewForm
                productId={productId}
                onSuccess={handleReviewSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && currentRealReviews.length > 0 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Önceki
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className="h-10 w-10"
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
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
