import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatDividerModule,
    MatTooltipModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="category-form-container">
      <!-- Header Section -->
      <div class="form-header fade-in">
        <div class="header-content">
          <div class="breadcrumb">
            <button mat-button (click)="goBack()" class="breadcrumb-btn">
              <mat-icon>arrow_back</mat-icon>
              Categories
            </button>
            <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
            <span class="current-page">{{ isEditMode ? 'Edit Category' : 'New Category' }}</span>
          </div>
          <h1 class="form-title">
            <mat-icon class="title-icon">{{ isEditMode ? 'edit' : 'add_circle' }}</mat-icon>
            {{ isEditMode ? 'Edit Category' : 'Create New Category' }}
          </h1>
          <p class="form-subtitle">
            {{ isEditMode ? 'Update category information' : 'Add a new category to organize your products' }}
          </p>
        </div>
      </div>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading" class="form-content slide-in">
        <mat-card class="form-card">
          <mat-card-content>
            <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="category-form">
              <div class="form-section">
                <div class="section-header">
                  <mat-icon class="section-icon">info</mat-icon>
                  <h3 class="section-title">Category Information</h3>
                </div>
                <mat-divider></mat-divider>
                
                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Category Name</mat-label>
                    <input 
                      matInput 
                      formControlName="name" 
                      placeholder="Enter category name"
                      maxlength="100">
                    <mat-icon matSuffix matTooltip="Category name is required">info</mat-icon>
                    <mat-hint align="end">{{ categoryForm.get('name')?.value?.length || 0 }}/100</mat-hint>
                    <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
                      Category name is required
                    </mat-error>
                    <mat-error *ngIf="categoryForm.get('name')?.hasError('maxlength')">
                      Category name cannot exceed 100 characters
                    </mat-error>
                  </mat-form-field>
                </div>

                <!-- Preview Section -->
                <div class="preview-section" *ngIf="categoryForm.get('name')?.value">
                  <div class="preview-header">
                    <mat-icon class="preview-icon">visibility</mat-icon>
                    <h4>Preview</h4>
                  </div>
                  <div class="category-preview">
                    <div class="preview-avatar">
                      <mat-icon>category</mat-icon>
                    </div>
                    <div class="preview-info">
                      <span class="preview-name">{{ categoryForm.get('name')?.value }}</span>
                      <span class="preview-status">Active Category</span>
                    </div>
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
                    [disabled]="categoryForm.invalid || submitting"
                    class="submit-btn">
                    <mat-icon *ngIf="!submitting">{{ isEditMode ? 'save' : 'add_circle' }}</mat-icon>
                    <mat-icon *ngIf="submitting" class="spinning">hourglass_empty</mat-icon>
                    {{ submitting ? 'Saving...' : (isEditMode ? 'Update Category' : 'Create Category') }}
                  </button>
                </div>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Tips Card -->
        <mat-card class="tips-card">
          <mat-card-content>
            <div class="tips-header">
              <mat-icon class="tips-icon">lightbulb</mat-icon>
              <h4>Category Tips</h4>
            </div>
            <ul class="tips-list">
              <li>
                <mat-icon class="tip-icon">check_circle</mat-icon>
                Use clear, descriptive names for easy identification
              </li>
              <li>
                <mat-icon class="tip-icon">check_circle</mat-icon>
                Keep category names concise but meaningful
              </li>
              <li>
                <mat-icon class="tip-icon">check_circle</mat-icon>
                Consider how products will be grouped under this category
              </li>
              <li>
                <mat-icon class="tip-icon">check_circle</mat-icon>
                Avoid special characters and excessive spaces
              </li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .category-form-container {
      padding: var(--spacing-lg);
      max-width: 600px;
      margin: 0 auto;
      min-height: calc(100vh - 64px);
    }

    .form-header {
      margin-bottom: var(--spacing-xl);
      padding: var(--spacing-xl);
      background: linear-gradient(135deg, var(--surface-color), rgba(76, 175, 80, 0.02));
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
      color: #4caf50;
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
      background: linear-gradient(135deg, #4caf50, #8bc34a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      background: linear-gradient(135deg, #4caf50, #8bc34a);
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

    .category-form {
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
      color: #4caf50;
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

    .form-field {
      width: 100%;
    }

    .preview-section {
      margin-top: var(--spacing-lg);
      padding: var(--spacing-lg);
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.05), rgba(76, 175, 80, 0.02));
      border-radius: var(--radius-medium);
      border: 1px solid rgba(76, 175, 80, 0.2);
    }

    .preview-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }

    .preview-icon {
      color: #4caf50;
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .preview-header h4 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }

    .category-preview {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: var(--surface-color);
      border-radius: var(--radius-medium);
      border: 1px solid var(--divider-color);
    }

    .preview-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4caf50, #8bc34a);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .preview-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .preview-name {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.9375rem;
    }

    .preview-status {
      font-size: 0.75rem;
      color: #4caf50;
      font-weight: 500;
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
      border-left: 4px solid #4caf50;
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
      color: #4caf50;
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

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
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
      .category-form-container {
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
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.categoryId;

    if (this.isEditMode && this.categoryId) {
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: string): void {
    this.loading = true;
    this.categoryService.getCategoryById(id).subscribe({
      next: (response) => {
        const category = response.data;
        this.categoryForm.patchValue({
          name: category.name
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.snackBar.open('Error loading category', 'Close', { 
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/categories']);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.submitting = true;
      const formValue = { ...this.categoryForm.value };

      const request$ = this.isEditMode && this.categoryId
        ? this.categoryService.updateCategory(this.categoryId, formValue)
        : this.categoryService.createCategory(formValue);

      request$.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Category updated successfully' : 'Category created successfully';
          this.snackBar.open(message, 'Close', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error saving category:', error);
          this.snackBar.open('Error saving category', 'Close', { 
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
      this.loadCategory(this.categoryId!); // Reload original data
    } else {
      this.categoryForm.reset();
    }
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }
}