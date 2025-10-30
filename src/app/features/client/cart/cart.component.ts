// import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Observable, firstValueFrom, Subscription } from 'rxjs';
// import { Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';

// import { CartItem, CartService } from '../../../core/services/cart.service';
// import { CheckoutService } from '../../../core/services/checkout.service';
// import { MercadoPagoService } from '../../../core/services/mercado-pago.service';
// import { IOrderItemPayload } from '../../../core/interfaces/order/order.interface';
// import { IPaymentPayload } from '../../../core/interfaces/payment/payment.interface';
// import { ICheckoutPayload } from '../../../core/interfaces/checkout/checkout.interface';
// import { environment } from '../../../../environments/environment';
// import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
// import { ConfirmationModalData } from '../../../core/interfaces/modal/confirmation-modal.interface';

// @Component({
//   selector: 'app-cart',
//   standalone: true,
//   imports: [
//     CommonModule, CurrencyPipe, ReactiveFormsModule, MatIconModule, MatButtonModule,
//     MatFormFieldModule, MatInputModule, MatRadioModule, MatButtonToggleModule
//   ],
//   templateUrl: './cart.component.html',
//   styleUrls: ['./cart.component.scss']
// })
// export class CartComponent implements OnInit, OnDestroy {
//   public environment = environment;
//   @Output() closeCart = new EventEmitter<void>();

//   cartItems$: Observable<CartItem[]>;
//   cartTotal$: Observable<number>;
//   checkoutStep: 'items' | 'checkout' | 'payment' = 'items';
//   checkoutForm!: FormGroup;
//   deliveryFee = 0.00;
//   private deliveryTypeSub!: Subscription;

//   constructor(
//     private cartService: CartService,
//     private checkoutService: CheckoutService,
//     private mercadoPagoService: MercadoPagoService,
//     private fb: FormBuilder,
//     private router: Router,
//     private dialog: MatDialog
//   ) {
//     this.cartItems$ = this.cartService.cartItems$;
//     this.cartTotal$ = this.cartService.getCartTotal();
//   }

//   ngOnInit(): void {
//     this.checkoutForm = this.fb.group({
//       name: ['', Validators.required],
//       phone: ['', Validators.required],
//       deliveryType: ['Delivery', Validators.required],
//       address: ['', Validators.required],
//       cpf: [''],
//       customerNote: [''],
//       paymentType: ['Dinheiro', Validators.required],
//       changeFor: [null]
//     });

//     this.deliveryTypeSub = this.checkoutForm.get('deliveryType')!.valueChanges.subscribe(type => {
//       const addressControl = this.checkoutForm.get('address');
//       const paymentTypeControl = this.checkoutForm.get('paymentType');

