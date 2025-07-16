import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Interceptor funcional para adicionar o token JWT às requisições
 * e tratar erros de autenticação (401).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isApiUrl = req.url.startsWith(environment.apiUrl);

  if (token && isApiUrl) {
    // Clona a requisição original e adiciona o cabeçalho de autorização.
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedReq).pipe(
      catchError((error: any) => {
        // Se receber um erro 401 (Não Autorizado)...
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // ...desloga o usuário. O serviço de auth irá limpar o token
          // e redirecionar para a página de login.
          console.error('Token inválido ou expirado. Fazendo logout automático.');
          authService.logout();
        }
        // Propaga o erro para que outros possam tratá-lo se necessário.
        return throwError(() => error);
      })
    );
  }

  // Se não houver token ou a requisição não for para a nossa API,
  // apenas a deixa passar sem modificação.
  return next(req);
};
