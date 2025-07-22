import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

import { IAuthSignIn, IAuthSignUp, IAuthResponse } from '../../core/interfaces/auth/auth.inteface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'accessToken';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * @param payload 
   * @returns 
   */
  login(payload: IAuthSignIn): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/signin`, payload).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
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
    this.router.navigate(['/login']);
  }

  /**
   *
   * @param token 
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * 
   * @returns 
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * 
   * @returns
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  /**
   *
   * @param userId 
   * @returns 
   */
  getUserRoles(userId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/users/${userId}/roles`);
  }

  /**
   * 
   * @param userId 
   * @param roleIds 
   */
  setUserRoles(userId: number, roleIds: number[]): Observable<any> {
    const payload = { roleIds };
    return this.http.put(`${this.apiUrl}/users/${userId}/roles`, payload);
  }
}
