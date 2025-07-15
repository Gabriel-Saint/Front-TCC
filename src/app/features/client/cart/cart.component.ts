import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CartItem, CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, ReactiveFormsModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatExpansionModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @Output() closeCart = new EventEmitter<void>();

  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  checkoutStep: 'items' | 'checkout' | 'payment' = 'items';
  checkoutForm!: FormGroup;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      cpf: ['']
    });
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  goToStep(step: 'items' | 'checkout' | 'payment'): void {
    this.checkoutStep = step;
  }

  placeOrder(): void {
    if (this.checkoutStep === 'checkout' && this.checkoutForm.invalid) {
      alert('Por favor, preencha seus dados.');
      return;
    }
    console.log('Pedido finalizado!', this.checkoutForm.value);
    alert('Pedido enviado com sucesso!');
    this.closeCart.emit();
  }
}
