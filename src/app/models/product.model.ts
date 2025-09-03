export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  currency?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  categoryId: string;
  price: number;
  currency?: string;
}

export interface UpdateProductRequest {
  name: string;
  price: number;
  currency?: string;
}
