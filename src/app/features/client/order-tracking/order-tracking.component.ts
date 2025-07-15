import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Order, OrdersService } from '../../../core/services/orders.service'; 
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, MatIconModule, MatDividerModule],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit {

  order$: Observable<Order | undefined> | undefined;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    // Pega o ID da rota e busca o pedido correspondente
    this.order$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => {
        if (!id) return of(undefined); // Caso não haja ID
        // Em um app real, você chamaria um método como this.ordersService.getOrderById(+id)
        // Por agora, vamos simular buscando na lista mockada.
        return this.ordersService.getOrders().pipe(
          map(orders => orders.find(o => o.id === +id))
        );
      })
    );
  }
}
