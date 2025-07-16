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
  // BehaviorSubject guarda o estado atual da sacola e emite para quem estiver "ouvindo"
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  
  // Expondo os dados da sacola como um Observable (somente leitura)
  public cartItems$ = this.cartItems.asObservable();

  constructor() { }

  addItem(product: IProduct): void {
    const currentItems = this.cartItems.getValue();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      // Se o item já existe, apenas aumenta a quantidade
      existingItem.quantity++;
    } else {
      // Se não, adiciona o novo item
      currentItems.push({ product, quantity: 1 });
    }

    // Emite o novo estado da sacola
    this.cartItems.next(currentItems);
  }

  removeItem(productId: number): void {
    let currentItems = this.cartItems.getValue();
    currentItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems.next(currentItems);
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + (item.product.price * item.quantity), 0))
    );
  }
}
