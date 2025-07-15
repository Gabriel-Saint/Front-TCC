import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Order, OrdersService } from '../../../core/services/orders.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, MatIconModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  myOrders$: Observable<Order[]> | undefined;

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    const orderIdsString = localStorage.getItem('my_order_ids');
    if (orderIdsString) {
      const orderIds = JSON.parse(orderIdsString);
      if (orderIds && orderIds.length > 0) {
        // Para cada ID, criamos uma chamada de "API".
        // Em um app real, você teria um endpoint que aceita múltiplos IDs.
        // Aqui, vamos simular buscando na lista completa.
        this.myOrders$ = this.ordersService.getOrders().pipe(
          map(allOrders => allOrders.filter(order => orderIds.includes(order.id)))
        );
      } else {
        this.myOrders$ = of([]); // Retorna um array vazio se não houver IDs
      }
    } else {
      this.myOrders$ = of([]); // Retorna um array vazio se não houver nada no localStorage
    }
  }

  // Função para dar um feedback visual do status
  getStatusIcon(status: string): string {
    switch (status) {
      case 'Concluído':
      case 'Finalizado':
        return 'check_circle';
      case 'Cancelado':
        return 'cancel';
      default:
        return 'hourglass_empty';
    }
  }
}
