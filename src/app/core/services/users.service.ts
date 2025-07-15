import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Interface para definir a estrutura de um usuário
export interface User {
  id: number;
  name: string;
  cpf: string;
  role: 'Atendente' | 'Caixa' | 'Gerente';
  phone: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private mockUsers: User[] = [
    { id: 1, name: 'Ramesh Chaudhary', cpf: '123.456.789-00', role: 'Atendente', phone: '6523787839', email: 'ramesh@email.com' },
    { id: 2, name: 'Ana Beatriz', cpf: '111.222.333-44', role: 'Caixa', phone: '11987654321', email: 'ana.b@email.com' },
    { id: 3, name: 'Carlos de Souza', cpf: '555.666.777-88', role: 'Caixa', phone: '21912345678', email: 'carlos.souza@email.com' },
    { id: 4, name: 'Mariana Lima', cpf: '999.888.777-66', role: 'Gerente', phone: '31988887777', email: 'mari.lima@email.com' },
    { id: 5, name: 'João da Silva', cpf: '000.111.222-33', role: 'Atendente', phone: '41999998888', email: 'joao.silva@email.com' },
  ];

  constructor() { }

  getUsers(): Observable<User[]> {
    return of(this.mockUsers).pipe(delay(400));
  }

  updateUser(updatedUser: User): Observable<User> {
    const index = this.mockUsers.findIndex(u => u.id === updatedUser.id);
    if (index > -1) {
      this.mockUsers[index] = updatedUser;
    }
    console.log(`Usuário ${updatedUser.id} atualizado.`);
    return of(updatedUser).pipe(delay(300));
  }

  deleteUser(userId: number): Observable<{ success: boolean }> {
    this.mockUsers = this.mockUsers.filter(u => u.id !== userId);
    console.log(`Usuário ${userId} deletado.`);
    return of({ success: true }).pipe(delay(300));
  }
}
