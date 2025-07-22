import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRole, IRolePayload } from '../interfaces/role/role.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) { }

  findAll(): Observable<IRole[]> {
    return this.http.get<IRole[]>(this.apiUrl);
  }

  create(payload: IRolePayload): Observable<IRole> {
    return this.http.post<IRole>(this.apiUrl, payload);
  }

  update(id: number, payload: IRolePayload): Observable<IRole> {
    return this.http.put<IRole>(`${this.apiUrl}/${id}`, payload);
  }

  deactivate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
