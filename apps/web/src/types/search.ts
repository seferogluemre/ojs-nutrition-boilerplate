export interface SearchProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  primaryPhotoUrl: string;
  discountPercentage?: number;
}