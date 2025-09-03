import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { LoadingSpinnerComponent } from '../components/shared/loading-spinner.component';
import { forkJoin } from 'rxjs';

interface DashboardStats {
  totalCategories: number;
  totalProducts: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header Section -->
      <div class="dashboard-header fade-in">
        <div class="welcome-section">
          <h1 class="dashboard-title">
            <mat-icon class="title-icon">dashboard</mat-icon>
            Product Management Dashboard
          </h1>
          <p class="dashboard-subtitle">Monitor and manage your inventory efficiently</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="createProduct()" class="action-btn">
            <mat-icon>add</mat-icon>
            Add Product
          </button>
          <button mat-raised-button color="accent" (click)="createCategory()" class="action-btn">
            <mat-icon>category</mat-icon>
            Add Category
          </button>
        </div>
      </div>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading" class="dashboard-content">
        <!-- Stats Cards -->
        <div class="stats-grid">
          <mat-card class="stat-card categories-card slide-in" (click)="navigateToCategories()">
            <mat-card-content>
              <div class="stat-header">
                <div class="stat-icon categories-icon">
                  <mat-icon>category</mat-icon>
                </div>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalCategories }}</div>
                <div class="stat-label">Total Categories</div>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" class="card-action">
                View Categories
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="stat-card products-card slide-in" (click)="navigateToProducts()">
            <mat-card-content>
              <div class="stat-header">
                <div class="stat-icon products-icon">
                  <mat-icon>inventory</mat-icon>
                </div>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ stats.totalProducts }}</div>
                <div class="stat-label">Total Products</div>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" class="card-action">
                View Products
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- Quick Actions Section -->
        <div class="quick-actions-section fade-in">
          <h2 class="section-title">
            <mat-icon>flash_on</mat-icon>
            Quick Actions
          </h2>
          <div class="quick-actions-grid">
            <mat-card class="quick-action-card" (click)="createCategory()">
              <mat-card-content>
                <mat-icon class="action-icon category-action">add_circle</mat-icon>
                <h3>New Category</h3>
                <p>Create a new product category</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="quick-action-card" (click)="createProduct()">
              <mat-card-content>
                <mat-icon class="action-icon product-action">add_box</mat-icon>
                <h3>New Product</h3>
                <p>Add a new product to inventory</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="quick-action-card" (click)="navigateToCategories()">
              <mat-card-content>
                <mat-icon class="action-icon manage-action">manage_accounts</mat-icon>
                <h3>Manage Categories</h3>
                <p>Edit and organize categories</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="quick-action-card" (click)="navigateToProducts()">
              <mat-card-content>
                <mat-icon class="action-icon inventory-action">inventory_2</mat-icon>
                <h3>Manage Products</h3>
                <p>View and edit product details</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: var(--spacing-lg);
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 64px);
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-xl);
      padding: var(--spacing-xl);
      background: linear-gradient(135deg, var(--surface-color), rgba(25, 118, 210, 0.02));
      border-radius: var(--radius-large);
      box-shadow: var(--shadow-light);
      border: 1px solid var(--divider-color);
    }

    .welcome-section {
      flex: 1;
    }

    .dashboard-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      font-size: 2.5rem;
      font-weight: 600;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: var(--spacing-sm);
    }

    .title-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .dashboard-subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      margin: 0;
      font-weight: 400;
    }

    .header-actions {
      display: flex;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .action-btn {
      min-width: 140px;
      height: 48px;
      border-radius: var(--radius-medium);
      font-weight: 600;
      box-shadow: var(--shadow-medium);
      transition: all var(--transition-normal);
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-heavy);
    }

    .dashboard-content {
      animation: fadeIn 0.8s ease;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
    }

    .stat-card {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: all var(--transition-normal);
      border: 1px solid var(--divider-color);
      border-radius: var(--radius-large);
    }

    .stat-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: var(--shadow-heavy);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      border-radius: var(--radius-large) var(--radius-large) 0 0;
    }

    .categories-card::before {
      background: linear-gradient(135deg, #4caf50, #8bc34a);
    }

    .products-card::before {
      background: linear-gradient(135deg, #2196f3, #03a9f4);
    }

    .stat-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .categories-icon {
      background: linear-gradient(135deg, #4caf50, #8bc34a);
    }

    .products-icon {
      background: linear-gradient(135deg, #2196f3, #03a9f4);
    }

    .stat-content {
      text-align: left;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      line-height: 1;
      margin-bottom: var(--spacing-sm);
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .stat-label {
      font-size: 1rem;
      color: var(--text-secondary);
      font-weight: 500;
      margin-bottom: var(--spacing-md);
    }

    .card-action {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-weight: 600;
      transition: all var(--transition-normal);
    }

    .card-action:hover {
      transform: translateX(4px);
    }

    .quick-actions-section {
      margin-top: var(--spacing-xl);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      font-size: 1.75rem;
      font-weight: 600;
      margin-bottom: var(--spacing-lg);
      color: var(--text-primary);
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-lg);
    }

    .quick-action-card {
      cursor: pointer;
      transition: all var(--transition-normal);
      text-align: center;
      border: 1px solid var(--divider-color);
      border-radius: var(--radius-large);
      position: relative;
      overflow: hidden;
    }

    .quick-action-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-heavy);
    }

    .quick-action-card::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      transform: scaleX(0);
      transition: transform var(--transition-normal);
    }

    .quick-action-card:hover::after {
      transform: scaleX(1);
    }

    .action-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      margin-bottom: var(--spacing-md);
    }

    .category-action {
      color: #4caf50;
    }

    .product-action {
      color: #2196f3;
    }

    .manage-action {
      color: #ff9800;
    }

    .inventory-action {
      color: #9c27b0;
    }

    .quick-action-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: var(--spacing-sm);
      color: var(--text-primary);
    }

    .quick-action-card p {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.4;
    }

    /* Animations */
    .fade-in {
      animation: fadeIn 0.8s ease forwards;
    }

    .slide-in {
      animation: slideIn 0.6s ease forwards;
    }

    .slide-in:nth-child(1) { animation-delay: 0.1s; }
    .slide-in:nth-child(2) { animation-delay: 0.2s; }

    @keyframes slideIn {
      from { 
        opacity: 0; 
        transform: translateY(30px);
      }
      to { 
        opacity: 1; 
        transform: translateY(0);
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: var(--spacing-md);
      }

      .dashboard-header {
        flex-direction: column;
        gap: var(--spacing-lg);
        text-align: center;
        padding: var(--spacing-lg);
      }

      .dashboard-title {
        font-size: 2rem;
        justify-content: center;
      }

      .title-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }

      .header-actions {
        justify-content: center;
        width: 100%;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
      }

      .quick-actions-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
      }

      .stat-number {
        font-size: 2.5rem;
      }
    }

    @media (max-width: 480px) {
      .dashboard-title {
        font-size: 1.75rem;
      }

      .action-btn {
        min-width: 120px;
        height: 44px;
      }

      .quick-actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalCategories: 0,
    totalProducts: 0
  };
  loading = false;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    
    forkJoin({
      categories: this.categoryService.getAllCategories(),
      products: this.productService.getAllProducts(1, 1)
    }).subscribe({
      next: (response) => {
        this.stats.totalCategories = response.categories.data?.length || 0;
        this.stats.totalProducts = response.products.data?.totalCount || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
      }
    });
  }

  navigateToCategories(): void {
    this.router.navigate(['/categories']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  createCategory(): void {
    this.router.navigate(['/categories/new']);
  }

  createProduct(): void {
    this.router.navigate(['/products/new']);
  }
}