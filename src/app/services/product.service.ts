import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { PagedResult } from '../models/paged-result.model';
import { Product, CreateProductRequest, UpdateProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly endpoint = '/api/Products';

  constructor(private apiService: ApiService) {}

  getAllProducts(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResult<Product>>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    return this.apiService.get(`${this.endpoint}/GetAllProducts`, params);
  }

  getProductById(id: string): Observable<ApiResponse<Product>> {
    return this.apiService.get(`${this.endpoint}/GetProductBy/${id}`);
  }

  getProductsByCategoryId(categoryId: string): Observable<ApiResponse<Product[]>> {
    return this.apiService.get(`${this.endpoint}/GetProductsByCategoryId/${categoryId}`);
  }

  createProduct(request: CreateProductRequest): Observable<ApiResponse<Product>> {
    return this.apiService.post(`${this.endpoint}/CreateProduct`, request);
  }

  updateProduct(id: string, request: UpdateProductRequest): Observable<ApiResponse<Product>> {
    return this.apiService.put(`${this.endpoint}/UpdateProductById/${id}`, request);
  }

  deleteProduct(id: string): Observable<ApiResponse<string>> {
    return this.apiService.delete(`${this.endpoint}/DeleteProductById/${id}`);
  }
}