import { Routes } from '@angular/router';

export const routes: Routes = [
  // Rotas de Autenticação 
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(c => c.RegisterComponent)
  },

  // ROTA PRINCIPAL DO ADMIN (carrega o layout com o menu)
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(c => c.AdminLayoutComponent),

    // As rotas filhas serão carregadas dentro do <router-outlet> do AdminLayoutComponent
    children: [
      {
        // Redireciona de /admin para /admin/dashboard por padrão
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        // Carrega o DashboardComponent quando a URL for /admin/dashboard
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        // ROTA ADICIONADA: Carrega o componente para criar um novo produto
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

  // Rota de fallback: se o usuário acessar a raiz do site, redireciona para o login
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
];
