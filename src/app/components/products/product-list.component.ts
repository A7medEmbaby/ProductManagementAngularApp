import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginatorModule,
  PageEvent,
  MatPaginator,
} from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { PagedResult } from '../../models/paged-result.model';
import { LoadingSpinnerComponent } from '../shared/loading-spinner.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';
import { forkJoin } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatRippleModule,
    MatDividerModule, // Add this line
    LoadingSpinnerComponent,
  ],
  template: `
    <div class="product-list-container">
      <!-- Header Section -->
      <div class="page-header fade-in">
        <div class="header-content">
          <div class="title-section">
            <h1 class="page-title">
              <mat-icon class="title-icon">inventory</mat-icon>
              Product Management
            </h1>
            <p class="page-subtitle">
              Manage your product inventory efficiently
            </p>
          </div>
          <div class="header-actions">
            <button
              mat-raised-button
              color="primary"
              (click)="createProduct()"
              class="create-btn"
            >
              <mat-icon>add</mat-icon>
              Add New Product
            </button>
          </div>
        </div>
      </div>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading" class="products-content">
        <!-- Filters Section -->
        <div class="filters-section slide-in">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search products...</mat-label>
            <input
              matInput
              (keyup)="applyFilter($event)"
              placeholder="Search by name or category"
              #searchInput
            />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Filter by Category</mat-label>
            <mat-select (selectionChange)="filterByCategory($event.value)">
              <mat-option value="">All Categories</mat-option>
              <mat-option
                *ngFor="let category of categories"
                [value]="category.id"
              >
                {{ category.name }}
              </mat-option>
            </mat-select>
            <mat-icon matSuffix>filter_list</mat-icon>
          </mat-form-field>

          <div class="table-actions">
            <button
              mat-icon-button
              matTooltip="Refresh"
              (click)="loadData()"
              class="action-btn"
            >
              <mat-icon>refresh</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Export" class="action-btn">
              <mat-icon>download</mat-icon>
            </button>
          </div>
        </div>

        <!-- Products Table -->
        <div class="table-container slide-in">
          <div class="table-wrapper">
            <table
              mat-table
              [dataSource]="dataSource"
              matSort
              class="products-table"
            >
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  <span class="header-content">
                    <mat-icon>inventory_2</mat-icon>
                    Product Name
                  </span>
                </th>
                <td mat-cell *matCellDef="let product" class="name-cell">
                  <div class="product-name">
                    <span class="product-title">{{ product.name }}</span>
                    <span class="product-id"
                      >ID: {{ product.id.substring(0, 8) }}...</span
                    >
                  </div>
                </td>
              </ng-container>

              <!-- Category Column -->
              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>
                  <span class="header-content">
                    <mat-icon>category</mat-icon>
                    Category
                  </span>
                </th>
                <td mat-cell *matCellDef="let product">
                  <mat-chip class="category-chip">
                    {{ getCategoryName(product.categoryId) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Price Column -->
              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  <span class="header-content">
                    <mat-icon>attach_money</mat-icon>
                    Price
                  </span>
                </th>
                <td mat-cell *matCellDef="let product">
                  <div class="price-display">
                    <span class="price-value">
                      {{ product.price | currency : product.currency || 'USD' }}
                    </span>
                  </div>
                </td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  <span class="header-content">
                    <mat-icon>schedule</mat-icon>
                    Created
                  </span>
                </th>
                <td mat-cell *matCellDef="let product">
                  <div class="date-display">
                    <span class="date-value">{{
                      product.createdAt | date : 'MMM dd, yyyy'
                    }}</span>
                    <span class="time-value">{{
                      product.createdAt | date : 'HH:mm'
                    }}</span>
                  </div>
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
                <td mat-cell *matCellDef="let product">
                  <div class="actions-container">
                    <button
                      mat-icon-button
                      color="primary"
                      (click)="editProduct(product)"
                      matTooltip="Edit Product"
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
                      <button mat-menu-item (click)="viewProduct(product)">
                        <mat-icon>visibility</mat-icon>
                        <span>View Details</span>
                      </button>
                      <button mat-menu-item (click)="duplicateProduct(product)">
                        <mat-icon>content_copy</mat-icon>
                        <span>Duplicate</span>
                      </button>
                      <mat-divider></mat-divider>
                      <button
                        mat-menu-item
                        (click)="deleteProduct(product)"
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
                class="product-row"
                matRipple
                (click)="viewProduct(row)"
              ></tr>
            </table>
          </div>

          <!-- Empty State -->
          <div *ngIf="dataSource.filteredData.length === 0" class="empty-state">
            <mat-icon class="empty-icon">inventory_2</mat-icon>
            <h3>No Products Found</h3>
            <p>
              {{
                searchInput.value
                  ? 'No products match your search criteria.'
                  : 'Start by adding your first product.'
              }}
            </p>
            <button
              mat-raised-button
              color="primary"
              (click)="createProduct()"
              class="empty-action-btn"
            >
              <mat-icon>add</mat-icon>
              Add Your First Product
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination-container">
          <mat-paginator
            #paginator
            [length]="pagedResult?.totalCount || 0"
            [pageSize]="pageSize"
            [pageIndex]="pageNumber - 1"
            [pageSizeOptions]="[5, 10, 25, 50, 100]"
            (page)="onPageChange($event)"
            showFirstLastButtons
            class="custom-paginator"
          >
          </mat-paginator>

          <div class="pagination-info">
            <span class="result-count">
              Showing {{ getStartIndex() }}-{{ getEndIndex() }} of
              {{ pagedResult?.totalCount || 0 }} products
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .product-list-container {
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
          rgba(25, 118, 210, 0.02)
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
        background: linear-gradient(
          135deg,
          var(--primary-color),
          var(--primary-light)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .title-icon {
        font-size: 2.25rem;
        width: 2.25rem;
        height: 2.25rem;
        background: linear-gradient(
          135deg,
          var(--primary-color),
          var(--primary-light)
        );
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

      .products-content {
        animation: fadeIn 0.6s ease;
      }

      .filters-section {
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
        flex: 2;
        min-width: 300px;
      }

      .filter-field {
        flex: 1;
        min-width: 200px;
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
        background-color: rgba(25, 118, 210, 0.1);
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

      .products-table {
        width: 100%;
        background: transparent;
      }

      .mat-mdc-header-row {
        background: linear-gradient(
          135deg,
          var(--primary-color),
          var(--primary-light)
        );
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

      .product-row {
        cursor: pointer;
        transition: all var(--transition-fast);
        height: 72px;
      }

      .product-row:hover {
        background-color: rgba(25, 118, 210, 0.04);
      }

      .product-row:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.02);
      }

      .product-row:nth-child(even):hover {
        background-color: rgba(25, 118, 210, 0.06);
      }

      .mat-mdc-cell {
        padding: var(--spacing-md) var(--spacing-lg) !important;
        border-bottom: 1px solid var(--divider-color) !important;
        font-size: 0.875rem;
      }

      .name-cell {
        min-width: 200px;
      }

      .product-name {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .product-title {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.9375rem;
      }

      .product-id {
        font-size: 0.75rem;
        color: var(--text-secondary);
        font-family: 'Courier New', monospace;
      }

      .category-chip {
        background: linear-gradient(
          135deg,
          var(--primary-color),
          var(--primary-light)
        );
        color: white;
        font-weight: 500;
        font-size: 0.75rem;
        height: 28px;
        border-radius: 14px;
      }

      .price-display {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .price-value {
        font-weight: 600;
        font-size: 1rem;
        color: var(--success-color);
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

      .pagination-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-lg);
        background: var(--surface-color);
        border-radius: var(--radius-large);
        box-shadow: var(--shadow-light);
        border: 1px solid var(--divider-color);
        flex-wrap: wrap;
        gap: var(--spacing-md);
      }

      .custom-paginator {
        background: transparent;
      }

      .pagination-info {
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
        .product-list-container {
          padding: var(--spacing-md);
        }

        .header-content {
          flex-direction: column;
          text-align: center;
          gap: var(--spacing-lg);
        }

        .filters-section {
          flex-direction: column;
          align-items: stretch;
        }

        .search-field,
        .filter-field {
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

        .products-table {
          font-size: 0.75rem;
        }

        .mat-mdc-header-row {
          height: 56px;
        }

        .product-row {
          height: 64px;
        }

        .pagination-container {
          flex-direction: column;
          text-align: center;
        }
      }

      @media (max-width: 480px) {
        .page-header {
          padding: var(--spacing-lg);
        }

        .filters-section {
          padding: var(--spacing-md);
        }

        .mat-mdc-cell {
          padding: var(--spacing-sm) !important;
        }

        .name-cell {
          min-width: 150px;
        }

        .create-btn {
          min-width: 140px;
          height: 44px;
        }
      }
    `,
  ],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  pagedResult: PagedResult<Product> | null = null;
  dataSource = new MatTableDataSource<Product>([]);
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'createdAt',
    'actions',
  ];
  loading = false;
  pageNumber = 1;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(): void {
    this.loading = true;

    forkJoin({
      products: this.productService.getAllProducts(
        this.pageNumber,
        this.pageSize
      ),
      categories: this.categoryService.getAllCategories(),
    }).subscribe({
      next: (response) => {
        this.pagedResult = response.products.data;
        this.products = response.products.data?.items || [];
        this.categories = response.categories.data || [];
        this.dataSource.data = this.products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.snackBar.open('Error loading products', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        this.loading = false;
      },
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByCategory(categoryId: string): void {
    if (categoryId) {
      this.dataSource.filterPredicate = (data: Product) => {
        return data.categoryId === categoryId;
      };
      this.dataSource.filter = categoryId;
    } else {
      this.dataSource.filter = '';
      this.dataSource.filterPredicate = (data: Product, filter: string) => {
        return (
          data.name.toLowerCase().includes(filter) ||
          this.getCategoryName(data.categoryId).toLowerCase().includes(filter)
        );
      };
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  getStartIndex(): number {
    return Math.min(
      (this.pageNumber - 1) * this.pageSize + 1,
      this.pagedResult?.totalCount || 0
    );
  }

  getEndIndex(): number {
    return Math.min(
      this.pageNumber * this.pageSize,
      this.pagedResult?.totalCount || 0
    );
  }

  createProduct(): void {
    this.router.navigate(['/products/new']);
  }

  editProduct(product: Product): void {
    this.router.navigate(['/products/edit', product.id]);
  }

  viewProduct(product: Product): void {
    // For now, navigate to edit - could be expanded to a view-only dialog
    this.router.navigate(['/products/edit', product.id]);
  }

  duplicateProduct(product: Product): void {
    this.router.navigate(['/products/new'], {
      queryParams: { duplicate: product.id },
    });
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete Product',
        message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
      panelClass: 'confirmation-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.snackBar.open('Product deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.snackBar.open('Error deleting product', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar'],
            });
          },
        });
      }
    });
  }
}
