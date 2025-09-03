import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatSnackBarModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="container">
      <h2>{{ isEditMode ? 'Edit Category' : 'Create Category' }}</h2>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <form *ngIf="!loading" [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter category name" />
          <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">
            Category name is required
          </mat-error>
          <mat-error *ngIf="categoryForm.get('name')?.hasError('maxlength')">
            Category name cannot exceed 100 characters
          </mat-error>
        </mat-form-field>

        <div class="form-actions">
          <button mat-button type="button" (click)="goBack()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="categoryForm.invalid || submitting">
            {{ submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 500px;
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
        this.snackBar.open('Error loading category', 'Close', { duration: 3000 });
        this.router.navigate(['/categories']);
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.submitting = true;
      const formValue = this.categoryForm.value;

      const request$ = this.isEditMode && this.categoryId
        ? this.categoryService.updateCategory(this.categoryId, formValue)
        : this.categoryService.createCategory(formValue);

      request$.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Category updated successfully' : 'Category created successfully';
          this.snackBar.open(message, 'Close', { duration: 3000 });
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          console.error('Error saving category:', error);
          this.snackBar.open('Error saving category', 'Close', { duration: 3000 });
          this.submitting = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }
}