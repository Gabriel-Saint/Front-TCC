import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// Imports do Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
export class AdminLayoutComponent {
  // Objeto para controlar o estado (aberto/fechado) de cada submenu
  expandedStates: { [key: string]: boolean } = {};

 
  navItems = [
    { path: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: 'pedidos', icon: 'shopping_cart', label: 'Pedidos' },
    { 
      label: 'Produtos', 
      icon: 'inventory_2',
      children: [
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
  ];

  // Função para abrir/fechar o submenu
  toggleSubmenu(label: string): void {
    this.expandedStates[label] = !this.expandedStates[label];
  }
}
