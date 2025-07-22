import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';

import { UsersService } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';
import { IUser } from '../../../core/interfaces/user/user.interface';
import { IRole } from '../../../core/interfaces/role/role.interface';
import { RolesService } from '../../../core/services/role.service';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatSelectModule
  ],
  templateUrl: './edit-user-modal.component.html',
})
export class EditUserModalComponent implements OnInit {

  editForm!: FormGroup;
  allRoles: IRole[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public user: IUser,
    private fb: FormBuilder,
    private usersService: UsersService,
    private rolesService: RolesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, Validators.required],
      cpf: [this.user.cpf, Validators.required],
      roleIds: [[]]
    });

    forkJoin({
      allRoles: this.rolesService.findAll(),
      userRoles: this.authService.getUserRoles(this.user.id)
    }).subscribe(({ allRoles, userRoles }) => {
      this.allRoles = allRoles;
      this.editForm.patchValue({ roleIds: userRoles });
    });
  }

  onSave(): void {
    if (this.editForm.invalid) {
      return;
    }

    const { roleIds, ...userData } = this.editForm.value;

    const updateObservables = [
      this.usersService.updateUser(this.user.id, userData),
      this.authService.setUserRoles(this.user.id, roleIds)
    ];

    forkJoin(updateObservables).subscribe(() => {
      this.dialogRef.close(true);
    });

    console.log('User updated successfully:', this.editForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
