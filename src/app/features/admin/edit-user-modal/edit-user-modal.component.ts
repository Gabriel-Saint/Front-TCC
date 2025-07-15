import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { User, UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule
  ],
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit {
  
  editForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private fb: FormBuilder,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [this.user.name, Validators.required],
      cpf: [this.user.cpf, Validators.required],
      phone: [this.user.phone, Validators.required],
      role: [this.user.role, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]]
    });
  }

  onSave(): void {
    if (this.editForm.valid) {
      const updatedUser = { ...this.user, ...this.editForm.value };
      this.usersService.updateUser(updatedUser).subscribe(result => {
        this.dialogRef.close(result);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
