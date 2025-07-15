import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Imports do Angular Material para o formulário
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

  productForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;

  // Dados mocados para as categorias 
  categorias = [
    { id: 1, nome: 'Lanches' },
    { id: 2, nome: 'Bebidas' },
    { id: 3, nome: 'Sobremesas' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
    // private productService: ProductService // No futuro
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      imagem: [null, Validators.required],
      categoria: ['', Validators.required],
      preco: ['', [Validators.required, Validators.min(0.01)]],
      descricao: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.productForm.patchValue({ imagem: file });
      this.productForm.get('imagem')?.updateValueAndValidity();

      // Gera a pré-visualização da imagem
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.productForm.patchValue({ imagem: null });
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      console.log('Formulário enviado:', this.productForm.value);
      // Aqui você enviaria os dados para um serviço
      // const formData = new FormData();
      // Object.keys(this.productForm.value).forEach(key => {
      //   formData.append(key, this.productForm.value[key]);
      // });
      // this.productService.create(formData).subscribe(() => ...);
      
      alert('Produto cadastrado com sucesso!'); // Apenas para demonstração
      this.router.navigate(['/admin/produtos']); // Exemplo de navegação
    } else {
      console.log('Formulário inválido.');
    }
  }
}
