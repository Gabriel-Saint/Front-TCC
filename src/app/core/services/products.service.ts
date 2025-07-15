import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Interface para definir a estrutura de um produto
export interface Product {
  id: number;
  code: string;
  name: string;
  value: number;
  category: string;
  description: string;
  imageUrl: string; // URL da imagem do produto
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private mockProducts: Product[] = [
    { id: 1, code: '#566667', name: 'Hambúrguer Clássico', value: 25.50, category: 'Lanches', description: 'Pão, carne, queijo, alface e tomate.', imageUrl: 'https://placehold.co/150x150/F1C40F/333?text=Burger' },
    { id: 2, code: '#566668', name: 'Batata Frita Média', value: 12.00, category: 'Acompanhamentos', description: 'Porção de batata frita crocante.', imageUrl: 'https://placehold.co/150x150/E67E22/fff?text=Fritas' },
    { id: 3, code: '#566669', name: 'Refrigerante Lata', value: 5.00, category: 'Bebidas', description: 'Lata de 350ml.', imageUrl: 'https://placehold.co/150x150/3498DB/fff?text=Refri' },
    { id: 4, code: '#566670', name: 'Milkshake de Chocolate', value: 18.00, category: 'Sobremesas', description: 'Milkshake cremoso de chocolate.', imageUrl: 'https://placehold.co/150x150/9B59B6/fff?text=Shake' },
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts).pipe(delay(400));
  }

  updateProduct(updatedProduct: Product): Observable<Product> {
    const index = this.mockProducts.findIndex(p => p.id === updatedProduct.id);
    if (index > -1) {
      this.mockProducts[index] = updatedProduct;
    }
    console.log(`Produto ${updatedProduct.id} atualizado.`);
    return of(updatedProduct).pipe(delay(300));
  }

  deleteProduct(productId: number): Observable<{ success: boolean }> {
    this.mockProducts = this.mockProducts.filter(p => p.id !== productId);
    console.log(`Produto ${productId} deletado.`);
    return of({ success: true }).pipe(delay(300));
  }
}
