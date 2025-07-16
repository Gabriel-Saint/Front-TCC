import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { IProduct, IProductPayload } from '../../core/interfaces/product/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // Constrói a URL base da API de produtos a partir do arquivo de environment
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  /**
   * Busca todos os produtos da API.
   * @returns Um Observable com um array de produtos.
   */
  findAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl);
  }

  /**
   * Busca um único produto pelo seu ID.
   * @param id O ID do produto a ser buscado.
   * @returns Um Observable com os dados do produto.
   */
  findOne(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo produto, incluindo o upload da imagem.
   * @param payload Os dados do produto a serem criados, conforme a interface IProductPayload.
   * @returns Um Observable com o produto recém-criado.
   */
  create(payload: IProductPayload): Observable<IProduct> {
    const formData = this.buildFormData(payload);
    // A rota no backend para upload é 'products/upload'
    return this.http.post<IProduct>(`${this.apiUrl}/upload`, formData);
  }

  /**
   * Atualiza um produto existente, com a possibilidade de enviar uma nova imagem.
   * @param id O ID do produto a ser atualizado.
   * @param payload Os novos dados do produto.
   * @returns Um Observable com os dados do produto atualizado.
   */
  update(id: number, payload: IProductPayload): Observable<IProduct> {
    const formData = this.buildFormData(payload);
    return this.http.put<IProduct>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Exclui um produto da API.
   * @param id O ID do produto a ser excluído.
   * @returns Um Observable que completa quando a operação é bem-sucedida.
   */
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Método auxiliar para construir o objeto FormData a partir do payload.
   * Isso é necessário para enviar arquivos (imagem) e dados de texto na mesma requisição.
   * @param payload Os dados do produto.
   * @returns Um objeto FormData pronto para ser enviado.
   */
  private buildFormData(payload: IProductPayload): FormData {
    const formData = new FormData();

    // Adiciona a imagem ao FormData se ela existir e for um arquivo
    if (payload.image && payload.image instanceof File) {
      formData.append('image', payload.image, payload.image.name);
    }

    // Adiciona os outros campos ao FormData
    formData.append('name', payload.name);
    formData.append('price', String(payload.price));
    formData.append('categoryId', String(payload.categoryId));
    formData.append('description', payload.description);
    formData.append('visibility', String(payload.visibility));

    return formData;
  }
}
