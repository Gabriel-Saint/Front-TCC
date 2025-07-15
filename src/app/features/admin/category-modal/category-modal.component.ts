import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Category, CategoriesService } from '../../../core/services/categories.service';

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
    @Inject(MAT_DIALOG_DATA) public data: Category | null,
    private fb: FormBuilder,
    private categoriesService: CategoriesService
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
      this.categoriesService.updateCategory(updatedCategory).subscribe(result => {
        this.dialogRef.close(result);
      });
    } else {
      this.categoriesService.addCategory(categoryName).subscribe(result => {
        this.dialogRef.close(result);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
