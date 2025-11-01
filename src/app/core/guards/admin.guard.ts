import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
// Ajuste o caminho para o seu auth.service.ts
import { AuthService } from '../services/auth.service'; 

/**
 * Este guarda protege rotas que são EXCLUSIVAS do adm
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  console.warn('AdminGuard: Acesso negado. Rota exclusiva para Administradores.');
  
  router.navigate(['/admin/pedidos']);
  
  return false;
};
