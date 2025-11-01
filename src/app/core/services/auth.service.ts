// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { Observable, tap } from 'rxjs';
// import { environment } from '../../../environments/environment';

// import { IAuthSignIn, IAuthSignUp, IAuthResponse } from '../../core/interfaces/auth/auth.inteface';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = `${environment.apiUrl}/auth`;
//   private readonly TOKEN_KEY = 'accessToken';

//   constructor(
//     private http: HttpClient,
//     private router: Router
//   ) { }

//   /**
//    * @param payload 
//    * @returns 
//    */
//   login(payload: IAuthSignIn): Observable<IAuthResponse> {
//     return this.http.post<IAuthResponse>(`${this.apiUrl}/signin`, payload).pipe(
//       tap(response => {
//         this.setToken(response.token);
//       })
//     );
//   }

//   /**
//    * @param payload 
//    * @returns 
//    */
//   register(payload: IAuthSignUp): Observable<any> {
//     return this.http.post(`${this.apiUrl}/signup`, payload);
//   }

//   /**
//    */
//   logout(): void {
//     localStorage.removeItem(this.TOKEN_KEY);
//     this.router.navigate(['/login']);
//   }

//   /**
//    *
//    * @param token 
//    */
//   private setToken(token: string): void {
//     localStorage.setItem(this.TOKEN_KEY, token);
//   }

//   /**
//    * 
//    * @returns 
//    */
//   getToken(): string | null {
//     return localStorage.getItem(this.TOKEN_KEY);
//   }

//   /**
//    * 
//    * @returns
//    */
//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   }

//   /**
//    *
//    * @param userId 
//    * @returns 
//    */
//   getUserRoles(userId: number): Observable<number[]> {
//     return this.http.get<number[]>(`${this.apiUrl}/users/${userId}/roles`);
//   }

//   /**
//    * 
//    * @param userId 
//    * @param roleIds 
//    */
//   setUserRoles(userId: number, roleIds: number[]): Observable<any> {
//     const payload = { roleIds };
//     return this.http.put(`${this.apiUrl}/users/${userId}/roles`, payload);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { IAuthSignIn, IAuthSignUp, IAuthResponse } from '../../core/interfaces/auth/auth.inteface';

interface JwtPayload {
  id: number;
  name: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

// Dados do usuário que vamos armazenar
export interface IUser {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'accessToken';
  private readonly USER_KEY = 'currentUser'; // <-- Para guardar o usuário
  private readonly ROLES_KEY = 'userRoles'; // <-- Para guardar as roles

  // --- 3. BehaviorSubjects para guardar o estado ---
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  private userRolesSubject = new BehaviorSubject<string[]>([]);

  // Observáveis públicos (para seus componentes usarem)
  public currentUser$ = this.currentUserSubject.asObservable();
  public userRoles$ = this.userRolesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStateFromToken();
  }

  /**
   * Tenta carregar o estado do token salvo no localStorage
   */
  private loadStateFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        // Decodifica o token para re-hidratar o estado
        this.setAuthStateFromToken(token);
      } catch (error) {
        // Token inválido ou expirado
        console.error("Token inválido ao carregar. Fazendo logout.", error);
        this.logout();
      }
    }
  }

  /**
   * @param payload 
   * @returns 
   */
  login(payload: IAuthSignIn): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/signin`, payload).pipe(
      tap(response => {

        this.setAuthStateFromToken(response.token);

        this.navigateOnLogin();
      })
    );
  }

  /**
   * @param token 
   */
  private setAuthStateFromToken(token: string): void {
    try {
      // 1. Decodifica o payload
      const payload = jwtDecode<JwtPayload>(token);

      console.log('Payload do JWT Decodificado:', payload);
      // 2. Extrai os dados
      const user: IUser = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
      };
      // Garante que 'roles' seja um array, mesmo se não vier no token
      const roles: string[] = payload.roles || [];

      // 3. Salva TUDO no LocalStorage
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.ROLES_KEY, JSON.stringify(roles));

      // 4. Atualiza os BehaviorSubjects (para o app reagir)
      this.currentUserSubject.next(user);
      this.userRolesSubject.next(roles);

      console.log('Verificando permissão após login: O usuário é Staff (Colaborador)?', this.isStaff());

    } catch (error) {
      console.error("Falha ao decodificar o token", error);
      this.logout();
    }
  }


  private navigateOnLogin(): void {
    // --- LOGS ADICIONADOS PARA DEPURAR ---
    const isAdmin = this.isAdmin();
    console.log('Navegando após login. Checando permissão...');
    console.log('O usuário é Admin?', isAdmin);

    if (isAdmin) {
      console.log('REDIRECIONANDO PARA: /admin/dashboard');
      this.router.navigate(['/admin/dashboard']);
    } else {
      console.log('REDIRECIONANDO PARA: /admin/pedidos');
      this.router.navigate(['/admin/pedidos']);
    }
  }

  /**
   * @param payload 
   * @returns 
   */
  register(payload: IAuthSignUp): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, payload);
  }

  /**
   */
  logout(): void {

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROLES_KEY);

    // Limpa os subjects
    this.currentUserSubject.next(null);
    this.userRolesSubject.next([]);

    this.router.navigate(['/login']);
  }

  /**
   * * @returns 
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * * @returns
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public get userRoles(): string[] {
    return this.userRolesSubject.getValue();
  }

  public isAdmin(): boolean {
    return this.userRoles.includes('ADMINISTRADOR');
  }

  public isStaff(): boolean {
    return this.userRoles.includes('COLABORADOR');
  }


  /**
   * @param userId 
   * @returns 
   */
  getUserRoles(userId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/users/${userId}/roles`);
  }

  /**
   * * @param userId 
   * @param roleIds 
   */
  setUserRoles(userId: number, roleIds: number[]): Observable<any> {
    const payload = { roleIds };
    console.log('Definindo roles para o usuário:', userId, 'com roles:', roleIds);
    return this.http.put(`${this.apiUrl}/users/${userId}/roles`, payload);
  }
}

