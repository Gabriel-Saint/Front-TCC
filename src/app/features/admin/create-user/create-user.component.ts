import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../../core/services/users.service'; // Reutilizando o serviço de usuários

// Imports do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Validador de senha (pode ser movido para um arquivo de helpers no futuro)
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const senha = control.get('senha');
  const confirmacaoSenha = control.get('confirmacaoSenha');
  return senha && confirmacaoSenha && senha.value !== confirmacaoSenha.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nome: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      funcao: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmacaoSenha: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Novo usuário a ser criado:', this.userForm.value);
      // Aqui você chamaria o serviço para adicionar o usuário
      // this.usersService.createUser(this.userForm.value).subscribe(() => {
      //   this.router.navigate(['/admin/usuarios']);
      // });
      alert('Usuário criado com sucesso! (Simulação)');
      this.router.navigate(['/admin/usuarios']);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
