import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatIconModule,
    MatSnackBarModule,
    MatStepperModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="product-form-container">
      <!-- Header Section -->
      <div class="form-header fade-in">
        <div class="header-content">
          <div class="breadcrumb">
            <button mat-button (click)="goBack()" class="breadcrumb-btn">
              <mat-icon>arrow_back</mat-icon>
              Products
            </button>
            <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
            <span class="current-page">{{ isEditMode ? 'Edit Product' : 'New Product' }}</span>
          </div>
          <h1 class="form-title">
            <mat-icon class="title-icon">{{ isEditMode ? 'edit' : 'add_circle' }}</mat-icon>
            {{ isEditMode ? 'Edit Product' : 'Create New Product' }}
          </h1>
          <p class="form-subtitle">
            {{ isEditMode ? 'Update product information and settings' : 'Add a new product to your inventory' }}
          </p>
        </div>
      </div>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading" class="form-content slide-in">
        <mat-card class="form-card">
          <mat-card-content>
            <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
              <div class="form-section">
                <div class="section-header">
                  <mat-icon class="section-icon">info</mat-icon>
                  <h3 class="section-title">Basic Information</h3>
                </div>
                <mat-divider></mat-divider>
                
                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Product Name</mat-label>
                    <input 
                      matInput 
                      formControlName="name" 
                      placeholder="Enter product name"
                      maxlength="200">
                    <mat-icon matSuffix matTooltip="Product name is required">info</mat-icon>
                    <mat-hint align="end">{{ productForm.get('name')?.value?.length || 0 }}/200</mat-hint>
                    <mat-error *ngIf="productForm.get('name')?.hasError('required')">
                      Product name is required
                    </mat-error>
                    <mat-error *ngIf="productForm.get('name')?.hasError('maxlength')">
                      Product name cannot exceed 200 characters
                    </mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Category</mat-label>
                    <mat-select formControlName="categoryId" placeholder="Select a category">
                      <mat-option *ngFor="let category of categories" [value]="category.id">
                        <div class="category-option">
                          <mat-icon class="category-icon">category</mat-icon>
                          {{ category.name }}
                          <span class="category-count">({{ category.productCount }} products)</span>
                        </div>
                      </mat-option>
                    </mat-select>
                    <mat-icon matSuffix matTooltip="Select product category">category</mat-icon>
                    <mat-error *ngIf="productForm.get('categoryId')?.hasError('required')">
                      Please select a category
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>

              <div class="form-section">
                <div class="section-header">
                  <mat-icon class="section-icon">attach_money</mat-icon>
                  <h3 class="section-title">Pricing Information</h3>
                </div>
                <mat-divider></mat-divider>

                <div class="form-row two-columns">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Price</mat-label>
                    <input 
                      matInput 
                      type="number" 
                      formControlName="price" 
                      placeholder="0.00" 
                      step="0.01" 
                      min="0.01">
                    <span matTextPrefix>{{ getCurrencySymbol() }}&nbsp;</span>
                    <mat-icon matSuffix matTooltip="Product price">attach_money</mat-icon>
                    <mat-error *ngIf="productForm.get('price')?.hasError('required')">
                      Price is required
                    </mat-error>
                    <mat-error *ngIf="productForm.get('price')?.hasError('min')">
                      Price must be greater than 0
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Currency</mat-label>
                    <mat-select formControlName="currency" placeholder="Select currency">
                      <mat-option value="">Default (USD)</mat-option>
                      <mat-option value="USD">
                        <div class="currency-option">
                          <span class="currency-code">USD</span>
                          <span class="currency-name">US Dollar</span>
                        </div>
                      </mat-option>
                      <mat-option value="EUR">
                        <div class="currency-option">
                          <span class="currency-code">EUR</span>
                          <span class="currency-name">Euro</span>
                        </div>
                      </mat-option>
                      <mat-option value="GBP">
                        <div class="currency-option">
                          <span class="currency-code">GBP</span>
                          <span class="currency-name">British Pound</span>
                        </div>
                      </mat-option>
                      <mat-option value="EGP">
                        <div class="currency-option">
                          <span class="currency-code">EGP</span>
                          <span class="currency-name">Egyptian Pound</span>
                        </div>
                      </mat-option>
                    </mat-select>
                    <mat-icon matSuffix matTooltip="Optional currency">language</mat-icon>
                  </mat-form-field>
                </div>

                <!-- Price Preview -->
                <div class="price-preview" *ngIf="productForm.get('price')?.value">
                  <div class="preview-label">Price Preview:</div>
                  <div class="preview-value">
                    {{ productForm.get('price')?.value | currency:(productForm.get('currency')?.value || 'USD') }}
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <div class="actions-left">
                  <button 
                    mat-button 
                    type="button" 
                    (click)="goBack()"
                    class="cancel-btn">
                    <mat-icon>close</mat-icon>
                    Cancel
                  </button>
                </div>
                
                <div class="actions-right">
                  <button 
                    mat-button 
                    type="button" 
                    (click)="resetForm()"
                    class="reset-btn"
                    [disabled]="submitting">
                    <mat-icon>refresh</mat-icon>
                    Reset
                  </button>
                  
                  <button 
                    mat-raised-button 
                    color="primary" 
                    type="submit" 
                    [disabled]="productForm.invalid || submitting"
                    class="submit-btn">
                    <mat-icon *ngIf="!submitting">{{ isEditMode ? 'save' : 'add_circle' }}</mat-icon>
                    <mat-icon *ngIf="submitting" class="spinning">hourglass_empty</mat-icon>
                    {{ submitting ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product') }}
                  </button>
                </div>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Form Tips Card -->
        <mat-card class="tips-card">
          <mat-card-content>
            <div class="tips-header">
              <mat-icon class="tips-icon">lightbulb</mat-icon>
              <h4>Tips for Success</h4>
            </div>
            <ul class="tips-list">
              <li>
                <mat-icon class="tip-icon">check_circle</mat-icon>
                Use descriptive names that clearly identify your products
              </li>
              <li>
                <mat-icon class="tip-icon">check_circle</mat-icon>
                Select the most appropriate category for better organization
              </li>
              <li>
                <mat-icon class="tip-icon">check_circle</mat-icon>
                Set competitive prices based on market research
              </li>
              <li>
                <mat-icon class="tip-icon">check_circle</mat-icon>
                Choose the correct currency for your target market
              </li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .product-form-container {
      padding: var(--spacing-lg);
      max-width: 800px;
      margin: 0 auto;
      min-height: calc(100vh - 64px);
    }

    .form-header {
      margin-bottom: var(--spacing-xl);
      padding: var(--spacing-xl);
      background: linear-gradient(135deg, var(--surface-color), rgba(25, 118, 210, 0.02));
      border-radius: var(--radius-large);
      box-shadow: var(--shadow-light);
      border: 1px solid var(--divider-color);
    }

    .header-content {
      text-align: center;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--spacing-md);
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .breadcrumb-btn {
      color: var(--primary-color);
      font-weight: 500;
      min-width: auto;
      padding: 0 var(--spacing-sm);
    }

    .breadcrumb-separator {
      margin: 0 var(--spacing-xs);
      font-size: 1rem;
      color: var(--text-secondary);
    }

    .current-page {
      color: var(--text-primary);
      font-weight: 500;
    }

    .form-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-md);
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: var(--spacing-sm);
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .form-subtitle {
      font-size: 1rem;
      color: var(--text-secondary);
      margin: 0;
      font-weight: 400;
    }

    .form-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .form-card {
      border: 1px solid var(--divider-color);
      border-radius: var(--radius-large);
      box-shadow: var(--shadow-medium);
    }

    .product-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-sm);
    }

    .section-icon {
      color: var(--primary-color);
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }

    .form-row {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .form-row.two-columns {
      flex-direction: row;
      gap: var(--spacing-lg);
    }

    .form-row.two-columns .form-field {
      flex: 1;
    }

    .form-field {
      width: 100%;
    }

    .category-option {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .category-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      color: var(--primary-color);
    }

    .category-count {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-left: auto;
    }

    .currency-option {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .currency-code {
      font-weight: 600;
      color: var(--text-primary);
    }

    .currency-name {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .price-preview {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.02));
      border-radius: var(--radius-medium);
      border: 1px solid rgba(25, 118, 210, 0.2);
      margin-top: var(--spacing-md);
    }

    .preview-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .preview-value {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--success-color);
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--divider-color);
      margin-top: var(--spacing-lg);
    }

    .actions-left,
    .actions-right {
      display: flex;
      gap: var(--spacing-md);
    }

    .cancel-btn {
      color: var(--text-secondary);
      min-width: 100px;
    }

    .reset-btn {
      color: var(--warning-color);
      min-width: 100px;
    }

    .submit-btn {
      min-width: 160px;
      height: 48px;
      border-radius: var(--radius-medium);
      font-weight: 600;
      box-shadow: var(--shadow-medium);
      transition: all var(--transition-normal);
    }

    .submit-btn:not(:disabled):hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-heavy);
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .tips-card {
      border: 1px solid var(--divider-color);
      border-radius: var(--radius-large);
      box-shadow: var(--shadow-light);
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.02), rgba(76, 175, 80, 0.01));
      border-left: 4px solid var(--success-color);
    }

    .tips-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .tips-icon {
      color: var(--warning-color);
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .tips-header h4 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }

    .tips-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .tips-list li {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .tip-icon {
      color: var(--success-color);
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* Animations */
    .fade-in {
      animation: fadeIn 0.6s ease forwards;
    }

    .slide-in {
      animation: slideIn 0.5s ease forwards;
    }

    @keyframes slideIn {
      from { 
        opacity: 0; 
        transform: translateY(20px);
      }
      to { 
        opacity: 1; 
        transform: translateY(0);
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .product-form-container {
        padding: var(--spacing-md);
      }

      .form-header {
        padding: var(--spacing-lg);
      }

      .form-title {
        font-size: 1.5rem;
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .title-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }

      .form-row.two-columns {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .form-actions {
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .actions-left,
      .actions-right {
        width: 100%;
        justify-content: center;
      }

      .actions-right {
        order: -1;
      }
    }

    @media (max-width: 480px) {
      .breadcrumb {
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .breadcrumb-separator {
        display: none;
      }

      .submit-btn {
        min-width: 140px;
        height: 44px;
      }

      .tips-list li {
        font-size: 0.8125rem;
      }
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
          this.snackBar.open('Error loading product', 'Close', { 
            duration: 3000,
            panelClass: ['error-snackbar']
          });
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
          this.snackBar.open('Error loading categories', 'Close', { 
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
    }
  }

  getCurrencySymbol(): string {
    const currency = this.productForm.get('currency')?.value || 'USD';
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'EGP': 'E£'
    };
    return symbols[currency] || '$';
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.submitting = true;
      const formValue = { ...this.productForm.value };

      // For updates, ensure categoryId is included
      if (!formValue.currency) {
        delete formValue.currency;
      }

      const request$ = this.isEditMode && this.productId
        ? this.productService.updateProduct(this.productId, formValue)
        : this.productService.createProduct(formValue);

      request$.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Product updated successfully' : 'Product created successfully';
          this.snackBar.open(message, 'Close', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.snackBar.open('Error saving product', 'Close', { 
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.submitting = false;
        }
      });
    }
  }

  resetForm(): void {
    if (this.isEditMode) {
      this.loadData(); // Reload original data
    } else {
      this.productForm.reset();
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}