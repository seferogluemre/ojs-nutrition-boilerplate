export interface SubChildCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface ChildCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  sub_children: SubChildCategory[];
}

export interface TopSeller {
  id: string;
  name: string;
  slug: string;
  description: string;
  picture_src: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  children: ChildCategory[];
  top_sellers: TopSeller[];
}

export interface CategoriesApiResponse {
  data: Category[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    pageCount: number;
  };
}

export interface CategoryNavigationProps {
  onClose: () => void;
}

// Sliding panels types
export type PanelLevel = 'main' | 'category' | 'subcategory' | 'products';

export interface PanelData {
  level: PanelLevel;
  title: string;
  items: any[];
  parentId?: string;
  parentData?: Category | ChildCategory;
} 