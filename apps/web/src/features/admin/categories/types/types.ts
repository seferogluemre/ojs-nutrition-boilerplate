export interface Category {
  id: string;
  uuid: string;
  name: string;
  slug: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  order: number;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  parentId?: string;
  order?: number;
}

export interface CategoryFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  parentId?: string;
}

export type CategoryStatus = 'active' | 'inactive';
