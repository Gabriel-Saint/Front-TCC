import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { IOrder } from '../../../core/interfaces/order/order.interface';
import { OrdersService } from '../../../core/services/orders.service';

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './order-details-modal.component.html',
  styleUrls: ['./order-details-modal.component.scss']
})
export class OrderDetailsModalComponent {

  constructor(
    public dialogRef: MatDialogRef<OrderDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public order: IOrder,
    private ordersService: OrdersService,
    private dialog: MatDialog
  ) {}

  /**
   * @param newStatus 
   */
  changeStatus(newStatus: IOrder['status']): void {
    if (newStatus === 'Cancelado') {
      if (!confirm(`Tem certeza que deseja cancelar o pedido #${this.order.id}?`)) {
        return;
      }
    }
    
    const payload = { status: newStatus };

    this.ordersService.updateOrderStatus(this.order.id, payload).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Erro ao atualizar status do pedido:', err);
        alert('Não foi possível atualizar o status do pedido.');
      }
    });
  }
}
