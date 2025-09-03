import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatRippleModule,
    MatDividerModule,
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="category-list-container">
      <!-- Header Section -->
      <div class="page-header fade-in">
        <div class="header-content">
          <div class="title-section">
            <h1 class="page-title">
              <mat-icon class="title-icon">category</mat-icon>
              Category Management
            </h1>
            <p class="page-subtitle">
              Organize and manage your product categories
            </p>
          </div>
          <div class="header-actions">
            <button
              mat-raised-button
              color="primary"
              (click)="createCategory()"
              class="create-btn"
            >
              <mat-icon>add</mat-icon>
              Add New Category
            </button>
          </div>
        </div>
      </div>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading" class="categories-content">
        <!-- Search Section -->
        <div class="search-section slide-in">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search categories...</mat-label>
            <input
              matInput
              (keyup)="applyFilter($event)"
              placeholder="Search by name"
              #searchInput
            />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <div class="table-actions">
            <button
              mat-icon-button
              matTooltip="Refresh"
              (click)="loadCategories()"
              class="action-btn"
            >
              <mat-icon>refresh</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Export" class="action-btn">
              <mat-icon>download</mat-icon>
            </button>
          </div>
        </div>

        <!-- Categories Table -->
        <div class="table-container slide-in">
          <div class="table-wrapper">
            <table
              mat-table
              [dataSource]="dataSource"
              matSort
              class="categories-table"
            >
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  <span class="header-content">
                    <mat-icon>label</mat-icon>
                    Category Name
                  </span>
                </th>
                <td mat-cell *matCellDef="let category" class="name-cell">
                  <div class="category-name">
                    <div class="category-avatar">
                      <mat-icon>category</mat-icon>
                    </div>
                    <div class="category-info">
                      <span class="category-title">{{ category.name }}</span>
                      <span class="category-id"
                        >ID: {{ category.id.substring(0, 8) }}...</span
                      >
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  <span class="header-content">
                    <mat-icon>schedule</mat-icon>
                    Created Date
                  </span>
                </th>
                <td mat-cell *matCellDef="let category">
                  <div class="date-display">
                    <span class="date-value">{{
                      category.createdAt | date : 'MMM dd, yyyy'
                    }}</span>
                    <span class="time-value">{{
                      category.createdAt | date : 'HH:mm'
                    }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>
                  <span class="header-content">
                    <mat-icon>info</mat-icon>
                    Status
                  </span>
                </th>
                <td mat-cell *matCellDef="let category">
                  <mat-chip class="status-chip active">
                    <mat-icon>check_circle</mat-icon>
                    Active
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>
                  <span class="header-content">
                    <mat-icon>settings</mat-icon>
                    Actions
                  </span>
                </th>
                <td mat-cell *matCellDef="let category">
                  <div class="actions-container">
                    <button
                      mat-icon-button
                      color="primary"
                      (click)="editCategory(category)"
                      matTooltip="Edit Category"
                      class="action-button edit-btn"
                    >
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button
                      mat-icon-button
                      [matMenuTriggerFor]="actionMenu"
                      matTooltip="More Actions"
                      class="action-button more-btn"
                      (click)="$event.stopPropagation()"
                    >
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #actionMenu="matMenu" class="action-menu">
                      <button mat-menu-item (click)="viewCategory(category)">
                        <mat-icon>visibility</mat-icon>
                        <span>View Details</span>
                      </button>
                      <button
                        mat-menu-item
                        (click)="duplicateCategory(category)"
                      >
                        <mat-icon>content_copy</mat-icon>
                        <span>Duplicate</span>
                      </button>
                      <mat-divider></mat-divider>
                      <button
                        mat-menu-item
                        (click)="deleteCategory(category)"
                        class="delete-action"
                      >
                        <mat-icon color="warn">delete</mat-icon>
                        <span>Delete</span>
                      </button>
                    </mat-menu>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr
                mat-row
                *matRowDef="let row; columns: displayedColumns"
                class="category-row"
                matRipple
                (click)="viewCategory(row)"
              ></tr>
            </table>
          </div>

          <!-- Empty State -->
          <div *ngIf="dataSource.filteredData.length === 0" class="empty-state">
            <mat-icon class="empty-icon">category</mat-icon>
            <h3>No Categories Found</h3>
            <p>
              {{
                searchInput.value
                  ? 'No categories match your search criteria.'
                  : 'Start by adding your first category.'
              }}
            </p>
            <button
              mat-raised-button
              color="primary"
              (click)="createCategory()"
              class="empty-action-btn"
            >
              <mat-icon>add</mat-icon>
              Add Your First Category
            </button>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-container">
          <div class="summary-info">
            <span class="result-count">
              Showing {{ getDisplayCount() }} of
              {{ getTotalCount() }} categories
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .category-list-container {
        padding: var(--spacing-lg);
        max-width: 1400px;
        margin: 0 auto;
        min-height: calc(100vh - 64px);
      }

      .page-header {
        margin-bottom: var(--spacing-xl);
        padding: var(--spacing-xl);
        background: linear-gradient(
          135deg,
          var(--surface-color),
          rgba(76, 175, 80, 0.02)
        );
        border-radius: var(--radius-large);
        box-shadow: var(--shadow-light);
        border: 1px solid var(--divider-color);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--spacing-lg);
      }

      .title-section {
        flex: 1;
      }

      .page-title {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        font-size: 2.25rem;
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
        background: linear-gradient(135deg, #4caf50, #8bc34a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .title-icon {
        font-size: 2.25rem;
        width: 2.25rem;
        height: 2.25rem;
        background: linear-gradient(135deg, #4caf50, #8bc34a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .page-subtitle {
        font-size: 1.125rem;
        color: var(--text-secondary);
        margin: 0;
        font-weight: 400;
      }

      .create-btn {
        min-width: 180px;
        height: 48px;
        border-radius: var(--radius-medium);
        font-weight: 600;
        box-shadow: var(--shadow-medium);
        transition: all var(--transition-normal);
      }

      .create-btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-heavy);
      }

      .categories-content {
        animation: fadeIn 0.6s ease;
      }

      .search-section {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
        padding: var(--spacing-lg);
        background: var(--surface-color);
        border-radius: var(--radius-large);
        box-shadow: var(--shadow-light);
        border: 1px solid var(--divider-color);
        flex-wrap: wrap;
      }

      .search-field {
        flex: 1;
        min-width: 300px;
      }

      .table-actions {
        display: flex;
        gap: var(--spacing-sm);
      }

      .action-btn {
        transition: all var(--transition-normal);
        border-radius: 50%;
      }

      .action-btn:hover {
        background-color: rgba(76, 175, 80, 0.1);
        transform: scale(1.1);
      }

      .table-container {
        background: var(--surface-color);
        border-radius: var(--radius-large);
        box-shadow: var(--shadow-medium);
        border: 1px solid var(--divider-color);
        overflow: hidden;
        margin-bottom: var(--spacing-lg);
      }

      .table-wrapper {
        overflow-x: auto;
      }

      .categories-table {
        width: 100%;
        background: transparent;
      }

      .mat-mdc-header-row {
        background: linear-gradient(135deg, #4caf50, #8bc34a);
        height: 64px;
      }

      .mat-mdc-header-cell {
        color: white !important;
        font-weight: 600 !important;
        font-size: 0.875rem;
        border-bottom: none !important;
        padding: 0 var(--spacing-lg) !important;
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .header-content mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }

      .category-row {
        cursor: pointer;
        transition: all var(--transition-fast);
        height: 72px;
      }

      .category-row:hover {
        background-color: rgba(76, 175, 80, 0.04);
      }

      .category-row:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.02);
      }

      .category-row:nth-child(even):hover {
        background-color: rgba(76, 175, 80, 0.06);
      }

      .mat-mdc-cell {
        padding: var(--spacing-md) var(--spacing-lg) !important;
        border-bottom: 1px solid var(--divider-color) !important;
        font-size: 0.875rem;
      }

      .name-cell {
        min-width: 250px;
      }

      .category-name {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }

      .category-avatar {
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

      .category-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .category-title {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.9375rem;
      }

      .category-id {
        font-size: 0.75rem;
        color: var(--text-secondary);
        font-family: 'Courier New', monospace;
      }

      .date-display {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .date-value {
        font-weight: 500;
        color: var(--text-primary);
        font-size: 0.875rem;
      }

      .time-value {
        font-size: 0.75rem;
        color: var(--text-secondary);
      }

      .status-chip {
        background: linear-gradient(135deg, #4caf50, #8bc34a);
        color: white;
        font-weight: 500;
        font-size: 0.75rem;
        height: 28px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .status-chip mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }

      .actions-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
      }

      .action-button {
        transition: all var(--transition-normal);
        border-radius: 50%;
      }

      .edit-btn:hover {
        background-color: rgba(25, 118, 210, 0.1);
        transform: scale(1.1);
      }

      .more-btn:hover {
        background-color: rgba(0, 0, 0, 0.08);
        transform: scale(1.1);
      }

      .action-menu .delete-action {
        color: var(--warn-color);
      }

      .empty-state {
        text-align: center;
        padding: var(--spacing-xxl) var(--spacing-lg);
        color: var(--text-secondary);
      }

      .empty-icon {
        font-size: 4rem;
        width: 4rem;
        height: 4rem;
        color: var(--text-secondary);
        margin-bottom: var(--spacing-lg);
      }

      .empty-state h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
        color: var(--text-primary);
      }

      .empty-state p {
        font-size: 1rem;
        margin-bottom: var(--spacing-xl);
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
      }

      .empty-action-btn {
        min-width: 200px;
        height: 48px;
        border-radius: var(--radius-medium);
        font-weight: 600;
      }

      .summary-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--spacing-lg);
        background: var(--surface-color);
        border-radius: var(--radius-large);
        box-shadow: var(--shadow-light);
        border: 1px solid var(--divider-color);
      }

      .summary-info {
        display: flex;
        align-items: center;
      }

      .result-count {
        font-size: 0.875rem;
        color: var(--text-secondary);
        font-weight: 500;
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
      @media (max-width: 1024px) {
        .category-list-container {
          padding: var(--spacing-md);
        }

        .header-content {
          flex-direction: column;
          text-align: center;
          gap: var(--spacing-lg);
        }

        .search-section {
          flex-direction: column;
          align-items: stretch;
        }

        .search-field {
          min-width: unset;
        }

        .table-actions {
          justify-content: center;
        }
      }

      @media (max-width: 768px) {
        .page-title {
          font-size: 1.75rem;
        }

        .title-icon {
          font-size: 1.75rem;
          width: 1.75rem;
          height: 1.75rem;
        }

        .categories-table {
          font-size: 0.75rem;
        }

        .mat-mdc-header-row {
          height: 56px;
        }

        .category-row {
          height: 64px;
        }
      }

      @media (max-width: 480px) {
        .page-header {
          padding: var(--spacing-lg);
        }

        .search-section {
          padding: var(--spacing-md);
        }

        .mat-mdc-cell {
          padding: var(--spacing-sm) !important;
        }

        .name-cell {
          min-width: 180px;
        }

        .create-btn {
          min-width: 140px;
          height: 44px;
        }

        .category-avatar {
          width: 32px;
          height: 32px;
        }
      }
    `,
  ],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  dataSource = new MatTableDataSource<Category>([]);
  displayedColumns: string[] = ['name', 'createdAt', 'status', 'actions'];
  loading = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data || [];
        this.dataSource.data = this.categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Error loading categories', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        this.loading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTotalCount(): number {
    return this.categories.length;
  }

  getDisplayCount(): number {
    return this.dataSource.filteredData.length;
  }

  createCategory(): void {
    this.router.navigate(['/categories/new']);
  }

  editCategory(category: Category): void {
    this.router.navigate(['/categories/edit', category.id]);
  }

  viewCategory(category: Category): void {
    this.router.navigate(['/categories/edit', category.id]);
  }

  duplicateCategory(category: Category): void {
    this.router.navigate(['/categories/new'], {
      queryParams: { duplicate: category.id },
    });
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Category',
        message: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
      panelClass: 'confirmation-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.snackBar.open('Category deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            this.loadCategories();
          },
          error: (error) => {
            console.error('Can not delete this Category, there is linked products to this category:', error);
            this.snackBar.open('Can not delete this Category, there is linked products to this category', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar'],
            });
          },
        });
      }
    });
  }
}
