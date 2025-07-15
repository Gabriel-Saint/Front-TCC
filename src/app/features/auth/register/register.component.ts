import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';


export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const senha = control.get('senha');
  const confirmacaoSenha = control.get('confirmacaoSenha');

  // Se os campos ainda não foram tocados, não valide
  if (senha?.pristine || confirmacaoSenha?.pristine) {
    return null;
  }

  // Retorna um erro se os valores não baterem
  return senha && confirmacaoSenha && senha.value !== confirmacaoSenha.value
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
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
    if (this.registerForm.valid) {
      console.log('Formulário de cadastro enviado!', this.registerForm.value);
      // Aqui você chamaria seu serviço para criar a conta
      // e depois navegaria para a tela de login ou dashboard
      this.router.navigate(['/login']);
    } else {
      console.log('Formulário inválido.');
      this.registerForm.markAllAsTouched();
    }
  }

  // Getters para facilitar o acesso no template
  get nome() { return this.registerForm.get('nome'); }
  get cpf() { return this.registerForm.get('cpf'); }
  get email() { return this.registerForm.get('email'); }
  get telefone() { return this.registerForm.get('telefone'); }
  get funcao() { return this.registerForm.get('funcao'); }
  get senha() { return this.registerForm.get('senha'); }
  get confirmacaoSenha() { return this.registerForm.get('confirmacaoSenha'); }
}