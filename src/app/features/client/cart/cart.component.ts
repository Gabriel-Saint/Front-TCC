import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, firstValueFrom, Subscription } from 'rxjs';

import { CartItem, CartService } from '../../../core/services/cart.service';
import { CheckoutService } from '../../../core/services/checkout.service';
import { MercadoPagoService } from '../../../core/services/mercado-pago.service';
import { IOrderItemPayload } from '../../../core/interfaces/order/order.interface';
import { IPaymentPayload } from '../../../core/interfaces/payment/payment.interface';
import { ICheckoutPayload } from '../../../core/interfaces/checkout/checkout.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, ReactiveFormsModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatRadioModule, MatButtonToggleModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  public environment = environment;
  @Output() closeCart = new EventEmitter<void>();

  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  checkoutStep: 'items' | 'checkout' | 'payment' = 'items';
  checkoutForm!: FormGroup;
  deliveryFee = 0.00;
  private deliveryTypeSub!: Subscription;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private mercadoPagoService: MercadoPagoService,
    private fb: FormBuilder
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      deliveryType: ['Delivery', Validators.required],
      address: ['', Validators.required],
      cpf: [''],
      customerNote: [''],
      paymentType: ['Dinheiro', Validators.required],
      changeFor: [null]
    });

    this.deliveryTypeSub = this.checkoutForm.get('deliveryType')!.valueChanges.subscribe(type => {
      const addressControl = this.checkoutForm.get('address');
      const paymentTypeControl = this.checkoutForm.get('paymentType');

      if (type === 'Retirada') {
        this.deliveryFee = 0;
        addressControl?.clearValidators();
        addressControl?.setValue('');
        if (paymentTypeControl?.value === 'MercadoPago') {
          paymentTypeControl.setValue('Dinheiro');
        }
      } else {
        this.deliveryFee = 0;
        addressControl?.setValidators(Validators.required);
      }
      addressControl?.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    if (this.deliveryTypeSub) {
      this.deliveryTypeSub.unsubscribe();
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  goToStep(step: 'items' | 'checkout' | 'payment'): void {
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

    const itemsPayload: IOrderItemPayload[] = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));

    const paymentPayload: IPaymentPayload = {
      type: formValue.paymentType,
      deliveryFee: this.deliveryFee,
      subtotal: subtotal,
      total: subtotal + this.deliveryFee,
      changeFor: formValue.paymentType === 'Dinheiro' ? formValue.changeFor : undefined,
    };

    const checkoutPayload: ICheckoutPayload = {
      name: formValue.name,
      phone: formValue.phone,
      deliveryType: formValue.deliveryType,
      address: formValue.deliveryType === 'Delivery' ? formValue.address : '',
      cpf: formValue.cpf,
      customerNote: formValue.customerNote,
      items: itemsPayload,
      payment: paymentPayload
    };

    if (formValue.paymentType === 'MercadoPago') {
      this.mercadoPagoService.createPreference(checkoutPayload).subscribe({
        next: (response) => {
          window.location.href = response.checkoutUrl;
        },
        error: (err) => {
          console.error('Erro ao criar preferência de pagamento:', err);
          alert('Não foi possível iniciar o pagamento online. Tente novamente.');
        }
      });
    } else {
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
}
