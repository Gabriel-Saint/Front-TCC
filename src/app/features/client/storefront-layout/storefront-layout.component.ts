import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartComponent } from '../cart/cart.component'; // Importa o componente da sacola
import { CartService } from '../../../core/services/cart.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-storefront-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, MatSidenavModule,
    MatButtonModule, MatIconModule, CartComponent
  ],
  templateUrl: './storefront-layout.component.html',
  styleUrls: ['./storefront-layout.component.scss']
})
export class StorefrontLayoutComponent {
  @ViewChild('cartSidenav') cartSidenav!: MatSidenav;

  cartItemCount$: Observable<number>;
  cartTotal$: Observable<number>;

  constructor(private cartService: CartService) {
    this.cartTotal$ = this.cartService.getCartTotal();
    this.cartItemCount$ = this.cartService.cartItems$.pipe(
      map((items: any[]) => items.reduce((count: any, item: { quantity: any; }) => count + item.quantity, 0))
    );
  }

  toggleCart(): void {
    this.cartSidenav.toggle();
  }
}
