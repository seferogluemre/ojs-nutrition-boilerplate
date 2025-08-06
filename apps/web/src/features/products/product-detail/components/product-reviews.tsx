import { Button } from "#components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "#components/ui/dialog.js";
import { ImageUpload } from "#components/ui/image-upload.js";
import { Input } from "#components/ui/input.js";
import { Label } from "#components/ui/label.js";
import { Rating, RatingDisplay } from "#components/ui/rating.js";
import { Textarea } from "#components/ui/textarea.js";

import { useAuthStore } from "#stores/authStore.js";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2, Star } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { Review, calculateReviewStats } from "../../data/mock-reviews";
import { ProductCommentResponse } from "../types";

const REVIEWS_PER_PAGE = 3;

interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  images: File[];
}

interface CanReviewResponse {
  canReview: boolean;
  reason?: string;
}

interface ReviewCardProps {
  id: string;
  title: string | null;
  content: string | null;
  rating: number;
  images: string[];
  user: {
    id: string;
    name: string;
    maskedName: string;
  };
  createdAt: string;
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

// Review Card Component
const ReviewCard = ({ id, title, content, rating, images, user, createdAt }: ReviewCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{user.maskedName}</span>
            <span className="text-sm text-gray-500">•</span>
            <RatingDisplay value={rating} size="sm" />
          </div>
          <p className="text-sm text-gray-500">
            {format(new Date(createdAt), "d MMMM yyyy", { locale: tr })}
          </p>
        </div>
      </div>

      {/* Title */}
      {title && (
        <h4 className="font-medium text-gray-900">{title}</h4>
      )}

      {/* Content */}
      {content && (
        <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
      )}

      {/* Images */}
      {images.length > 0 && (
        <div className="">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-gray-10 w-20 h-20 flex items-center "
            >
              <img
                src={"http://localhost:3000/" + imageUrl}
                alt={`Yorum fotoğrafı ${index + 1}`}
                className="w-20 h-20 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={() => {
                  window.open(imageUrl, '_blank');
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ 
  productId, 
  onSuccess, 
  onCancel 
}: { 
  productId: string; 
  onSuccess?: () => void; 
  onCancel?: () => void; 
}) => {
  const [formData, setFormData] = React.useState<ReviewFormData>({
    rating: 0,
    title: "",
    content: "",
    images: [],
  });

  const { auth } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setError("Lütfen bir değerlendirme puanı verin.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for file upload
      const submitFormData = new FormData();
      submitFormData.append('rating', formData.rating.toString());
      
      if (formData.title.trim()) {
        submitFormData.append('title', formData.title.trim());
      }
      
      if (formData.content.trim()) {
        submitFormData.append('content', formData.content.trim());
      }

      // Add images to FormData
      formData.images.forEach((file) => {
        submitFormData.append('images', file);
      });

      // Use fetch directly for multipart/form-data
      const response = await fetch(`http://localhost:3000/api/products/${productId}/comments`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${auth?.accessToken}`,
        },
        body: submitFormData,
      });

      if (response.ok) {
        onSuccess?.();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Yorum gönderilirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      setError("Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (value: number) => {
    setFormData(prev => ({ ...prev, rating: value }));
    setError(null);
  };

  const handleInputChange = (field: keyof ReviewFormData, value: string | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Değerlendirme <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center gap-3">
          <Rating
            value={formData.rating}
            onValueChange={handleRatingChange}
            size="lg"
          />
          {formData.rating > 0 && (
            <span className="text-sm text-gray-600">
              {formData.rating} yıldız
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base font-medium">
          Başlık (Opsiyonel)
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Yorumunuz için kısa bir başlık yazın..."
          maxLength={50}
          className="w-full"
        />
        <p className="text-xs text-gray-500">
          {formData.title.length}/50 karakter
        </p>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content" className="text-base font-medium">
          Yorum (Opsiyonel)
        </Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
          placeholder="Ürün hakkındaki deneyiminizi paylaşın..."
          maxLength={250}
          rows={4}
          className="w-full resize-none"
        />
        <p className="text-xs text-gray-500">
          {formData.content.length}/250 karakter
        </p>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label className="text-base font-medium">
          Fotoğraflar (Opsiyonel)
        </Label>
        <ImageUpload
          value={formData.images}
          onChange={(files) => handleInputChange("images", files)}
          maxFiles={3}
          maxSize={5 * 1024 * 1024} // 5MB
        />
        <p className="text-xs text-gray-500">
          En fazla 3 fotoğraf yükleyebilirsiniz. Maksimum dosya boyutu: 5MB
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || formData.rating === 0}
          className="flex-1"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Yorumu Gönder
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            İptal
          </Button>
        )}
      </div>
    </form>
  );
};

export const ProductReviews = ({ productId }: { productId: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [canReview, setCanReview] = useState<CanReviewResponse>({ canReview: false });
  const { auth } = useAuthStore();

  const { data, refetch } = useQuery({
    queryKey: ["product-comments", productId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/products/${productId}/comments`);
      return response.json();
    }
  });

  // Check if user can review
  const checkCanReview = React.useCallback(async () => {
    if (!auth?.accessToken) {
      setCanReview({ canReview: false, reason: "Giriş yapmalısınız." });
      return;
    }

    console.log("checkCanReview", auth?.accessToken);
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId}/comments/can-review`, {
        headers: {
          authorization: `Bearer ${auth?.accessToken}`,
        },
      });
      
      const result = await response.json();
      
      if (response.ok && result) {
        setCanReview(result as CanReviewResponse);
      } else {
        setCanReview({ canReview: false, reason: "Değerlendirme yapma yetkiniz bulunmuyor." });
      }
    } catch (error) {
      console.error("Failed to check review eligibility:", error);
      setCanReview({ canReview: false, reason: "Giriş yapmalısınız." });
    }
  }, [productId, auth]);

  React.useEffect(() => {
    checkCanReview();
  }, [checkCanReview]);

  const handleReviewSuccess = () => {
    setIsFormOpen(false);
    refetch(); // Refresh reviews
    checkCanReview(); // Update review eligibility
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

  const mappedReviews = mapApiReviewsToReviews(apiReviews);
  const stats = calculateReviewStats(mappedReviews);
  const totalPages = Math.ceil(realReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentRealReviews = realReviews.slice(startIndex, endIndex);
  // const currentReviews = mappedReviews.slice(startIndex, endIndex);

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

        {/* Right Side - Rating Distribution & Review Button */}
        <div className="space-y-4">
          {/* Review Button */}
          {canReview.canReview && (
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="w-full flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Ürünü Değerlendir
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ürünü Değerlendir</DialogTitle>
                </DialogHeader>
                <ReviewForm
                  productId={productId}
                  onSuccess={handleReviewSuccess}
                  onCancel={() => setIsFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}

          {/* Cannot Review Reason */}
          {!canReview.canReview && canReview.reason && (
            <div className="text-sm text-gray-500 text-center">
              {canReview.reason}
            </div>
          )}

          {/* Rating Distribution */}
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
      </div>

      {/* Review Cards */}
      <div className="space-y-6 mb-8">
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
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Henüz yorum yapılmamış
            </h4>
            <p className="text-gray-500">
              Bu ürün için ilk yorumu siz yapın!
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && currentRealReviews.length > 0 && (
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