import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {  OrdersService } from '../../../core/services/orders.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IOrder } from '../../../core/interfaces/order/order.interface';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, MatIconModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {

  myOrders$: Observable<IOrder[]> | undefined;

  constructor(private ordersService: OrdersService) { }

  ngOnInit(): void {
    const orderIdsString = localStorage.getItem('my_order_ids');
    if (orderIdsString) {
      const orderIds = JSON.parse(orderIdsString);
      if (orderIds && orderIds.length > 0) {
        this.myOrders$ = this.ordersService.getOrders().pipe(
          map(allOrders => allOrders.filter(order => orderIds.includes(order.id)))
        );
      } else {
        this.myOrders$ = of([]); 
      }
    } else {
      this.myOrders$ = of([]);
    }
  }

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
