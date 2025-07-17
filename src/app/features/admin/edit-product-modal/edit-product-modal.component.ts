import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

// 1. Importe tudo o que é necessário
import { environment } from '../../../../environments/environment';
import { ProductsService } from '../../../core/services/products.service';
import { CategoryService } from '../../../core/services/categories.service';
import { IProduct, IProductPayload } from '../../../core/interfaces/product/product.interface';
import { ICategory } from '../../../core/interfaces/category/category.interface';

@Component({
  selector: 'app-edit-product-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule
  ],
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['./edit-product-modal.component.scss']
})
export class EditProductModalComponent implements OnInit {

  editForm!: FormGroup;
  // imagePreview pode ser uma URL completa ou um base64 de um novo ficheiro
  imagePreview: string | ArrayBuffer | null = null;
  categorias: ICategory[] = [];

  // 2. Exponha a variável environment para ser usada no template
  public environment = environment;

  constructor(
    public dialogRef: MatDialogRef<EditProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public product: IProduct,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private categoryService: CategoryService // 3. Injete o CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    // 4. Inicialize o formulário com os nomes corretos dos campos
    this.editForm = this.fb.group({
      name: [this.product.name, Validators.required],
      categoryId: [this.product.categoryId, Validators.required],
      price: [this.product.price, [Validators.required, Validators.min(0.01)]],
      description: [this.product.description, Validators.required],
      image: [null] // Inicia como nulo, só terá valor se o usuário escolher uma nova imagem
    });

    // 5. Construa a URL completa da imagem atual para a pré-visualização inicial
    if (this.product.image) {
      this.imagePreview = this.environment.imageUrl + this.product.image;
    }
  }

  loadCategories(): void {
    this.categoryService.findAll().subscribe(cats => {
      this.categorias = cats;
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.editForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => { this.imagePreview = reader.result; };
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    if (this.editForm.valid) {
      const payload: IProductPayload = this.editForm.value;

      // Se o usuário não selecionou uma nova imagem, o campo 'image' será nulo.
      // Removemos ele do payload para que o backend não tente processar uma imagem nula.
      if (!payload.image) {
        delete payload.image;
      }

      this.productsService.update(this.product.id, payload).subscribe(result => {
        // Fecha o modal e retorna 'true' para indicar que a lista deve ser atualizada
        this.dialogRef.close(true);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
