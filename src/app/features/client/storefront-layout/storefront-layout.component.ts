import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartComponent } from '../cart/cart.component';
import { CartService } from '../../../core/services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-storefront-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, MatSidenavModule,
    MatButtonModule, MatIconModule, CartComponent, CurrencyPipe
  ],
  templateUrl: './storefront-layout.component.html',
  styleUrls: ['./storefront-layout.component.scss']
})
export class StorefrontLayoutComponent implements OnInit {
  @ViewChild('cartSidenav') cartSidenav!: MatSidenav;

  cartItemCount$: Observable<number>;
  cartTotal$: Observable<number>;

  // Apenas uma flag para saber se mostra ou não o link
  hasOrders = false;

  constructor(private cartService: CartService) {
    this.cartTotal$ = this.cartService.getCartTotal();
    this.cartItemCount$ = this.cartService.cartItems$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }

  ngOnInit(): void {
    // A lógica agora é mais simples: apenas verifica se a lista de IDs existe e não está vazia
    const orderIdsString = localStorage.getItem('my_order_ids');
    if (orderIdsString) {
      const orderIds = JSON.parse(orderIdsString);
      this.hasOrders = orderIds && orderIds.length > 0;
    }
  }

  toggleCart(): void {
    this.cartSidenav.toggle();
  }
}
