import { Routes } from '@angular/router';

export const routes: Routes = [
  // Rotas de Autenticação (continuam acessíveis por suas URLs diretas)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
  },

  // ROTA PRINCIPAL DO ADMIN
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(c => c.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'produtos/novo',
        loadComponent: () => import('./features/admin/create-product/create-product.component').then(c => c.CreateProductComponent)
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./features/admin/orders-list/orders-list.component').then(c => c.OrdersListComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/admin/users-list/users-list.component').then(c => c.UsersListComponent)
      },
      {
        path: 'usuarios/novo',
        loadComponent: () => import('./features/admin/create-user/create-user.component').then(c => c.CreateUserComponent)
      },
      {
        path: 'produtos',
        loadComponent: () => import('./features/admin/products-list/products-list.component').then(c => c.ProductsListComponent)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./features/admin/categories-list/categories-list.component').then(c => c.CategoriesListComponent)
      }
    ]
  },
  
  {
    path: '',
    loadComponent: () => import('./features/client/storefront-layout/storefront-layout.component').then(c => c.StorefrontLayoutComponent),
    children: [
      { path: '', redirectTo: 'menu', pathMatch: 'full' },
      {
        path: 'menu',
        loadComponent: () => import('./features/client/menu/menu.component').then(c => c.MenuComponent)
      },
      {
        path: 'acompanhar-pedido/:id',
        loadComponent: () => import('./features/client/order-tracking/order-tracking.component').then(c => c.OrderTrackingComponent)
      },
      // ROTA ADICIONADA:
      {
        path: 'meus-pedidos',
        loadComponent: () => import('./features/client/my-orders/my-orders.component').then(c => c.MyOrdersComponent)
      }
    ]
  }
];
