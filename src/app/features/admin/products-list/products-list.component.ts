import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// Serviços e Interfaces
import { ProductsService } from '../../../core/services/products.service';
import { CategoryService } from '../../../core/services/categories.service'; 
import { IProduct } from '../../../core/interfaces/product/product.interface';
import { ICategory } from '../../../core/interfaces/category/category.interface'; 
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';

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
    private categoryService: CategoryService, // 3. Injete o CategoryService
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      products: this.productsService.findAll(),
      categories: this.categoryService.findAll()
    }).subscribe(({ products, categories }) => {

      const categoryMap = new Map<number, string>();
      categories.forEach(cat => categoryMap.set(cat.id, cat.name));
      const productsWithCategoryName = products.map(product => ({
        ...product,
    
        category: categoryMap.get(product.categoryId) || 'Não encontrada'
      }));

      this.dataSource.data = productsWithCategoryName as IProduct[];
      console.log(productsWithCategoryName)
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditModal(product: IProduct): void {
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '800px',
      data: { ...product }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteProduct(product: IProduct): void {
    if (confirm(`Tem certeza que deseja apagar o produto ${product.name}?`)) {
      this.productsService.remove(product.id).subscribe(() => {
        this.loadData();
        alert('Produto apagado com sucesso!');
      });
    }
  }

  goToAddProduct(): void {
    this.router.navigate(['admin/produtos/novo']);
  }
}
