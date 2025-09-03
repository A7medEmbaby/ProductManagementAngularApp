import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="container">
      <h2>{{ isEditMode ? 'Edit Product' : 'Create Product' }}</h2>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <form *ngIf="!loading" [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Product Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter product name" />
          <mat-error *ngIf="productForm.get('name')?.hasError('required')">
            Product name is required
          </mat-error>
          <mat-error *ngIf="productForm.get('name')?.hasError('maxlength')">
            Product name cannot exceed 200 characters
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category</mat-label>
          <mat-select formControlName="categoryId">
            <mat-option *ngFor="let category of categories" [value]="category.id">
              {{ category.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="productForm.get('categoryId')?.hasError('required')">
            Please select a category
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" placeholder="0.00" step="0.01" min="0.01" />
          <mat-error *ngIf="productForm.get('price')?.hasError('required')">
            Price is required
          </mat-error>
          <mat-error *ngIf="productForm.get('price')?.hasError('min')">
            Price must be greater than 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Currency (Optional)</mat-label>
          <mat-select formControlName="currency">
            <mat-option value="">Select Currency</mat-option>
            <mat-option value="USD">USD - US Dollar</mat-option>
            <mat-option value="EUR">EUR - Euro</mat-option>
            <mat-option value="GBP">GBP - British Pound</mat-option>
            <mat-option value="EGP">EGP - Egyptian Pound</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="form-actions">
          <button mat-button type="button" (click)="goBack()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="productForm.invalid || submitting">
            {{ submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  productId: string | null = null;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      categoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      currency: ['']
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    if (this.isEditMode && this.productId) {
      forkJoin({
        categories: this.categoryService.getAllCategories(),
        product: this.productService.getProductById(this.productId)
      }).subscribe({
        next: (response) => {
          this.categories = response.categories.data || [];
          const product = response.product.data;
          this.productForm.patchValue({
            name: product.name,
            categoryId: product.categoryId,
            price: product.price,
            currency: product.currency || ''
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.snackBar.open('Error loading product', 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        }
      });
    } else {
      this.categoryService.getAllCategories().subscribe({
        next: (response) => {
          this.categories = response.data || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.snackBar.open('Error loading categories', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.submitting = true;
      const formValue = this.productForm.value;

      // Remove empty currency field
      if (!formValue.currency) {
        delete formValue.currency;
      }

      const request$ = this.isEditMode && this.productId
        ? this.productService.updateProduct(this.productId, formValue)
        : this.productService.createProduct(formValue);

      request$.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Product updated successfully' : 'Product created successfully';
          this.snackBar.open(message, 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.snackBar.open('Error saving product', 'Close', { duration: 3000 });
          this.submitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}