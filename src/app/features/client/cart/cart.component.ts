import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';

// Serviços e Interfaces
import { CartItem, CartService } from '../../../core/services/cart.service';
import { CheckoutService } from '../../../core/services/checkout.service';
import { IOrderItem } from '../../../core/interfaces/order/order.interface'; 
import { IPaymentPayload } from '../../../core/interfaces/payment/payment.interface';
import { ICheckoutPayload } from '../../../core/interfaces/checkout/checkout.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, ReactiveFormsModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatRadioModule
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

  deliveryFee = 5.00;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private fb: FormBuilder
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {
    // Adicione todos os campos, incluindo os de pagamento, ao formulário
    this.checkoutForm = this.fb.group({
      // Dados do cliente
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      cpf: [''],
      customerNote: [''],
      // Dados de pagamento
      paymentType: ['Cash', Validators.required], // Valor inicial 'Cash'
      changeFor: [null] // Campo para o troco, não obrigatório
    });
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  goToStep(step: 'items' | 'checkout' | 'payment'): void {
    // Valida o formulário antes de avançar para o pagamento
    if (step === 'payment' && this.checkoutForm.invalid) {
        this.checkoutForm.markAllAsTouched();
        alert('Por favor, preencha seus dados antes de prosseguir.');
        return;
    }
    this.checkoutStep = step;
  }

  async placeOrder(): Promise<void> {
    if (this.checkoutForm.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const items = await firstValueFrom(this.cartItems$);
    const subtotal = await firstValueFrom(this.cartTotal$);

    if (items.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    const formValue = this.checkoutForm.value;

    const itemsPayload: IOrderItem[] = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    const paymentPayload: IPaymentPayload = {
      type: formValue.paymentType,
      deliveryFee: this.deliveryFee,
      subtotal: subtotal,
      total: subtotal + this.deliveryFee,
      changeFor: formValue.paymentType === 'Cash' ? formValue.changeFor : undefined,
    };

    const checkoutPayload: ICheckoutPayload = {
      name: formValue.name,
      phone: formValue.phone,
      address: formValue.address,
      cpf: formValue.cpf,
      customerNote: formValue.customerNote,
      items: itemsPayload,
      payment: paymentPayload
    };

    this.checkoutService.createOrder(checkoutPayload).subscribe({
      next: (response) => {
        alert(`Pedido #${response.order.id} enviado com sucesso!`);
        this.cartService.clearCart();
        const myOrderIds = JSON.parse(localStorage.getItem('my_order_ids') || '[]');
        myOrderIds.push(response.order.id);
        localStorage.setItem('my_order_ids', JSON.stringify(myOrderIds));
        this.closeCart.emit();
      },
      error: (err) => {
        console.error('Erro ao criar pedido:', err);
        alert(`Ocorreu um erro: ${err.error.message || 'Tente novamente.'}`);
      }
    });
  }
}
