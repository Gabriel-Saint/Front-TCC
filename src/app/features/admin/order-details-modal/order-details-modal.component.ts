import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Order, OrdersService } from '../../../core/services/orders.service';

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
    @Inject(MAT_DIALOG_DATA) public order: Order,
    private ordersService: OrdersService,
    private dialog: MatDialog // Para abrir o diálogo de confirmação
  ) {}

  changeStatus(newStatus: Order['status']): void {
    // Para ações destrutivas como cancelar, pedimos confirmação
    if (newStatus === 'Cancelado') {
      if (!confirm(`Tem certeza que deseja cancelar o pedido #${this.order.id}?`)) {
        return; // Usuário cancelou a confirmação
      }
    }
    
    this.ordersService.updateOrderStatus(this.order.id, newStatus).subscribe(() => {
      // Fecha o modal e retorna os dados atualizados para a lista
      this.dialogRef.close({ id: this.order.id, newStatus: newStatus });
    });
  }
}
