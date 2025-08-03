import { useToast } from "#hooks/use-toast";
import { api } from "#lib/api.js";
import { useAuthStore } from "#stores/authStore.js";
import { useState } from "react";

interface ProductCommentFormProps {
  productId: string;
  productName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductCommentForm({ productId, productName, onSuccess, onCancel }: ProductCommentFormProps) {
  const { auth } = useAuthStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Hata",
        description: "Başlık alanı zorunludur.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Hata",
        description: "Yorum alanı zorunludur.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await (api as any).products({ id: productId }).comments.post({
        title: formData.title,
        content: formData.content,
        rating: formData.rating
      }, {
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`,
        },
      });

      toast({
        title: "Başarılı",
        description: "Yorumunuz başarıyla eklendi.",
      });

      // Reset form and call success callback
      setFormData({ title: "", content: "", rating: 1 });
      onSuccess();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  return (
    <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ürün Yorumu Ekle
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">{productName}</span> için yorumunuzu paylaşın
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <svg className="w-4 h-4 mr-1 inline text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Değerlendirme
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none transition-all duration-200 hover:scale-110 focus:scale-110"
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      star <= formData.rating
                        ? "text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
              <span className="ml-3 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                {formData.rating} yıldız
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 mr-1 inline text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Başlık *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400 hover:border-gray-400"
              placeholder="Yorumunuz için bir başlık yazın"
              disabled={isSubmitting}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              <svg className="w-4 h-4 mr-1 inline text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Yorum *
            </label>
            <textarea
              id="content"
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400 resize-none hover:border-gray-400"
              placeholder="Ürün hakkındaki deneyiminizi paylaşın..."
              disabled={isSubmitting}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center"
              disabled={isSubmitting}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center shadow-sm hover:shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Ekleniyor...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  Yorum Ekle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}