//       if (type === 'Retirada') {
//         this.deliveryFee = 0;
//         addressControl?.clearValidators();
//         addressControl?.setValue('');
//         if (paymentTypeControl?.value === 'MercadoPago') {
//           paymentTypeControl.setValue('Dinheiro');
//         }
//       } else {
//         this.deliveryFee = 0; // Você pode ajustar a taxa de entrega aqui
//         addressControl?.setValidators(Validators.required);
//       }
//       addressControl?.updateValueAndValidity();
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.deliveryTypeSub) {
//       this.deliveryTypeSub.unsubscribe();
//     }
//   }

//   removeItem(productId: number): void {
//     this.cartService.removeItem(productId);
//   }

//   goToStep(step: 'items' | 'checkout' | 'payment'): void {
//     if (step === 'payment' && this.checkoutForm.invalid) {
//         this.checkoutForm.markAllAsTouched();
//         alert('Por favor, preencha seus dados antes de prosseguir.');
//         return;
//     }
//     this.checkoutStep = step;
//   }

//   async placeOrder(): Promise<void> {
//     if (this.checkoutForm.invalid) {
//       this.checkoutForm.markAllAsTouched();
//       this.showErrorModal('Por favor, preencha todos os campos obrigatórios.');
//       return;
//     }

//     const items = await firstValueFrom(this.cartItems$);
//     if (items.length === 0) {
//       this.showErrorModal('O seu carrinho está vazio.');
//       return;
//     }

//     const subtotal = await firstValueFrom(this.cartTotal$);
//     const formValue = this.checkoutForm.value;

//     const itemsPayload: IOrderItemPayload[] = items.map(item => ({
//       productId: item.product.id,
//       quantity: item.quantity
//     }));

//     const paymentPayload: IPaymentPayload = {
//       type: formValue.paymentType,
//       deliveryFee: this.deliveryFee,
//       subtotal: subtotal,
//       total: subtotal + this.deliveryFee,
//       changeFor: formValue.paymentType === 'Dinheiro' ? formValue.changeFor : undefined,
//     };

//     const checkoutPayload: ICheckoutPayload = {
//       name: formValue.name,
//       phone: formValue.phone,
//       deliveryType: formValue.deliveryType,
//       address: formValue.deliveryType === 'Delivery' ? formValue.address : '',
//       cpf: formValue.cpf,
//       customerNote: formValue.customerNote,
//       items: itemsPayload,
//       payment: paymentPayload
//     };

//     if (formValue.paymentType === 'MercadoPago') {
//       this.mercadoPagoService.createPreference(checkoutPayload).subscribe({
//         next: (response) => {
//           window.location.href = response.checkoutUrl;
//         },
//         error: (err) => {
//           console.error('Erro ao criar preferência de pagamento:', err);
//           this.showErrorModal('Não foi possível iniciar o pagamento online. Tente novamente.');
//         }
//       });
//     } else {
//       this.checkoutService.createOrder(checkoutPayload).subscribe({
//         next: (response) => {
//           this.cartService.clearCart();
//           const myOrderIds = JSON.parse(localStorage.getItem('my_order_ids') || '[]');
//           myOrderIds.push(response.order.id);
//           localStorage.setItem('my_order_ids', JSON.stringify(myOrderIds));
//           this.closeCart.emit();
//           this.showSuccessModalAndNavigate(response.order.id);
//         },
//         error: (err) => {
//           console.error('Erro ao criar pedido:', err);
//           this.showErrorModal(`Ocorreu um erro: ${err.error.message || 'Tente novamente.'}`);
//         }
//       });
//     }
//   }

//   showSuccessModalAndNavigate(orderId: number): void {
//     const dialogData: ConfirmationModalData = {
//       title: 'Pedido Enviado com Sucesso!',
//       message: `O seu pedido #${orderId} foi recebido e já está em preparação.`,
//       icon: 'check_circle',
//       confirmButtonText: 'Acompanhar Pedido'
//     };

//     const dialogRef = this.dialog.open(ConfirmationModalComponent, {
//       width: '400px',
//       data: dialogData,
//     });

//     dialogRef.afterClosed().subscribe(() => {
//       this.router.navigate(['/acompanhar-pedido', orderId]);
//     });
//   }

//   showErrorModal(message: string): void {
//     this.dialog.open(ConfirmationModalComponent, {
//       width: '400px',
//       data: {
//         title: 'Ocorreu um Erro',
//         message: message,
//         icon: 'error',
//         confirmButtonText: 'OK'
//       }
//     });
//   }
// }


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
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { CartItem, CartService } from '../../../core/services/cart.service';
import { CheckoutService } from '../../../core/services/checkout.service';
import { MercadoPagoService } from '../../../core/services/mercado-pago.service';
import { IOrderItemPayload } from '../../../core/interfaces/order/order.interface';
import { IPaymentPayload } from '../../../core/interfaces/payment/payment.interface';
import { ICheckoutPayload } from '../../../core/interfaces/checkout/checkout.interface';
import { environment } from '../../../../environments/environment';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalData } from '../../../core/interfaces/modal/confirmation-modal.interface';

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
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog
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

  onNameInput(event: Event): void {
    let value = (event.target as HTMLInputElement).value;
    value = value.replace(/[^a-zA-Z\u00C0-\u017F\s]/g, '');
    (event.target as HTMLInputElement).value = value;
    this.checkoutForm.get('name')?.setValue(value, { emitEvent: false });
  }

  onPhoneInput(event: Event): void {
    let value = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    let formattedValue = value;
    if (value.length > 2) {
      formattedValue = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    }
    if (value.length > 7) {
      formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    }
    (event.target as HTMLInputElement).value = formattedValue;
    this.checkoutForm.get('phone')?.setValue(formattedValue, { emitEvent: false });
  }

  onCpfInput(event: Event): void {
    let value = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    let formattedValue = value;
    if (value.length > 3) {
      formattedValue = `${value.substring(0, 3)}.${value.substring(3)}`;
    }
    if (value.length > 6) {
      formattedValue = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6)}`;
    }
    if (value.length > 9) {
      formattedValue = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9)}`;
    }
    (event.target as HTMLInputElement).value = formattedValue;
    this.checkoutForm.get('cpf')?.setValue(formattedValue, { emitEvent: false });
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
      this.checkoutForm.markAllAsTouched();
      this.showErrorModal('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const items = await firstValueFrom(this.cartItems$);
    if (items.length === 0) {
      this.showErrorModal('O seu carrinho está vazio.');
      return;
    }

    const subtotal = await firstValueFrom(this.cartTotal$);
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
      phone: String(formValue.phone).replace(/\D/g, ''),
      deliveryType: formValue.deliveryType,
      address: formValue.deliveryType === 'Delivery' ? formValue.address : '',
      cpf: String(formValue.cpf).replace(/\D/g, ''),
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
          this.showErrorModal('Não foi possível iniciar o pagamento online. Tente novamente.');
        }
      });
    } else {
      this.checkoutService.createOrder(checkoutPayload).subscribe({
        next: (response) => {
          this.cartService.clearCart();
          const myOrderIds = JSON.parse(localStorage.getItem('my_order_ids') || '[]');
          myOrderIds.push(response.order.id);
          localStorage.setItem('my_order_ids', JSON.stringify(myOrderIds));
          this.closeCart.emit();
          this.showSuccessModalAndNavigate(response.order.id);
        },
        error: (err) => {
          console.error('Erro ao criar pedido:', err);
          this.showErrorModal(`Ocorreu um erro: ${err.error.message || 'Tente novamente.'}`);
        }
      });
    }
  }

  showSuccessModalAndNavigate(orderId: number): void {
    const dialogData: ConfirmationModalData = {
      title: 'Pedido Enviado com Sucesso!',
      message: `O seu pedido #${orderId} foi recebido e já está em preparação.`,
      icon: 'check_circle',
      confirmButtonText: 'Acompanhar Pedido'
    };

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/acompanhar-pedido', orderId]);
    });
  }

  showErrorModal(message: string): void {
    this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        title: 'Ocorreu um Erro',
        message: message,
        icon: 'error',
        confirmButtonText: 'OK'
      }
    });
  }
}

