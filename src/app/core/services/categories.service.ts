import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Interface para definir a estrutura de uma Categoria
export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private mockCategories: Category[] = [
    { id: 1, name: 'Lanches' },
    { id: 2, name: 'Acompanhamentos' },
    { id: 3, name: 'Bebidas' },
    { id: 4, name: 'Sobremesas' },
    { id: 5, name: 'Pizzas' },
  ];
  private nextId = 6;

  constructor() { }

  getCategories(): Observable<Category[]> {
    return of(this.mockCategories).pipe(delay(300));
  }

  addCategory(name: string): Observable<Category> {
    const newCategory: Category = { id: this.nextId++, name };
    this.mockCategories.push(newCategory);
    console.log('Categoria adicionada:', newCategory);
    return of(newCategory).pipe(delay(200));
  }

  updateCategory(updatedCategory: Category): Observable<Category> {
    const index = this.mockCategories.findIndex(c => c.id === updatedCategory.id);
    if (index > -1) {
      this.mockCategories[index] = updatedCategory;
    }
    console.log(`Categoria ${updatedCategory.id} atualizada.`);
    return of(updatedCategory).pipe(delay(200));
  }

  deleteCategory(categoryId: number): Observable<{ success: boolean }> {
    this.mockCategories = this.mockCategories.filter(c => c.id !== categoryId);
    console.log(`Categoria ${categoryId} deletada.`);
    return of({ success: true }).pipe(delay(200));
  }
}
