// import { Component, OnInit } from '@angular/core';
// import { CommonModule, CurrencyPipe } from '@angular/common';
// import { MatIconModule } from '@angular/material/icon';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { ProductsService } from '../../../core/services/products.service';
// import { CategoryService } from '../../../core/services/categories.service';
// import { CartService } from '../../../core/services/cart.service';
// import { IProduct } from '../../../core/interfaces/product/product.interface';
// import { ICategory } from '../../../core/interfaces/category/category.interface';
// import { environment } from '../../../../environments/environment'; // 1. Importe o environment

// @Component({
//   selector: 'app-menu',
//   standalone: true,
//   imports: [CommonModule, CurrencyPipe, MatIconModule, MatFormFieldModule, MatInputModule],
//   templateUrl: './menu.component.html',
//   styleUrls: ['./menu.component.scss']
// })
// export class MenuComponent implements OnInit {

//   allProducts: IProduct[] = [];
//   groupedProducts: { category: string, products: IProduct[] }[] = [];
//   categories: ICategory[] = [];
//   searchText: string = '';
//   selectedCategory: string | null = null;

//   public environment = environment;

//   constructor(
//     private productsService: ProductsService,
//     private categoryService: CategoryService,
//     private cartService: CartService
//   ) { }

//   ngOnInit(): void {
//     this.categoryService.findAll().subscribe(cats => {
//       this.categories = cats;
//       this.productsService.findAll().subscribe(prods => {
//         this.allProducts = prods;
//         this.applyFilters();
//       });
//     });
//   }

//   applySearchFilter(event: Event): void {
//     this.searchText = (event.target as HTMLInputElement).value;
//     this.applyFilters();
//   }

//   selectCategory(categoryName: string | null): void {
//     this.selectedCategory = this.selectedCategory === categoryName ? null : categoryName;
//     this.applyFilters();
//   }

//   applyFilters(): void {
//     let filteredProducts = [...this.allProducts];

//     if (this.selectedCategory) {
//       // Ajuste para encontrar o ID da categoria pelo nome
//       const categoryId = this.categories.find(c => c.name === this.selectedCategory)?.id;
//       if (categoryId) {
//         filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
//       }
//     }

//     const searchTerm = this.searchText.trim().toLowerCase();
//     if (searchTerm) {
//       filteredProducts = filteredProducts.filter(p =>
//         p.name.toLowerCase().includes(searchTerm) ||
//         (p.description && p.description.toLowerCase().includes(searchTerm))
//       );
//     }

//     this.groupProductsByCategory(filteredProducts);
//   }

//   groupProductsByCategory(productsToGroup: IProduct[]): void {
//     const categoryMap = new Map<number, ICategory>();
//     this.categories.forEach(cat => categoryMap.set(cat.id, cat));

//     const productMap = new Map<string, IProduct[]>();

//     productsToGroup.forEach(product => {
//       const categoryName = categoryMap.get(product.categoryId)?.name || 'Sem Categoria';
//       if (!productMap.has(categoryName)) {
//         productMap.set(categoryName, []);
//       }
//       productMap.get(categoryName)!.push(product);
//     });

//     this.groupedProducts = Array.from(productMap.entries()).map(([category, products]) => ({
//       category,
//       products
//     }));
//   }

//   addToCart(product: IProduct): void {
//     this.cartService.addItem(product);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsService } from '../../../core/services/products.service';
import { CategoryService } from '../../../core/services/categories.service';
import { CartService } from '../../../core/services/cart.service';
import { IProduct } from '../../../core/interfaces/product/product.interface';
import { ICategory } from '../../../core/interfaces/category/category.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  allProducts: IProduct[] = [];
  groupedProducts: { category: string, products: IProduct[] }[] = [];
  categories: ICategory[] = [];
  searchText: string = '';
  selectedCategory: string | null = null;

  public environment = environment;

  constructor(
    private productsService: ProductsService,
    private categoryService: CategoryService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.categoryService.findAll().subscribe(cats => {

      this.categories = cats.sort((a, b) => a.id - b.id);

      this.productsService.findAll().subscribe(prods => {
        this.allProducts = prods;
        this.applyFilters();
      });
    });
  }

  applySearchFilter(event: Event): void {
    this.searchText = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  selectCategory(categoryName: string | null): void {
    this.selectedCategory = this.selectedCategory === categoryName ? null : categoryName;
    this.applyFilters();
  }

  applyFilters(): void {
    let filteredProducts = [...this.allProducts];

    if (this.selectedCategory) {
      const categoryId = this.categories.find(c => c.name === this.selectedCategory)?.id;
      if (categoryId) {
        filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
      }
    }

    const searchTerm = this.searchText.trim().toLowerCase();
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }

    this.groupProductsByCategory(filteredProducts);
  }


  groupProductsByCategory(productsToGroup: IProduct[]): void {
    const finalGroups: { category: string, products: IProduct[] }[] = [];


    this.categories.forEach(category => {


      const productsInCategory = productsToGroup.filter(p => p.categoryId === category.id);


      if (productsInCategory.length > 0) {
        finalGroups.push({
          category: category.name,
          products: productsInCategory
        });
      }
    });


    const uncategorizedProducts = productsToGroup.filter(p => !this.categories.some(c => c.id === p.categoryId));
    if (uncategorizedProducts.length > 0) {
      finalGroups.push({
        category: 'Sem Categoria',
        products: uncategorizedProducts
      });
    }

    this.groupedProducts = finalGroups;
  }

  addToCart(product: IProduct): void {
    this.cartService.addItem(product);
  }
}

