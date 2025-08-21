export interface ProductComment {
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
  updatedAt: string;
}

export interface DeleteDialogState {
  open: boolean;
  comment: ProductComment | null;
}

export interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

export interface CommentCardProps {
  comment: ProductComment;
  onDelete: (comment: ProductComment) => void;
}

export interface RatingSummaryProps {
  comments: ProductComment[];
  averageRating: string;
  ratingDistribution: Record<number, number>;
}
