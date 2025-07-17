import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { OrdersService } from '../../../core/services/orders.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IOrder } from '../../../core/interfaces/order/order.interface';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, MatIconModule, MatDividerModule],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit {

  order$: Observable<IOrder | undefined> | undefined;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    this.order$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => {
        if (!id) {
          return of(undefined);
        }
        return this.ordersService.findOne(id);
      })
    );
  }
}
