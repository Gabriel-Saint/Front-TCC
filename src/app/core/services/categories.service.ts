import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


import { ICategory, ICategoryPayload } from '../../core/interfaces/category/category.interface'; 

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) { }

  /**
   * Busca todas as categorias da API.
   * Corresponde a: GET /category
   * @returns Um Observable com um array de categorias.
   */
  findAll(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.apiUrl);
  }

  /**
   * Busca uma única categoria pelo seu ID.
   * Corresponde a: GET /category/:id
   * @param id O ID da categoria a ser buscada.
   * @returns 
   */
  findOne(id: string): Observable<ICategory> {
    return this.http.get<ICategory>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria uma nova categoria.
   * Corresponde a: POST /category
   * @param payload
   * @returns Um Observable com a categoria recém-criada.
   */
  create(payload: ICategoryPayload): Observable<ICategory> {
    return this.http.post<ICategory>(this.apiUrl, payload);
  }

  /**
   * Atualiza uma categoria existente.
   * Corresponde a: PUT /category/:id
   * @param id 
   * @param payload
   * @returns
   */
  update(id: string, payload: ICategoryPayload): Observable<ICategory> {
    return this.http.put<ICategory>(`${this.apiUrl}/${id}`, payload);
  }

  /**
   * Exclui uma categoria da API.
   * Corresponde a: DELETE /category/:id
   * @param id 
   * @returns 
   */
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
