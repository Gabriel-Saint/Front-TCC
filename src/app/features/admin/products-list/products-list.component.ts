import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { IProduct } from '../../../core/interfaces/product/product.interface';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, MatDialogModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  displayedColumns: string[] = ['code', 'name', 'value', 'category', 'actions'];
  dataSource = new MatTableDataSource<IProduct>();
  isLoading = true;

  constructor(
    private productsService: ProductsService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productsService.findAll().subscribe(products => {
      this.dataSource.data = products;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditModal(product: IProduct): void {
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '600px',
      data: { ...product } // Passa uma cópia do produto para o modal
    });

    dialogRef.afterClosed().subscribe((updatedProduct: IProduct) => {
      if (updatedProduct) {
        const index = this.dataSource.data.findIndex(p => p.id === updatedProduct.id);
        if (index > -1) {
          const currentData = this.dataSource.data;
          currentData[index] = updatedProduct;
          this.dataSource.data = currentData;
        }
      }
    });
  }

  deleteProduct(product: IProduct): void {
    if (confirm(`Tem certeza que deseja apagar o produto ${product.name}?`)) {
      this.productsService.remove(product.id).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(p => p.id !== product.id);
      });
    }
  }

  goToAddProduct(): void {
    this.router.navigate(['admin/produtos/novo']);
  }
}
