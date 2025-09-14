import { RatingDisplay } from "#components/ui/rating.js";
import { SafeImage } from "#components/ui/safe-image.js";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

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

export function ReviewCard({ 
  id, 
  title, 
  content, 
  rating, 
  images, 
  user, 
  createdAt 
}: ReviewCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.maskedName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">{user.maskedName}</span>
              <RatingDisplay value={rating} size="sm" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(createdAt), "d MMMM yyyy", { locale: tr })}
            </p>
          </div>
        </div>
      </div>

      {/* Title */}
      {title && (
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">{title}</h4>
      )}

      {/* Content */}
      {content && (
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">{content}</p>
      )}

      {/* Images */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <SafeImage
                  src={"http://localhost:3000" + imageUrl}
                  alt={`Yorum fotoğrafı ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                  onClick={() => {
                    window.open("http://localhost:3000" + imageUrl, '_blank');
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}