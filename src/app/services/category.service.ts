import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly endpoint = '/api/Categories';

  constructor(private apiService: ApiService) {}

  getAllCategories(): Observable<ApiResponse<Category[]>> {
    return this.apiService.get(`${this.endpoint}/GetAllCategories`);
  }

  getCategoryById(id: string): Observable<ApiResponse<Category>> {
    return this.apiService.get(`${this.endpoint}/GetCategoryById/${id}`);
  }

  createCategory(request: CreateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.apiService.post(`${this.endpoint}/CreateCategory`, request);
  }

  updateCategory(id: string, request: UpdateCategoryRequest): Observable<ApiResponse<Category>> {
    return this.apiService.put(`${this.endpoint}/UpdateCategoryById/${id}`, request);
  }

  deleteCategory(id: string): Observable<ApiResponse<string>> {
    return this.apiService.delete(`${this.endpoint}/DeleteCategoryById/${id}`);
  }
}
