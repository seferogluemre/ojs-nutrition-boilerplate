export interface CustomerReview {
  id: string;
  userName: string;
  rating: number;
  title: string;
  description: string;
  date: string;
  productName?: string;
  verified?: boolean;
}

export interface Certificate {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export interface AboutContent {
  heroTitle: string;
  heroDescription: string[];
  customerCount: string;
  customerCountDescription: string;
} 