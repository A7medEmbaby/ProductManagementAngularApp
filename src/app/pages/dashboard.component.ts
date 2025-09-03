import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { LoadingSpinnerComponent } from '../components/shared/loading-spinner.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="container">
      <h1>Product Management Dashboard</h1>
      
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div *ngIf="!loading" class="dashboard-grid">
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>category</mat-icon>
              Categories
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ categoryCount }}</div>
            <p>Total Categories</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="navigateToCategories()">
              View Categories
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>inventory</mat-icon>
              Products
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ productCount }}</div>
            <p>Total Products</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="navigateToProducts()">
              View Products
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>add_circle</mat-icon>
              Quick Actions
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Create new items quickly</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="accent" (click)="createCategory()">
              New Category
            </button>
            <button mat-button color="accent" (click)="createProduct()">
              New Product
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .dashboard-card {
      min-height: 200px;
    }
    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #1976d2;
      margin: 10px 0;
    }
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    mat-card-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  categoryCount = 0;
  productCount = 0;
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
      products: this.productService.getAllProducts(1, 1) // Just get first page to get total count
    }).subscribe({
      next: (response) => {
        this.categoryCount = response.categories.data?.length || 0;
        this.productCount = response.products.data?.totalCount || 0;
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