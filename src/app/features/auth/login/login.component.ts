import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
 
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
    
    ) {}

  ngOnInit(): void {
   
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulário enviado!', this.loginForm.value);
      // serviço de autenticação
      // Apenas para demonstração, vamos navegar para o dashboard
      this.router.navigate(['/admin/dashboard']);

    } else {
      console.log('Formulário inválido. Por favor, verifique os campos.');
      // Opcional: Marcar todos os campos como "tocados" para exibir os erros
      this.loginForm.markAllAsTouched();
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get senha() {
    return this.loginForm.get('senha');
  }
}