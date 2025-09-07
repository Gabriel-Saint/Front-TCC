import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Imports do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // Import para o toggle de visibilidade

// Serviços e Interfaces
import { CategoryService } from '../../../core/services/categories.service';
import { ProductsService } from '../../../core/services/products.service';
import { IProduct, IProductPayload} from '../../../core/interfaces/product/product.interface'; 
import { ICategory} from '../../../core/interfaces/category/category.interface'; 
import { ConfirmationModalData } from '../../../core/interfaces/modal/confirmation-modal.interface';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Módulos do Material
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule 
  ],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  categorias: ICategory[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private productsService: ProductsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.loadCategories();

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      image: [null, Validators.required],
      categoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      visibility: [true, Validators.required] // Valor padrão 'true'
    });
  }

  loadCategories(): void {
    this.categoryService.findAll().subscribe(cats => {
      this.categorias = cats;
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.productForm.patchValue({ image: file });
      this.productForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.productForm.patchValue({ image: null });
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      console.log('Formulário inválido.');
      this.productForm.markAllAsTouched();
      return;
    }

    const payload: IProductPayload = this.productForm.value;

    this.productsService.create(payload).subscribe({
      
      next: () => {
        this.showSuccessModal();
      },
      error: (err) => {
        console.log('Erro:', payload);
        console.error('Falha ao cadastrar produto:', err);
        alert(`Falha no cadastro: ${err.error.message || 'Verifique os dados e tente novamente.'}`);
      }
    });
  }
   showSuccessModal(): void {
    const dialogData: ConfirmationModalData = {
      title: 'Produto Criado com Sucesso!',
      message: 'O novo produto foi criado e está disponível no sistema.',
      icon: 'check_circle',
      confirmButtonText: 'OK'
    }

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['admin/produtos']);
    });
      
  }

}
