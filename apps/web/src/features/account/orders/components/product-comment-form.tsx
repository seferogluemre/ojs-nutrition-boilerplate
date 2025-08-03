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
      await api.products({ id: productId }).comments.post({
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
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h8a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Ürün Yorumu Ekle
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">{productName}</span> için yorumunuzu paylaşın
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/50"
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
              Değerlendirme
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-7 h-7 transition-colors ${
                      star <= formData.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                    stroke="currentColor"
                    fill={star <= formData.rating ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              ))}
              <span className="ml-3 text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-full">
                {formData.rating} yıldız
              </span>
            </div>
          </div>

          {/* Title and Content in a grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Başlık *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors placeholder-gray-400"
                placeholder="Yorumunuz için bir başlık yazın"
                disabled={isSubmitting}
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Yorum *
              </label>
              <textarea
                id="content"
                rows={3}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors placeholder-gray-400 resize-none"
                placeholder="Ürün hakkındaki deneyiminizi paylaşın..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center shadow-sm hover:shadow-md"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Ekleniyor...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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