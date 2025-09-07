import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../../core/services/auth.service';
import { RolesService } from '../../../core/services/role.service';
import { IRole } from '../../../core/interfaces/role/role.interface';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalData } from '../../../core/interfaces/modal/confirmation-modal.interface';
import { IAuthSignUp } from '../../../core/interfaces/auth/auth.inteface';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmacaoSenha = control.get('confirmacaoSenha');
  return password && confirmacaoSenha && password.value !== confirmacaoSenha.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  userForm!: FormGroup;
  allRoles: IRole[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private rolesService: RolesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmacaoSenha: ['', [Validators.required]],
      roleIds: [[]]
    }, {
      validators: passwordMatchValidator
    });

    this.rolesService.findAll().subscribe(roles => {
      this.allRoles = roles;
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    
    const formValue = this.userForm.value;

    const payload: IAuthSignUp = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password,
      cpf: String(formValue.cpf).replace(/\D/g, ''),
      phone: String(formValue.phone).replace(/\D/g, ''),
      roleIds: formValue.roleIds
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.showSuccessModal();
      },
      error: (err: HttpErrorResponse) => {
        this.showErrorModal(err);
      }
    });
  }

  showSuccessModal(): void {
    const dialogData: ConfirmationModalData = {
      title: 'Usuário Criado com Sucesso!',
      message: 'O novo usuário foi criado e as funções foram atribuídas.',
      icon: 'check_circle',
      confirmButtonText: 'OK'
    };

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['admin/usuarios']);
    });
  }

  private showErrorModal(error: HttpErrorResponse): void {
    let message = 'Ocorreu um erro ao criar o usuário. Tente novamente.';

    if (error.error && Array.isArray(error.error.message)) {
      const errorMessages = error.error.message.join(', ');
      
      if (errorMessages.toLowerCase().includes('cpf')) {
        message = 'CPF preenchido incorretamente. Verifique se possui 11 dígitos e contém apenas números.';
      } else {
        message = errorMessages;
      }
    } else if (error.error && typeof error.error.message === 'string') {
      message = error.error.message;
    }

    const dialogData: ConfirmationModalData = {
      title: 'Falha no Registro',
      message: message,
      icon: 'error',
      confirmButtonText: 'OK'
    };

    this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: dialogData
    });
  }
}

