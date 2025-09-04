export interface Category {
  id: string;
  name: string;
  productCount: number;  // Added this field
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}