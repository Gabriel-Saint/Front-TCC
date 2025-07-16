import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/categories.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { ICategory } from '../../../core/interfaces/category/category.interface';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<ICategory>();
  isLoading = true;

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.categoryService.findAll().subscribe(categories => {
      this.dataSource.data = categories;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openCategoryModal(category?: ICategory): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '400px',
      data: category ? { ...category } : null // Passa a categoria para editar, ou null para adicionar
    });

    dialogRef.afterClosed().subscribe((result: ICategory) => {
      if (result) {
        if (category) { // Editando
          const index = this.dataSource.data.findIndex(c => c.id === result.id);
          if (index > -1) {
            const currentData = this.dataSource.data;
            currentData[index] = result;
            this.dataSource.data = currentData;
          }
        } else { // Adicionando
          this.dataSource.data = [...this.dataSource.data, result];
        }
      }
    });
  }

  deleteCategory(category: ICategory): void {
    if (confirm(`Tem certeza que deseja apagar a categoria "${category.name}"?`)) {
      this.categoryService.remove(String(category.id)).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(c => c.id !== category.id);
      });
    }
  }
}
