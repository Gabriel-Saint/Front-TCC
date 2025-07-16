import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {CategoryService } from '../../../core/services/categories.service';
import { ICategory, ICategoryPayload } from '../../../core/interfaces/category/category.interface';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule
  ],
  templateUrl: './category-modal.component.html'
})
export class CategoryModalComponent implements OnInit {

  form!: FormGroup;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<CategoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICategory | null,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.isEditMode = !!this.data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required]
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      return;
    }

    const categoryName = this.form.value.name;

    if (this.isEditMode && this.data) {
      const updatedCategory = { ...this.data, name: categoryName };
      this.categoryService.update(String(this.data.id), updatedCategory).subscribe(result => {
        this.dialogRef.close(result);
      });
    } else {
      const payload: ICategoryPayload = { name: this.form.value.name };
      this.categoryService.create(payload).subscribe(result => {
        console.log('Categoria criada:', result);
        this.dialogRef.close(result);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
