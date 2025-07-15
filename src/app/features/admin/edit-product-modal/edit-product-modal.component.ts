import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Product, ProductsService } from '../../../core/services/products.service';

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
  imagePreview: string | ArrayBuffer | null = null;
  categorias = ['Lanches', 'Acompanhamentos', 'Bebidas', 'Sobremesas']; // Exemplo

  constructor(
    public dialogRef: MatDialogRef<EditProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public product: Product,
    private fb: FormBuilder,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [this.product.name, Validators.required],
      category: [this.product.category, Validators.required],
      value: [this.product.value, [Validators.required, Validators.min(0.01)]],
      description: [this.product.description, Validators.required],
      image: [null] // Inicia como nulo, o usuário pode ou não trocar
    });
    this.imagePreview = this.product.imageUrl; // Mostra a imagem atual
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

  removeImage(): void {
    this.editForm.patchValue({ image: null });
    this.imagePreview = null;
  }

  onSave(): void {
    if (this.editForm.valid) {
      // Combina os dados originais com os do formulário
      const updatedProductData = { ...this.product, ...this.editForm.value };
      // Aqui você faria a lógica de upload da imagem se uma nova foi selecionada
      // e então chamaria o serviço
      this.productsService.updateProduct(updatedProductData).subscribe(result => {
        this.dialogRef.close(result);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
