import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// 1. Importe o AuthService e a interface IAuthSignUp
import { AuthService } from '../../../core/services/auth.service';
import { IAuthSignUp } from '../../../core/interfaces/auth/auth.inteface';

// Imports do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Validador de senha
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
    // 2. Injete o AuthService aqui
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      // funcao: ['', [Validators.required]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmacaoSenha: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
     
      const payload: IAuthSignUp = {
        name: this.userForm.value.name,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        cpf: this.userForm.value.cpf,
        phone: this.userForm.value.phone,
      };

      this.authService.register(payload).subscribe({
        next: () => {
         
          alert('Usuário criado com sucesso!');
          console.log('Usuário criado com sucesso:', payload);
          
          this.router.navigate(['/login']);
        },
        error: (err) => {
        
          console.error('Erro ao registrar usuário:', err);
          
          alert(`Falha no registro: ${err.error.message || 'Tente novamente.'}`);
        }
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}