// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// // Imports do Angular Material
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatListModule } from '@angular/material/list';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';


// import { AuthService } from  '../../../core/services/auth.service';

// @Component({
//   selector: 'app-admin-layout',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterOutlet,
//     RouterLink,
//     RouterLinkActive,
//     MatSidenavModule,
//     MatToolbarModule,
//     MatListModule,
//     MatIconModule,
//     MatButtonModule
//   ],
//   templateUrl: './admin-layout.component.html',
//   styleUrls: ['./admin-layout.component.scss']
// })
// export class AdminLayoutComponent {

//   constructor(private authService: AuthService) {}

//   expandedStates: { [key: string]: boolean } = {};


//   navItems = [
//     { path: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
//     { path: 'pedidos', icon: 'shopping_cart', label: 'Pedidos' },
//     { 
//       label: 'Produtos', 
//       icon: 'inventory_2',
//       children: [
//         { path: 'categorias', label: 'Gerenciar Categorias' }, 
//         { path: 'produtos', label: 'Listar Produtos' }, 
//         { path: 'produtos/novo', label: 'Cadastrar Produto' }, 
//       ]
//     },
//     { 
//       label: 'Usuários', 
//       icon: 'group',
//       children: [
//         { path: 'usuarios', label: 'Listar Usuários' },
//         { path: 'usuarios/novo', label: 'Adicionar Novo' },
//       ]
//     },
//      { 
//       label: 'Funções', 
//       icon: 'admin_panel_settings', 
//       children: [
//         { path: 'roles', label: 'Listar Funções' },
//       ]
//     },
//   ];
//   toggleSubmenu(label: string): void {
//     this.expandedStates[label] = !this.expandedStates[label];
//   }

//   logout(): void{
//     this.authService.logout();
//   }
// }

import { Component, OnInit } from '@angular/core'; // 1. Importar OnInit
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// Imports do Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit { // 2. Implementar OnInit

  constructor(private authService: AuthService) { } // O authService já está injetado

  expandedStates: { [key: string]: boolean } = {};

  // 3. Inicializa a lista de navegação como vazia
  navItems: any[] = [];

  // 4. O ngOnInit será chamado quando o componente carregar
  ngOnInit(): void {
    this.buildNavItems();
  }

  // 5. Este método constrói o menu dinamicamente
  private buildNavItems(): void {

    // Itens que SÃO permitidos para Colaboradores
    const staffItems = [
      { path: 'pedidos', icon: 'shopping_cart', label: 'Pedidos' },
       {
        label: 'Produtos',
        icon: 'inventory_2',
        children: [
          { path: 'produtos', label: 'Listar Produtos' },
          { path: 'produtos/novo', label: 'Cadastrar Produto' },
        ]
      },
    ];

    // Itens que SÃO EXCLUSIVOS do Admin
    const adminItems = [
      { path: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
      {
        label: 'Produtos',
        icon: 'inventory_2',
        children: [
          { path: 'categorias', label: 'Gerenciar Categorias' },
          { path: 'produtos', label: 'Listar Produtos' },
          { path: 'produtos/novo', label: 'Cadastrar Produto' },
        ]
      },
      {
        label: 'Usuários',
        icon: 'group',
        children: [
          { path: 'usuarios', label: 'Listar Usuários' },
          { path: 'usuarios/novo', label: 'Adicionar Novo' },
        ]
      },
      {
        label: 'Funções',
        icon: 'admin_panel_settings',
        children: [
          { path: 'roles', label: 'Listar Funções' },
        ]
      },
    ];

 
    if (this.authService.isAdmin()) {
    
      this.navItems = [adminItems[0],...adminItems.slice(1)];
    } else if (this.authService.isStaff()) {

      this.navItems = staffItems;
    }
  }

  toggleSubmenu(label: string): void {
    this.expandedStates[label] = !this.expandedStates[label];
  }

  logout(): void {
    this.authService.logout();
  }
}
