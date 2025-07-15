import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Interfaces para tipar nossos dados
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}//criar interfaces!!!!!!!!!!!!!!!!!!!!

export interface Order {
  id: number;
  date: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: 'Concluído' | 'Pendente' | 'Aguardando' | 'Finalizado' | 'Cancelado';
  deliveryType: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  // Dados simulados
  private mockOrders: Order[] = [
    { id: 7676, date: '2022-06-30', customerName: 'Ramesh Chaudhary', customerPhone: '6523787839', items: [{ name: 'Açaí no pote 500g', quantity: 1, price: 42.99 }, { name: 'Barca de Açaí', quantity: 1, price: 83.99 }], status: 'Concluído', deliveryType: 'Retirar na loja', paymentMethod: 'Cartão de Crédito', paymentStatus: 'Aguardando', total: 126.98 },
    { id: 7677, date: '2022-06-30', customerName: 'Ana Silva', customerPhone: '11987654321', items: [{ name: 'Suco de Laranja', quantity: 2, price: 8.00 }], status: 'Pendente', deliveryType: 'Entrega', paymentMethod: 'PIX', paymentStatus: 'Pago', total: 16.00 },
    { id: 7678, date: '2022-06-29', customerName: 'Carlos Pereira', customerPhone: '21912345678', items: [{ name: 'X-Tudo', quantity: 1, price: 25.50 }], status: 'Aguardando', deliveryType: 'Retirar na loja', paymentMethod: 'Dinheiro', paymentStatus: 'Pendente', total: 25.50 },
    { id: 7679, date: '2022-06-29', customerName: 'Mariana Costa', customerPhone: '31988887777', items: [{ name: 'Pizza Grande', quantity: 1, price: 60.00 }], status: 'Finalizado', deliveryType: 'Entrega', paymentMethod: 'Cartão de Débito', paymentStatus: 'Pago', total: 60.00 },
    { id: 7680, date: '2022-06-28', customerName: 'João Mendes', customerPhone: '41999998888', items: [{ name: 'Hambúrguer Duplo', quantity: 1, price: 30.00 }], status: 'Cancelado', deliveryType: 'Entrega', paymentMethod: 'N/A', paymentStatus: 'Cancelado', total: 30.00 },
  ];

  constructor() { }

  getOrders(): Observable<Order[]> {
    // Simula uma chamada de API com um pequeno atraso
    return of(this.mockOrders).pipe(delay(500));
  }

  updateOrderStatus(orderId: number, newStatus: string): Observable<any> {
    console.log(`Atualizando status do pedido ${orderId} para ${newStatus}`);
    // Aqui você faria uma chamada HTTP PATCH ou PUT para sua API real
    return of({ success: true }).pipe(delay(300));
  }
}
