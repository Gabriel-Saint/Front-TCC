import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { OrdersService } from '../../../core/services/orders.service';
import { map, switchMap, takeWhile, tap } from 'rxjs/operators';
import { Observable, of, timer, Subject, takeUntil } from 'rxjs';
import { IOrder } from '../../../core/interfaces/order/order.interface';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, MatIconModule, MatDividerModule],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit, OnDestroy {

  order$: Observable<IOrder | undefined> | undefined;
  private readonly POLLING_INTERVAL = 5000; // 5 segundos
  private destroy$ = new Subject<void>();

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

        return timer(0, this.POLLING_INTERVAL).pipe(
          switchMap(() => this.ordersService.findOne(id)),
          takeWhile(order => 
            !!order && order.status !== 'Concluído' && order.status !== 'Cancelado', 
            true
          ),
          takeUntil(this.destroy$)
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
