import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsService } from '../../../core/services/products.service';
import { CategoryService} from '../../../core/services/categories.service';
import { CartService } from '../../../core/services/cart.service';
import { IProduct } from '../../../core/interfaces/product/product.interface';
import { ICategory } from '../../../core/interfaces/category/category.interface';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  allProducts: IProduct[] = []; // Guarda a lista original de produtos
  groupedProducts: { category: string, products: IProduct[] }[] = []; // Para exibição
  categories: ICategory[] = [];

  // Propriedades para controlar o estado dos filtros
  searchText: string = '';
  selectedCategory: string | null = null;

  constructor(
    private productsService: ProductsService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.categoryService.findAll().subscribe(cats => {
      this.categories = cats;
      this.productsService.findAll().subscribe(prods => {
        this.allProducts = prods; // Armazena a lista completa
        this.applyFilters(); // Aplica os filtros iniciais (mostra tudo)
      });
    });
  }

  // Função chamada ao digitar no campo de busca
  applySearchFilter(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  // Função chamada ao clicar em uma pílula de categoria
  selectCategory(categoryName: string | null): void {
    // Se clicar na mesma categoria, deseleciona para mostrar todas
    this.selectedCategory = this.selectedCategory === categoryName ? null : categoryName;
    this.applyFilters();
  }

  // Função central que aplica todos os filtros
  applyFilters(): void {
    let filteredProducts = [...this.allProducts]; // Começa com todos os produtos

    // 1. Filtra pela categoria selecionada
    if (this.selectedCategory) {
      filteredProducts = filteredProducts.filter(p => String(p.categoryId) === this.selectedCategory);
    }

    // 2. Filtra pelo texto de busca
    const searchTerm = this.searchText.trim().toLowerCase();
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // 3. Reagrupa os produtos filtrados para exibição
    this.groupProductsByCategory(filteredProducts);
  }

  // Modificada para agrupar uma lista de produtos fornecida
  groupProductsByCategory(productsToGroup: IProduct[]): void {
    const productMap = new Map<string, IProduct[]>();

    productsToGroup.forEach(product => {
      if (!productMap.has(String(product.categoryId))) {
        productMap.set(String(product.categoryId), []);
      }
      productMap.get(String(product.categoryId))!.push(product);
    });

    // Atualiza a lista que o template está exibindo
    this.groupedProducts = Array.from(productMap.entries()).map(([category, products]) => ({
      category,
      products
    }));
  }

  addToCart(product: IProduct): void {
    this.cartService.addItem(product);
  }
}
