import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

// Importando suas interfaces
import { IAuthSignIn, IAuthSignUp, IAuthResponse } from '../../core/interfaces/auth/auth.inteface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL da API vinda do arquivo de environment
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'accessToken';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Envia as credenciais de login para a API.
   * @param payload Os dados de email e senha do usuário.
   * @returns Um Observable com a resposta da autenticação (incluindo o token).
   */
  login(payload: IAuthSignIn): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/signin`, payload).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  /**
   * Envia os dados de registro de um novo usuário para a API.
   * @param payload Os dados do novo usuário.
   * @returns Um Observable (geralmente vazio ou com uma mensagem de sucesso).
   */
  register(payload: IAuthSignUp): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, payload);
  }

  /**
   * Remove o token de autenticação e redireciona o usuário para a tela de login.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  /**
   * Salva o token de acesso no localStorage.
   * @param token O token JWT recebido da API.
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Recupera o token de acesso do localStorage.
   * @returns O token, ou null se não existir.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Verifica se o usuário está autenticado (se existe um token).
   * @returns `true` se um token existir, `false` caso contrário.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
