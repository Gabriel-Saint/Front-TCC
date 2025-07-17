import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Importando as novas interfaces
import { IUser, IUserUpdatePayload } from '../../core/interfaces/user/user.interface'; // Crie este arquivo ou ajuste o caminho

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // A URL base para as operações de usuário está no controller 'auth'
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  /**
   * Busca todos os usuários da API.
   * Corresponde a: GET /auth/users
   */
  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/users`);
  }

  /**
   * Atualiza um usuário existente.
   * Corresponde a: PATCH /auth/:id
   * @param id O ID do usuário a ser atualizado.
   * @param payload Os dados a serem modificados.
   */
  updateUser(id: number, payload: IUserUpdatePayload): Observable<IUser> {
    return this.http.patch<IUser>(`${this.apiUrl}/${id}`, payload);
  }

  /**
   * Exclui um usuário da API.
   * @param userId O ID do usuário a ser excluído.
   */
  deleteUser(userId: number): Observable<void> {
    console.log(`Deleting user with ID: ${userId}`);
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}