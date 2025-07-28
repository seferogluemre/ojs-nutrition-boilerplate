import { Star } from "lucide-react";

interface ProductInfoProps {
  name: string;
  shortExplanation: string;
  averageRating: number;
  commentCount: number;
}

export function ProductInfo({ name, shortExplanation, averageRating, commentCount }: ProductInfoProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    // Half star (if needed)
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="space-y-4">
      {/* Product Name */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
        {name}
      </h1>

      {/* Short Description */}
      <h2 className="text-lg lg:text-xl text-gray-600 font-medium">
        {shortExplanation}
      </h2>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {renderStars(averageRating)}
        </div>
        <span className="text-gray-600 font-medium">
          {commentCount} Yorum
        </span>
      </div>
    </div>
  );
} 