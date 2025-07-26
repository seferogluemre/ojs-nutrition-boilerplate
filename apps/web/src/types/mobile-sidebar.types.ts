export interface SubChildCategory {
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

// Navigation stack types
export type NavigationLevel = 'main' | 'category' | 'subcategory' | 'products';

export interface NavigationStackItem {
  level: NavigationLevel;
  title: string;
  items: any[];
  parentId?: string;
  parentData?: Category | ChildCategory;
}

export interface CategoryNavigationProps {
  onClose: () => void;
} 