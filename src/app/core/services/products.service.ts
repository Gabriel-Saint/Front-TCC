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
  { id: 1, code: '#566667', name: 'Hambúrguer Clássico', value: 25.50, category: 'Lanches', description: 'Pão brioche, hambúrguer de 150g, queijo prato, alface e tomate.', imageUrl: 'https://placehold.co/150x150/F1C40F/333?text=Burger' },
  { id: 2, code: '#566668', name: 'Batata Frita Média', value: 12.00, category: 'Acompanhamentos', description: 'Porção de batata frita crocante e sequinha.', imageUrl: 'https://placehold.co/150x150/E67E22/fff?text=Fritas' },
  { id: 3, code: '#566669', name: 'Refrigerante Lata', value: 5.00, category: 'Bebidas', description: 'Lata de 350ml, diversos sabores.', imageUrl: 'https://placehold.co/150x150/3498DB/fff?text=Refri' },
  { id: 4, code: '#566670', name: 'Milkshake de Chocolate', value: 18.00, category: 'Sobremesas', description: 'Milkshake cremoso de chocolate com cobertura.', imageUrl: 'https://placehold.co/150x150/9B59B6/fff?text=Shake' },
  { id: 5, code: '#566671', name: 'X-Bacon Especial', value: 29.90, category: 'Lanches', description: 'Pão brioche, hambúrguer de 150g, cheddar, bacon crocante e molho especial.', imageUrl: 'https://placehold.co/150x150/D35400/fff?text=X-Bacon' },
  { id: 6, code: '#566672', name: 'Anéis de Cebola', value: 15.00, category: 'Acompanhamentos', description: 'Anéis de cebola empanados e fritos, acompanha molho barbecue.', imageUrl: 'https://placehold.co/150x150/F39C12/fff?text=Onion+Rings' },
  { id: 7, code: '#566673', name: 'Suco Natural de Laranja', value: 8.00, category: 'Bebidas', description: 'Copo de 500ml, feito na hora.', imageUrl: 'https://placehold.co/150x150/F39C12/fff?text=Suco' },
  { id: 8, code: '#566674', name: 'Brownie com Sorvete', value: 22.00, category: 'Sobremesas', description: 'Brownie quente com uma bola de sorvete de creme.', imageUrl: 'https://placehold.co/150x150/795548/fff?text=Brownie' },
  { id: 9, code: '#566675', name: 'Pizza de Calabresa', value: 45.00, category: 'Pizzas', description: 'Molho de tomate, mussarela e calabresa fatiada.', imageUrl: 'https://placehold.co/150x150/E74C3C/fff?text=Pizza' },
  { id: 10, code: '#566676', name: 'Pizza de Frango com Catupiry', value: 48.00, category: 'Pizzas', description: 'Molho de tomate, mussarela, frango desfiado e catupiry.', imageUrl: 'https://placehold.co/150x150/F1C40F/333?text=Pizza+Frango' },
  { id: 11, code: '#566677', name: 'Coxinha de Frango', value: 6.00, category: 'Acompanhamentos', description: 'Coxinha crocante recheada com frango.', imageUrl: 'https://placehold.co/150x150/FF9800/fff?text=Coxinha' },
  { id: 12, code: '#566678', name: 'Pudim de Leite', value: 10.00, category: 'Sobremesas', description: 'Fatias de pudim tradicional com calda de caramelo.', imageUrl: 'https://placehold.co/150x150/FFC107/333?text=Pudim' },
  { id: 13, code: '#566679', name: 'Cheeseburger Duplo', value: 32.00, category: 'Lanches', description: 'Dois hambúrgueres, queijo cheddar e pão com gergelim.', imageUrl: 'https://placehold.co/150x150/FF5722/fff?text=Cheese+Duplo' },
  { id: 14, code: '#566680', name: 'Água Mineral 500ml', value: 3.00, category: 'Bebidas', description: 'Garrafa de água sem gás.', imageUrl: 'https://placehold.co/150x150/00BCD4/fff?text=Água' },
  { id: 15, code: '#566681', name: 'Pastel de Carne', value: 7.50, category: 'Acompanhamentos', description: 'Pastel recheado com carne moída temperada.', imageUrl: 'https://placehold.co/150x150/A1887F/fff?text=Pastel' },
  { id: 16, code: '#566682', name: 'Sorvete de Morango', value: 9.00, category: 'Sobremesas', description: 'Sorvete de morango artesanal com calda de frutas.', imageUrl: 'https://placehold.co/150x150/E91E63/fff?text=Sorvete' },
  { id: 17, code: '#566683', name: 'Combo Família', value: 89.90, category: 'Lanches', description: '3 hambúrgueres, 2 porções de fritas e 3 refrigerantes.', imageUrl: 'https://placehold.co/150x150/8BC34A/333?text=Combo' },
  { id: 18, code: '#566684', name: 'Pizza Quatro Queijos', value: 49.00, category: 'Pizzas', description: 'Mussarela, provolone, parmesão e gorgonzola.', imageUrl: 'https://placehold.co/150x150/FFF176/333?text=Pizza+4Q' },
  { id: 19, code: '#566685', name: 'Esfiha de Calabresa', value: 5.50, category: 'Acompanhamentos', description: 'Esfiha assada com recheio de calabresa.', imageUrl: 'https://placehold.co/150x150/FF7043/fff?text=Esfiha' },
  { id: 20, code: '#566686', name: 'Milkshake de Morango', value: 18.00, category: 'Sobremesas', description: 'Milkshake de morango com chantilly.', imageUrl: 'https://placehold.co/150x150/F06292/fff?text=Shake+Morango' },
  { id: 21, code: '#566687', name: 'X-Salada Completo', value: 27.00, category: 'Lanches', description: 'Hambúrguer, queijo, presunto, ovo, alface e tomate.', imageUrl: 'https://placehold.co/150x150/4CAF50/fff?text=X-Salada' },
  { id: 22, code: '#566688', name: 'Cerveja Long Neck', value: 7.50, category: 'Bebidas', description: 'Garrafa de 330ml, bem gelada.', imageUrl: 'https://placehold.co/150x150/795548/fff?text=Cerveja' },
  { id: 23, code: '#566689', name: 'Torta de Limão', value: 14.00, category: 'Sobremesas', description: 'Torta com recheio de limão e cobertura de merengue.', imageUrl: 'https://placehold.co/150x150/C5E1A5/333?text=Torta' },
  { id: 24, code: '#566690', name: 'Nuggets de Frango', value: 11.00, category: 'Acompanhamentos', description: 'Nuggets crocantes com molho.', imageUrl: 'https://placehold.co/150x150/FBC02D/fff?text=Nuggets' },
  { id: 25, code: '#566691', name: 'Pizza Portuguesa', value: 50.00, category: 'Pizzas', description: 'Presunto, ovo, cebola, pimentão e azeitonas.', imageUrl: 'https://placehold.co/150x150/FDD835/333?text=Portuguesa' },
  { id: 26, code: '#566692', name: 'Wrap de Frango', value: 20.00, category: 'Lanches', description: 'Tortilla recheada com frango grelhado e salada.', imageUrl: 'https://placehold.co/150x150/CDDC39/333?text=Wrap' },
  { id: 27, code: '#566693', name: 'Hot-Dog Tradicional', value: 9.90, category: 'Lanches', description: 'Pão, salsicha, molho e batata palha.', imageUrl: 'https://placehold.co/150x150/E53935/fff?text=Dog' },
  { id: 28, code: '#566694', name: 'Tapioca com Coco e Leite Condensado', value: 13.00, category: 'Sobremesas', description: 'Tapioca doce recheada.', imageUrl: 'https://placehold.co/150x150/FFEB3B/333?text=Tapioca' },
  { id: 29, code: '#566695', name: 'Porção de Mandioca Frita', value: 14.00, category: 'Acompanhamentos', description: 'Mandioca frita crocante e dourada.', imageUrl: 'https://placehold.co/150x150/FFF59D/333?text=Mandioca' },
  { id: 30, code: '#566696', name: 'Pizza Marguerita', value: 42.00, category: 'Pizzas', description: 'Tomate, mussarela, manjericão e orégano.', imageUrl: 'https://placehold.co/150x150/A5D6A7/333?text=Marguerita' }
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
