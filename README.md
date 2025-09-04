# Product Management System

A modern, responsive Angular application for managing product inventory and categories. Built with Angular 19, Material Design, and a clean, professional interface.

![Angular](https://img.shields.io/badge/Angular-19.2.4-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-blue.svg)
![Angular Material](https://img.shields.io/badge/Angular%20Material-19.2.3-purple.svg)

## 🚀 Features

### Dashboard
- **Overview Statistics**: Real-time counts of categories and products
- **Quick Actions**: Fast access to create new categories and products
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with Material Design
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/404a5f81-e51c-45bb-abbe-a5acd72f4d54" />

### Category Management
- **CRUD Operations**: Create, read, update, and delete categories
- **Search & Filter**: Real-time search functionality
- **Bulk Actions**: Multiple selection and batch operations
- **Validation**: Form validation with user-friendly error messages
- **Preview**: Live preview of category appearance
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/8b2953c0-1081-4801-ab59-a8a9069d39fa" />

### Product Management
- **Complete Product Lifecycle**: Full CRUD operations for products
- **Category Association**: Link products to specific categories
- **Price Management**: Support for multiple currencies (USD, EUR, GBP, EGP)
- **Pagination**: Efficient handling of large product lists
- **Advanced Filtering**: Filter by category and search by name
- **Responsive Tables**: Mobile-optimized data tables
<img width="1919" height="1199" alt="image" src="https://github.com/user-attachments/assets/b5921afd-1106-4d0f-9e21-323fd9f81639" />

### Technical Features
- **Standalone Components**: Modern Angular architecture
- **Reactive Forms**: Advanced form handling with validation
- **Material Design**: Consistent UI/UX with Angular Material
- **TypeScript**: Full type safety and modern JavaScript features
- **Responsive Design**: Mobile-first approach
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error management
- **Confirmation Dialogs**: Safe deletion with user confirmation

## 🛠️ Technology Stack

### Frontend
- **Angular 19.2.4**: Latest Angular framework
- **Angular Material 19.2.3**: Material Design components
- **Angular CDK 19.2.3**: Component Development Kit
- **TypeScript 5.6.0**: Type-safe JavaScript
- **RxJS 7.8.0**: Reactive programming library

### Development Tools
- **Angular CLI 19.2.4**: Development and build tools
- **Karma & Jasmine**: Testing framework
- **Node.js**: JavaScript runtime environment

### UI/UX
- **Material Icons**: Google Material Design icons
- **Responsive Design**: Mobile-first approach
- **CSS Custom Properties**: Modern styling approach
- **Animations**: Smooth transitions and micro-interactions

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 18.7.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Angular CLI**: Version 19.2.4 or higher

```bash
# Check your versions
node --version
npm --version
ng version
```

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/product-management-angular-app.git
cd product-management-angular-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Update the API URL in the environment files:

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7129'  // Your API URL
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api-url.com'  // Your production API URL
};
```

### 4. Start Development Server
```bash
ng serve
```

The application will be available at `http://localhost:4200/`

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── categories/
│   │   │   ├── category-list.component.ts     # Categories listing
│   │   │   └── category-form.component.ts     # Category create/edit
│   │   ├── products/
│   │   │   ├── product-list.component.ts      # Products listing
│   │   │   └── product-form.component.ts      # Product create/edit
│   │   └── shared/
│   │       ├── loading-spinner.component.ts   # Loading indicator
│   │       └── confirmation-dialog.component.ts # Confirmation dialogs
│   ├── models/
│   │   ├── api-response.model.ts              # API response interface
│   │   ├── category.model.ts                  # Category data models
│   │   ├── product.model.ts                   # Product data models
│   │   └── paged-result.model.ts              # Pagination model
│   ├── services/
│   │   ├── api.service.ts                     # Base API service
│   │   ├── category.service.ts                # Category API operations
│   │   └── product.service.ts                 # Product API operations
│   ├── pages/
│   │   └── dashboard.component.ts             # Dashboard page
│   ├── app.component.ts                       # Root component
│   ├── app.config.ts                          # App configuration
│   └── app.routes.ts                          # Routing configuration
├── environments/                              # Environment configurations
├── styles.css                                 # Global styles
└── index.html                                 # Main HTML file
```

## 🔧 API Integration

The application expects a REST API with the following endpoints:

### Categories API
```
GET    /api/Categories/GetAllCategories        # Get all categories
GET    /api/Categories/GetCategoryById/{id}    # Get category by ID
POST   /api/Categories/CreateCategory          # Create new category
PUT    /api/Categories/UpdateCategoryById/{id} # Update category
DELETE /api/Categories/DeleteCategoryById/{id} # Delete category
```

### Products API
```
GET    /api/Products/GetAllProducts            # Get paginated products
GET    /api/Products/GetProductBy/{id}         # Get product by ID
GET    /api/Products/GetProductsByCategoryId/{categoryId} # Get products by category
POST   /api/Products/CreateProduct             # Create new product
PUT    /api/Products/UpdateProductById/{id}    # Update product
DELETE /api/Products/DeleteProductById/{id}    # Delete product
```

### Expected API Response Format
```typescript
interface ApiResponse<T> {
  statusCode: number;
  error?: any;
  data: T;
  message?: string;
}
```

## 🎨 Styling & Theming

The application uses a custom CSS architecture with:
- **CSS Custom Properties**: For theming and consistency
- **Material Design**: Angular Material components
- **Responsive Design**: Mobile-first approach
- **Modern Animations**: Smooth transitions and micro-interactions

### Color Scheme
```css
:root {
  --primary-color: #1976d2;
  --primary-light: #42a5f5;
  --accent-color: #ff4081;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --error-color: #f44336;
}
```

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1024px
- **Large Desktop**: > 1024px

## 🧪 Testing

Run the test suite:
```bash
# Unit tests
ng test

# End-to-end tests
ng e2e
```

## 🏗️ Building for Production

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --prod
```

Build artifacts will be stored in the `dist/` directory.

## 🚀 Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)
1. Build the application: `ng build --prod`
2. Deploy the `dist/product-management-app` folder

### Server Deployment (Apache, Nginx)
1. Build the application: `ng build --prod`
2. Copy the `dist/product-management-app` contents to your web server
3. Configure the server to serve `index.html` for all routes (SPA routing)

### Example Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist/product-management-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔄 Development Workflow

### Adding a New Component
```bash
ng generate component components/your-component
```

### Adding a New Service
```bash
ng generate service services/your-service
```

### Adding a New Model
```bash
ng generate interface models/your-model
```

## 🎯 Performance Optimization

The application includes several performance optimizations:
- **Lazy Loading**: Route-based code splitting
- **OnPush Change Detection**: Optimized change detection
- **Standalone Components**: Reduced bundle size
- **Async Pipes**: Automatic subscription management
- **Pagination**: Efficient data loading

## 🔐 Security Best Practices

- **Input Validation**: Client-side form validation
- **XSS Protection**: Angular's built-in sanitization
- **CSRF Protection**: Angular's HTTP client protection
- **Content Security Policy**: Recommended CSP headers
- **Environment Variables**: Sensitive data in environment files

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check the `apiUrl` in environment files
   - Verify CORS configuration on your API server
   - Check browser network tab for errors

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Angular cache: `ng cache clean`
   - Update dependencies: `ng update`

3. **Styling Issues**
   - Ensure Angular Material theme is properly imported
   - Check for conflicting CSS styles
   - Verify Material Icons are loaded

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Code Style Guidelines
- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## 👨‍💻 Author

**Your Name**
- GitHub: [@A7medEmbaby](https://github.com/A7medEmbaby)
- Email: a7medembaby@gmail.com


## 🔗 Links

- [Angular Documentation](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Material Design Guidelines](https://material.io/design)

---

For questions, issues, or feature requests, please open an issue on GitHub.
