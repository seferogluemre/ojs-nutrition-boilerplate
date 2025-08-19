import { Button } from "#components/ui/button";
import { ImageUpload } from "#components/ui/image-upload.js";
import { Input } from "#components/ui/input.js";
import { Label } from "#components/ui/label.js";
import { Rating } from "#components/ui/rating.js";
import { Textarea } from "#components/ui/textarea.js";
import { useAuthStore } from "#stores/authStore.js";
import { Loader2 } from "lucide-react";
import * as React from "react";

interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  images: File[];
}

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ productId, onSuccess, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = React.useState<ReviewFormData>({
    rating: 0,
    title: "",
    content: "",
    images: [],
  });

  const auth = useAuthStore();
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
}