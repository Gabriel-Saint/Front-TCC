import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProduct } from '../interfaces/product/product.interface';

export interface CartItem {
  product: IProduct;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  
  public cartItems$ = this.cartItems.asObservable();

  constructor() { }

  addItem(product: IProduct): void {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentItems.push({ product, quantity: 1 });
    }

    this.cartItems.next(currentItems);
  }

  removeItem(productId: number): void {
    let currentItems = this.cartItems.getValue();
    currentItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.next(currentItems);
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + (Number(item.product.price) * item.quantity), 0))
    );
  }

  clearCart(): void {
    this.cartItems.next([]);
  }
}
