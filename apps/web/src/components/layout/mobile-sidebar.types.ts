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

export interface CategoryNavigationProps {
  onClose: () => void;
}

// Expanded state for accordion navigation
export interface ExpandedState {
  [categoryId: string]: {
    isExpanded: boolean;
    expandedChildren?: {
      [childId: string]: boolean;
    };
  };
} 