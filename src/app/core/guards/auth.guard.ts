// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';


// export const authGuard: CanActivateFn = (route, state) => {
  
//   const authService = inject(AuthService);
//   const router = inject(Router);

  
//   if (authService.isAuthenticated()) {
   
//     return true;
//   } else {
  
//     console.log('Acesso negado. Redirecionando para /login');
//     router.navigate(['/login']);
    
//     return false;
//   }
// };

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ajuste o caminho se necessário

/**
 * Este guarda protege as rotas que exigem autenticação.
 * Ele permite a passagem se o usuário estiver logado E
 * for um 'ADMINISTRADOR' OU 'COLABORADOR'.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se o usuário está autenticado E tem uma das roles permitidas
  if (authService.isAuthenticated() && (authService.isAdmin() || authService.isStaff())) {
    return true; // <-- Usuário permitido!
  }

  // Se não estiver autenticado ou não tiver a role correta, nega o acesso.
  console.error('AuthGuard: Acesso negado. Usuário não autenticado ou sem permissão.');
  
  // Envia para o login
  authService.logout(); 
  
  // Você também pode retornar a URL de login
  // return router.parseUrl('/login');
  
  return false;
};
