import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// 1. Importe o serviço e a interface
import { AuthService } from '../../../core/services/auth.service';
import { IAuthSignUp } from '../../../core/interfaces/auth/auth.inteface';


export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  // CORREÇÃO: Usar 'password' para consistência
  const password = control.get('password');
  const confirmacaoSenha = control.get('confirmacaoSenha');

  if (password?.pristine || confirmacaoSenha?.pristine) {
    return null;
  }

  return password && confirmacaoSenha && password.value !== confirmacaoSenha.value
    ? { passwordMismatch: true }
    : null;
};


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // CORREÇÃO: Renomeado para 'authService' por convenção
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // CORREÇÃO: Os nomes dos campos agora correspondem à interface IAuthSignUp
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmacaoSenha: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Agora podemos usar o valor do formulário diretamente, pois os nomes correspondem.
      // Apenas precisamos remover 'confirmacaoSenha' que não vai para a API.
      const { confirmacaoSenha, ...payload } = this.registerForm.value;

      this.authService.register(payload).subscribe({
        next: () => {
          alert('Cadastro realizado com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro no cadastro:', err);
          alert(`Falha no cadastro: ${err.error.message || 'Verifique os dados e tente novamente.'}`);
        }
      });
    } else {
      console.log('Formulário inválido.');
      this.registerForm.markAllAsTouched();
    }
  }

  // CORREÇÃO: Getters atualizados para os novos nomes de campos
  get name() { return this.registerForm.get('name'); }
  get cpf() { return this.registerForm.get('cpf'); }
  get email() { return this.registerForm.get('email'); }
  get phone() { return this.registerForm.get('phone'); }
  get password() { return this.registerForm.get('password'); }
  get confirmacaoSenha() { return this.registerForm.get('confirmacaoSenha'); }
}
