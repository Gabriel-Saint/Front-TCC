import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IRole } from '../../../core/interfaces/role/role.interface';
import { RolesService } from '../../../core/services/role.service';

@Component({
  selector: 'app-role-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule
  ],
  templateUrl: './role-modal.component.html'
})
export class RoleModalComponent implements OnInit {

  form!: FormGroup;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<RoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IRole | null,
    private fb: FormBuilder,
    private rolesService: RolesService
  ) {
    this.isEditMode = !!this.data;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data?.name || '', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      return;
    }

    const payload = this.form.value;

    const action = this.isEditMode && this.data
      ? this.rolesService.update(this.data.id, payload)
      : this.rolesService.create(payload);

    action.subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
