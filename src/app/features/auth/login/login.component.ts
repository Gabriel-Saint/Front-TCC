// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';

// // 1. Importe o serviço e a interface necessários
// import { AuthService } from '../../../core/services/auth.service';
// import { IAuthSignIn } from '../../../core/interfaces/auth/auth.inteface';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule
//   ],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent implements OnInit {

//   loginForm!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private authService: AuthService
//   ) { }

//   ngOnInit(): void {

//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }

//   onSubmit(): void {
//     if (this.loginForm.valid) {
//       const payload: IAuthSignIn = this.loginForm.value;

//       this.authService.login(payload).subscribe({
//         next: (response) => {
//           console.log('Login bem-sucedido!', response);
//           this.router.navigate(['/admin/dashboard']);
//         },
//         error: (err) => {
//           console.error('Falha no login', err);
//           alert(`Falha no login: ${err.error.message || 'Email ou senha inválidos.'}`);
//         }
//       });

//     } else {
//       console.log('Formulário inválido. Por favor, verifique os campos.');
//       this.loginForm.markAllAsTouched();
//     }
//   }


//   get email() {
//     return this.loginForm.get('email');
//   }

//   get password() {
//     return this.loginForm.get('password');
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// 1. Importe o serviço e a interface necessários
import { AuthService } from '../../../core/services/auth.service';
import { IAuthSignIn } from '../../../core/interfaces/auth/auth.inteface';

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
    private router: Router, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const payload: IAuthSignIn = this.loginForm.value;

      this.authService.login(payload).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido!', response);



        },
        error: (err) => {
          console.error('Falha no login', err);
          // Use um feedback melhor para o usuário do que 'alert' se possível
          alert(`Falha no login: ${err.error?.message || 'Email ou senha inválidos.'}`);
        }
      });

    } else {
      console.log('Formulário inválido. Por favor, verifique os campos.');
      this.loginForm.markAllAsTouched();
    }
  }


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
