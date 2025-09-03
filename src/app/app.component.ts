import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav 
        #drawer 
        class="sidenav" 
        [fixedInViewport]="isHandset"
        [mode]="sidenavMode"
        [opened]="!isHandset">
        
        <div class="sidenav-header">
          <div class="logo-container">
            <mat-icon class="app-logo">inventory_2</mat-icon>
            <span class="app-title">PMS</span>
          </div>
          <button 
            mat-icon-button 
            class="close-button" 
            *ngIf="isHandset" 
            (click)="drawer.close()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <mat-nav-list class="nav-list">
          <a 
            mat-list-item 
            routerLink="/dashboard" 
            routerLinkActive="active"
            class="nav-item"
            (click)="onNavClick()">
            <div class="nav-item-content">
              <mat-icon class="nav-icon">dashboard</mat-icon>
              <span class="nav-text">Dashboard</span>
            </div>
          </a>
          
          <a 
            mat-list-item 
            routerLink="/categories"
            routerLinkActive="active"
            class="nav-item"
            (click)="onNavClick()">
            <div class="nav-item-content">
              <mat-icon class="nav-icon">category</mat-icon>
              <span class="nav-text">Categories</span>
            </div>
          </a>
          
          <a 
            mat-list-item 
            routerLink="/products"
            routerLinkActive="active"
            class="nav-item"
            (click)="onNavClick()">
            <div class="nav-item-content">
              <mat-icon class="nav-icon">inventory</mat-icon>
              <span class="nav-text">Products</span>
            </div>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="main-content-wrapper">
        <mat-toolbar class="main-toolbar" color="primary">
          <button 
            mat-icon-button 
            (click)="drawer.toggle()"
            class="menu-button">
            <mat-icon>menu</mat-icon>
          </button>
          
          <span class="toolbar-title">Product Management System</span>
          
          <div class="toolbar-spacer"></div>
        </mat-toolbar>

        <main class="main-content">
          <div class="content-container">
            <router-outlet></router-outlet>
          </div>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      background-color: var(--background-primary);
    }

    .sidenav {
      width: 280px;
      background: var(--surface-color);
      border-right: 1px solid var(--divider-color);
      box-shadow: 2px 0 8px rgba(0,0,0,0.1);
    }

    .sidenav-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color);
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      color: white;
      min-height: 64px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .app-logo {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .app-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
    }

    .close-button {
      color: white;
    }

    .nav-list {
      padding: 16px 0;
    }

    .nav-item {
      margin: 4px 16px;
      border-radius: 12px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      text-decoration: none;
      color: var(--text-primary);
    }

    .nav-item:hover {
      background-color: rgba(25, 118, 210, 0.08);
      transform: translateX(4px);
    }

    .nav-item.active {
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
      color: white;
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    }

    .nav-item.active .nav-icon,
    .nav-item.active .nav-text {
      color: white;
    }

    .nav-item-content {
      display: flex;
      align-items: center;
      width: 100%;
      position: relative;
    }

    .nav-icon {
      margin-right: 16px;
      transition: color 0.3s ease;
    }

    .nav-text {
      flex: 1;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .main-content-wrapper {
      background-color: var(--background-primary);
    }

    .main-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-light)) !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .menu-button {
      margin-right: 16px;
      color: white;
    }

    .toolbar-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .main-content {
      min-height: calc(100vh - 64px);
    }

    .content-container {
      padding: 0;
      animation: fadeIn 0.6s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .sidenav {
        width: 100%;
      }
      
      .toolbar-title {
        font-size: 1.125rem;
      }
    }

    @media (max-width: 480px) {
      .toolbar-title {
        display: none;
      }
      
      .content-container {
        padding: 0;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'product-management-app';
  isHandset = false;
  sidenavMode: 'over' | 'push' | 'side' = 'side';

  @ViewChild('drawer', { static: true }) drawer!: MatSidenav;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    // Monitor screen size for responsive behavior
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isHandset = result.matches;
        this.sidenavMode = this.isHandset ? 'over' : 'side';
      });
  }

  onNavClick() {
    // Close sidenav on mobile after navigation
    if (this.isHandset && this.drawer) {
      this.drawer.close();
    }
  }
}