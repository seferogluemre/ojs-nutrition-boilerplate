import { Card, CardHeader } from '#/components/ui/card';
import { Separator } from '#/components/ui/separator';
import { Star } from 'lucide-react';
import { RatingSummaryProps } from '../types';
import { StarRating } from './star-rating';

export const RatingSummary = ({ comments, averageRating, ratingDistribution }: RatingSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{averageRating}</div>
              <StarRating rating={Math.round(Number(averageRating))} size="md" />
              <div className="text-sm text-muted-foreground mt-1">
                {comments.length} yorum
              </div>
            </div>
            <Separator orientation="vertical" className="h-16" />
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ 
                        width: `${comments.length > 0 ? (ratingDistribution[rating] / comments.length) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
