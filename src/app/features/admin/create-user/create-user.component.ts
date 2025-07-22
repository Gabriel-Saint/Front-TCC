import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, switchMap } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { RolesService } from '../../../core/services/role.service';
import { IRole } from '../../../core/interfaces/role/role.interface';

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
    private rolesService: RolesService
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
    
    const { roleIds, confirmacaoSenha, ...userPayload } = this.userForm.value;

    this.authService.register(userPayload).pipe(
      switchMap((response) => {
        const userId = response.user.id;
        if (roleIds && roleIds.length > 0) {
          return this.authService.setUserRoles(userId, roleIds);
        }
        return forkJoin([]);
      })
    ).subscribe({
      next: () => {
        alert('Usuário criado e funções atribuídas com sucesso!');
        this.router.navigate(['admin/usuarios']);
      },
      error: (err) => {
        console.error('Erro ao criar usuário:', err);
        alert(`Falha no registro: ${err.error.message || 'Tente novamente.'}`);
      }
    });
  }
}
