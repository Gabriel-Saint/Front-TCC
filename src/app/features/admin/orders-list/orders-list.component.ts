import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

import { Order, OrdersService } from '../../../core/services/orders.service';
import { OrderDetailsModalComponent } from '../order-details-modal/order-details-modal.component';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'date', 'customerName', 'customerPhone', 'items', 'status'];
  dataSource = new MatTableDataSource<Order>();
  isLoading = true;

  // Filtros
  searchText: string = '';
  selectedDate: Date | null = null;
  selectedStatus: string = 'todos';

  constructor(
    private ordersService: OrdersService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe((orders) => {
      this.dataSource.data = orders;
      this.isLoading = false;

      // Filtro customizado
      this.dataSource.filterPredicate = (data: Order, filter: string): boolean => {
        const filters = JSON.parse(filter);

        const matchesSearchText =
          data.customerName.toLowerCase().includes(filters.searchText) ||
          data.customerPhone.includes(filters.searchText) ||
          data.id.toString().includes(filters.searchText);

        const matchesStatus =
          filters.selectedStatus === 'todos' || data.status === filters.selectedStatus;

        const matchesDate =
          !filters.selectedDate ||
          new Date(data.date).toDateString() === new Date(filters.selectedDate).toDateString();

        return matchesSearchText && matchesStatus && matchesDate;
      };
    });
  }

  applyCombinedFilter(): void {
    const filterObj = {
      searchText: this.searchText.trim().toLowerCase(),
      selectedDate: this.selectedDate,
      selectedStatus: this.selectedStatus
    };

    this.dataSource.filter = JSON.stringify(filterObj);
  }

  openOrderDetails(order: Order): void {
    const dialogRef = this.dialog.open(OrderDetailsModalComponent, {
      width: '500px',
      data: order,
      panelClass: 'order-details-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(o => o.id === result.id);
        if (index > -1) {
          const updatedData = [...this.dataSource.data];
          updatedData[index].status = result.newStatus;
          this.dataSource.data = updatedData;
        }
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }
}
